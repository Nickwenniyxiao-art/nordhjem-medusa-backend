import { Migration } from "@mikro-orm/migrations"

export class Migration20260310154150 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`
      CREATE TABLE IF NOT EXISTS "brand" (
        "id" text NOT NULL,
        "name" text NOT NULL,
        "slug" text NOT NULL,
        "logo_url" text NULL,
        "primary_color" text NULL,
        "domain" text NULL,
        "metadata" jsonb NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "deleted_at" timestamptz NULL,
        CONSTRAINT "brand_pkey" PRIMARY KEY ("id")
      );
    `)

    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_brand_slug" ON "brand" ("slug");`)
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_brand_domain" ON "brand" ("domain");`)
  }

  override async down(): Promise<void> {
    this.addSql('DROP TABLE IF EXISTS "brand" CASCADE;')
  }
}
