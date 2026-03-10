import { model } from "@medusajs/framework/utils"

const Brand = model.define("brand", {
  id: model.id().primaryKey(),
  name: model.text(),
  slug: model.text(),
  logo_url: model.text().nullable(),
  primary_color: model.text().nullable(),
  domain: model.text().nullable(),
  metadata: model.json().nullable(),
  created_at: model.dateTime().nullable(),
  updated_at: model.dateTime().nullable(),
})

export default Brand
