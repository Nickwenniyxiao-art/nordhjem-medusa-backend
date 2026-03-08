import { defineLink } from "@medusajs/framework/utils"
import ProductModule from "@medusajs/medusa/product"
import RestockModule from "../modules/restock"

export default defineLink(
  RestockModule.linkable.restockSubscription,
  ProductModule.linkable.productVariant,
  {
    database: {
      foreignKey: "variant_id",
    },
    readOnly: true,
  }
)
