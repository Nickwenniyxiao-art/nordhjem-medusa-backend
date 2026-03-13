import { defineLink } from "@medusajs/framework/utils"
import ProductModule from "@medusajs/medusa/product"
import RestockModule from "../modules/restock"

export default defineLink(
  {
    linkable: RestockModule.linkable.restockSubscription,
    field: "variant_id",
  },
  ProductModule.linkable.productVariant,
  {
    readOnly: true,
  }
)
