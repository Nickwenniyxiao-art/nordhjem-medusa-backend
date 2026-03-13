import { MedusaContainer } from "@medusajs/framework/types";
import { sendRestockNotificationsWorkflow } from "../workflows/send-restock-notifications";

export default async function checkRestockJob(container: MedusaContainer) {
  const logger = container.resolve("logger") as {
    info: (message: string) => void;
    error: (message: string) => void;
  };

  try {
    const { result } = await sendRestockNotificationsWorkflow(container).run({
      input: {},
    });

    logger.info(`[check-restock] Completed: ${JSON.stringify(result)}`);
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : typeof error === "object" && error !== null
          ? JSON.stringify(error)
          : String(error);
    logger.error(`[check-restock] Failed: ${errorMessage}`);
  }
}

export const config = {
  name: "check-restock",
  schedule: "0 * * * *",
};
