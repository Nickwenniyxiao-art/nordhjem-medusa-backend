import { BRAND_MODULE } from "../modules/brand";
import { RESTOCK_MODULE } from "../modules/restock";
import { TICKET_MODULE } from "../modules/ticket";

describe("module identifier constants", () => {
  it("exposes expected module keys", () => {
    expect(BRAND_MODULE).toBe("brandModuleService");
    expect(RESTOCK_MODULE).toBe("restock");
    expect(TICKET_MODULE).toBe("ticketModuleService");
  });
});
