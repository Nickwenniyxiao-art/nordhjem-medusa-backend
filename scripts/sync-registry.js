#!/usr/bin/env node

const fs = require("node:fs/promises")
const path = require("node:path")

const BASE_URL = "https://api.github.com"
const GRAPHQL_URL = `${BASE_URL}/graphql`
const REGISTRY_PATH = path.join(process.cwd(), "docs", "TASK-REGISTRY.json")
const DEFAULT_REPO = "Nickwenniyxiao-art/nordhjem-medusa-backend"
const PROJECT_ID = process.env.PROJECT_ID
const GH_TOKEN = process.env.GH_TOKEN
const REPOSITORY = process.env.GITHUB_REPOSITORY || DEFAULT_REPO

const [owner, repo] = REPOSITORY.split("/")

if (!owner || !repo) {
  console.error(`[error] Invalid GITHUB_REPOSITORY value: ${REPOSITORY}`)
  process.exit(1)
}

if (!GH_TOKEN) {
  console.error("[error] GH_TOKEN is required")
  process.exit(1)
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const request = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${GH_TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(options.headers || {})
    }
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Request failed: ${response.status} ${response.statusText} :: ${text}`)
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

const graphqlRequest = async (query, variables, extraHeaders = {}) => {
  const payload = await request(
    GRAPHQL_URL,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...extraHeaders
      },
      body: JSON.stringify({ query, variables })
    }
  )

  if (payload.errors?.length) {
    throw new Error(`GraphQL error: ${JSON.stringify(payload.errors)}`)
  }

  return payload.data
}

const normalizeState = (status) => (status === "done" ? "closed" : "open")

const findIssueByLabel = async (label) => {
  const qs = new URLSearchParams({
    labels: label,
    state: "all",
    per_page: "100"
  })
  const issues = await request(
    `${BASE_URL}/repos/${owner}/${repo}/issues?${qs.toString()}`,
    { method: "GET" }
  )

  return issues.find((issue) => !issue.pull_request) || null
}

const createIssue = async ({ title, body, labels }) => {
  return request(`${BASE_URL}/repos/${owner}/${repo}/issues`, {
    method: "POST",
    body: JSON.stringify({ title, body, labels })
  })
}

const updateIssue = async (issueNumber, patch) => {
  return request(`${BASE_URL}/repos/${owner}/${repo}/issues/${issueNumber}`, {
    method: "PATCH",
    body: JSON.stringify(patch)
  })
}

const ensureIssueState = async (issue, desiredState) => {
  if (issue.state === desiredState) {
    console.log(`  [skip] Issue #${issue.number} already ${desiredState}`)
    return issue
  }

  console.log(`  [update] Issue #${issue.number} -> ${desiredState}`)
  return updateIssue(issue.number, { state: desiredState })
}

const ensureProjectItem = async (contentId) => {
  if (!PROJECT_ID) {
    console.log("  [skip] PROJECT_ID is not set, skip project board sync")
    return
  }

  const addToProjectMutation = `
    mutation($projectId: ID!, $contentId: ID!) {
      addProjectV2ItemById(input: {
        projectId: $projectId,
        contentId: $contentId
      }) {
        item { id }
      }
    }
  `

  try {
    const result = await graphqlRequest(addToProjectMutation, {
      projectId: PROJECT_ID,
      contentId
    })
    const itemId = result?.addProjectV2ItemById?.item?.id
    console.log(`  [project] Added to project item ${itemId || "(unknown id)"}`)
  } catch (error) {
    const message = String(error?.message || error)
    if (message.includes("already exists")) {
      console.log("  [project] Already on project board")
      return
    }

    throw error
  }
}

const ensureSubIssueLink = async (parentNodeId, subIssueNodeId, actionId) => {
  const addSubIssueMutation = `
    mutation($parentId: ID!, $subIssueId: ID!) {
      addSubIssue(input: {
        issueId: $parentId,
        subIssueId: $subIssueId
      }) {
        issue { id }
        subIssue { id }
      }
    }
  `

  try {
    await graphqlRequest(
      addSubIssueMutation,
      {
        parentId: parentNodeId,
        subIssueId: subIssueNodeId
      },
      {
        "GraphQL-Features": "sub_issues"
      }
    )
    console.log(`  [link] Linked ${actionId} as sub-issue`)
  } catch (error) {
    const message = String(error?.message || error)
    if (
      message.includes("already exists") ||
      message.includes("already a sub-issue") ||
      message.includes("duplicate sub-issues") ||
      message.includes("only have one parent")
    ) {
      console.log(`  [link] ${actionId} already linked (skipped duplicate)`)
      return
    }

    throw error
  }
}

