import { MedusaContainer } from "@medusajs/framework/types"
import { sendRestockNotificationsWorkflow } from "../workflows/send-restock-notifications"

export default async function checkRestockJob(container: MedusaContainer) {
  const logger = container.resolve("logger") as {
    info: (message: string) => void
    error: (message: string) => void
  }

  try {
    const { result } = await sendRestockNotificationsWorkflow(container).run({
      input: {},
    })

    logger.info(`[check-restock] Completed: ${JSON.stringify(result)}`)
  } catch (error) {
    logger.error(`[check-restock] Failed: ${error}`)
  }
}

export const config = {
  name: "check-restock",
  schedule: "0 * * * *",
}
