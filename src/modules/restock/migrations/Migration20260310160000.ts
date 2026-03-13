import { Migration } from "@mikro-orm/migrations";

export class Migration20260310160000 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`
      CREATE TABLE IF NOT EXISTS "restock_subscription" (
        "id" text NOT NULL,
        "variant_id" text NOT NULL,
        "sales_channel_id" text NULL,
        "email" text NOT NULL,
        "customer_id" text NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "deleted_at" timestamptz NULL,
        CONSTRAINT "restock_subscription_pkey" PRIMARY KEY ("id")
      );
    `);

    this.addSql(
      `CREATE UNIQUE INDEX IF NOT EXISTS "IDX_RESTOCK_SUBSCRIPTION_UNIQUE" ON "restock_subscription" ("variant_id", "sales_channel_id", "email");`,
    );
  }

  override async down(): Promise<void> {
    this.addSql('DROP TABLE IF EXISTS "restock_subscription" CASCADE;');
  }
}