const createTaskBody = (phase, task) => {
  return [
    `## Background`,
    `Auto-synced from docs/TASK-REGISTRY.json.`,
    ``,
    `- Task ID: ${task.id}`,
    `- Phase: ${phase}`,
    `- Priority: ${task.priority || "N/A"}`,
    `- Status: ${task.status || "N/A"}`
  ].join("\n")
}

const createActionBody = (task, action) => {
  return [
    `## Background`,
    `Auto-synced from docs/TASK-REGISTRY.json.`,
    ``,
    `- Parent Task: ${task.id}`,
    `- Action ID: ${action.id}`,
    `- Status: ${action.status || "N/A"}`,
    `- PR: ${action.pr || "N/A"}`,
    `- Issue: ${action.issue || "N/A"}`,
    `- Completed At: ${action.completed_at || "N/A"}`,
    `- Notes: ${action.notes || "N/A"}`
  ].join("\n")
}

const syncTask = async (phase, task) => {
  const taskLabel = `egp-task:${task.id}`
  const parentTitle = `[EGP] ${task.id}: ${task.name}`
  const parentBody = createTaskBody(phase, task)

  console.log(`\n[task] ${task.id} ${task.name}`)

  let parentIssue = await findIssueByLabel(taskLabel)

  if (!parentIssue) {
    console.log("  [create] Parent issue")
    parentIssue = await createIssue({
      title: parentTitle,
      body: parentBody,
      labels: ["egp-task", taskLabel]
    })
  } else {
    const patch = {}
    if (parentIssue.title !== parentTitle) {
      patch.title = parentTitle
    }
    if ((parentIssue.body || "") !== parentBody) {
      patch.body = parentBody
    }

    if (Object.keys(patch).length > 0) {
      console.log(`  [update] Parent issue #${parentIssue.number}`)
      parentIssue = await updateIssue(parentIssue.number, patch)
    } else {
      console.log(`  [skip] Parent issue #${parentIssue.number} already up-to-date`)
    }
  }

  await ensureProjectItem(parentIssue.node_id)
  await delay(200)

  for (const action of task.actions || []) {
    await syncAction(task, action, parentIssue)
    await delay(250)
  }
}

const syncAction = async (task, action, parentIssue) => {
  const actionLabel = `egp-action:${action.id}`
  const actionTitle = `[EGP] ${action.id}: ${action.name}`
  const actionBody = createActionBody(task, action)
  const desiredState = normalizeState(action.status)

  console.log(`  [action] ${action.id} ${action.name}`)

  let subIssue = await findIssueByLabel(actionLabel)

  if (!subIssue) {
    console.log("    [create] Sub-issue")
    subIssue = await createIssue({
      title: actionTitle,
      body: actionBody,
      labels: ["egp-action", actionLabel]
    })
  } else {
    const patch = {}
    if (subIssue.title !== actionTitle) {
      patch.title = actionTitle
    }
    if ((subIssue.body || "") !== actionBody) {
      patch.body = actionBody
    }

    if (Object.keys(patch).length > 0) {
      console.log(`    [update] Sub-issue #${subIssue.number}`)
      subIssue = await updateIssue(subIssue.number, patch)
    } else {
      console.log(`    [skip] Sub-issue #${subIssue.number} already up-to-date`)
    }
  }

  subIssue = await ensureIssueState(subIssue, desiredState)
  await ensureSubIssueLink(parentIssue.node_id, subIssue.node_id, action.id)
  await ensureProjectItem(subIssue.node_id)
}

const main = async () => {
  console.log(`[start] Sync registry for ${owner}/${repo}`)
  const registryRaw = await fs.readFile(REGISTRY_PATH, "utf8")
  const registry = JSON.parse(registryRaw)

  const projects = registry.projects || []
  for (const project of projects) {
    const phase = project.phase || project.name || "N/A"
    for (const task of project.tasks || []) {
      await syncTask(phase, task)
      await delay(300)
    }
  }

  console.log("\n[done] Sync complete")
}

main().catch((error) => {
  console.error("[fatal] sync failed")
  console.error(error)
  process.exit(1)
})
