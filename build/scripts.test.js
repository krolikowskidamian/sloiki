import { currencyConverter } from './script';
describe('scripts.jsx', () => {
  describe('currencyConverted', () => {
    it('should convert from PLN to US DOLLAR', () => {
      const result = currencyConverter(100, 'pln', '$');
      expect(result).toBe(35);
    });
  });
});