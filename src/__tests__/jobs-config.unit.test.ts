import { config as checkRestockConfig } from "../jobs/check-restock";
import { config as expireReservationsConfig } from "../jobs/expire-reservations";

describe("job schedules", () => {
  it("exports valid check-restock schedule config", () => {
    expect(checkRestockConfig).toEqual({
      name: "check-restock",
      schedule: "0 * * * *",
    });
  });

  it("exports valid expire-reservations schedule config", () => {
    expect(expireReservationsConfig).toEqual({
      name: "expire-reservations",
      schedule: "*/5 * * * *",
    });
  });
});
