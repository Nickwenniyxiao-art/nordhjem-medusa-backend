import { Migration } from "@mikro-orm/migrations"

export class Migration202603090001 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`
      CREATE TABLE IF NOT EXISTS "ticket" (
        "id" text NOT NULL,
        "order_id" text NOT NULL,
        "customer_id" text NULL,
        "type" text CHECK ("type" IN ('return', 'exchange', 'complaint', 'inquiry')) NOT NULL,
        "status" text CHECK ("status" IN ('open', 'in_progress', 'resolved', 'closed')) NOT NULL DEFAULT 'open',
        "priority" text CHECK ("priority" IN ('low', 'medium', 'high', 'urgent')) NOT NULL DEFAULT 'medium',
        "subject" text NOT NULL,
        "description" text NULL,
        "metadata" jsonb NULL,
        "resolved_at" timestamptz NULL,
        "closed_at" timestamptz NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "deleted_at" timestamptz NULL,
        CONSTRAINT "ticket_pkey" PRIMARY KEY ("id")
      );
    `)

    this.addSql(`
      CREATE TABLE IF NOT EXISTS "ticket_message" (
        "id" text NOT NULL,
        "ticket_id" text NOT NULL,
        "sender_type" text CHECK ("sender_type" IN ('customer', 'admin')) NOT NULL,
        "sender_id" text NULL,
        "body" text NOT NULL,
        "metadata" jsonb NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "deleted_at" timestamptz NULL,
        CONSTRAINT "ticket_message_pkey" PRIMARY KEY ("id")
      );
    `)

    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_ticket_order_id" ON "ticket" ("order_id");`)
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_ticket_status" ON "ticket" ("status");`)
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_ticket_type" ON "ticket" ("type");`)
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_ticket_message_ticket_id" ON "ticket_message" ("ticket_id");`)
  }

  override async down(): Promise<void> {
    this.addSql('DROP TABLE IF EXISTS "ticket_message" CASCADE;')
    this.addSql('DROP TABLE IF EXISTS "ticket" CASCADE;')
  }
}
