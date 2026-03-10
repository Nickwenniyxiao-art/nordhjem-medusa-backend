import { defineLink } from "@medusajs/framework/utils"
import SalesChannelModule from "@medusajs/medusa/sales-channel"
import BrandModule from "../modules/brand"

export default defineLink(
  BrandModule.linkable.brand,
  SalesChannelModule.linkable.salesChannel,
  {
    isList: false
        readOnly: false,,
  }
)
