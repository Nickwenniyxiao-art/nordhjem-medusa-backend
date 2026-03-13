import { MedusaService, InjectManager, MedusaContext } from "@medusajs/framework/utils"
import { Context } from "@medusajs/framework/types"
import { EntityManager } from "@mikro-orm/postgresql"
import RestockSubscription from "./models/restock-subscription"

type UniqueSubscription = {
  variant_id: string
  sales_channel_id: string | null
}

class RestockModuleService extends MedusaService({
  RestockSubscription,
}) {
  @InjectManager()
  async getUniqueSubscriptions(
    @MedusaContext() context: Context = {}
  ): Promise<UniqueSubscription[]> {
    const manager = context.manager as EntityManager

    const query = manager
      .createQueryBuilder("restock_subscription", "rs")
      .select(["variant_id", "sales_channel_id"])
      .distinct()

    return await query.execute<UniqueSubscription[]>()
  }
}

export default RestockModuleService
