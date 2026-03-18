import { BRAND_MODULE } from '../modules/brand';
import { RESTOCK_MODULE } from '../modules/restock';
import { TICKET_MODULE } from '../modules/ticket';

describe('module constants as utility values', () => {
  it('exposes stable module identifiers', () => {
    expect(BRAND_MODULE).toBe('brandModuleService');
    expect(RESTOCK_MODULE).toBe('restock');
    expect(TICKET_MODULE).toBe('ticketModuleService');
  });

  it('ensures module identifiers are non-empty strings', () => {
    const values = [BRAND_MODULE, RESTOCK_MODULE, TICKET_MODULE];

    for (const value of values) {
      expect(typeof value).toBe('string');
      expect(value.length).toBeGreaterThan(0);
    }
  });
});
