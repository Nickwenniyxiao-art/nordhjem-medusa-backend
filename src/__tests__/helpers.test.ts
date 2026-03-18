import { decryptField, encryptField, isEncrypted } from '../api/middlewares/field-encryption';

describe('field encryption helpers', () => {
  const oldKey = process.env.FIELD_ENCRYPTION_KEY;

  beforeEach(() => {
    process.env.FIELD_ENCRYPTION_KEY = '12345678901234567890123456789012';
  });

  afterAll(() => {
    process.env.FIELD_ENCRYPTION_KEY = oldKey;
  });

  it('marks encrypted payloads correctly', () => {
    expect(isEncrypted('enc::something')).toBe(true);
    expect(isEncrypted('plain')).toBe(false);
  });

  it('encrypts and decrypts values', () => {
    const plain = 'nordhjem-test-value';
    const encrypted = encryptField(plain);

    expect(encrypted).not.toEqual(plain);
    expect(decryptField(encrypted)).toEqual(plain);
  });
});
