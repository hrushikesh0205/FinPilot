import { createContext, useContext, useState, useCallback } from 'react';

// ─── Exchange Rates (base: INR) ────────────────────────────────────────────
// Abstracted into a lookup so live rates can replace this table later.
const EXCHANGE_RATES = {
  INR: 1,
  USD: 0.012,
  EUR: 0.011,
  GBP: 0.0094,
  AED: 0.044,
  JPY: 1.76,
  CAD: 0.016,
  AUD: 0.018,
};

const CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
];

const STORAGE_KEY = 'finpilot_currency';

function getStoredCurrency() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Validate the stored code is still supported
      if (CURRENCIES.find((c) => c.code === parsed.code)) return parsed;
    }
  } catch {
    // ignore
  }
  return CURRENCIES[0]; // default: INR
}

const CurrencyContext = createContext(null);

export function CurrencyProvider({ children }) {
  const [selectedCurrency, setSelectedCurrency] = useState(getStoredCurrency);

  const setCurrency = useCallback((code) => {
    const found = CURRENCIES.find((c) => c.code === code);
    if (!found) return;
    setSelectedCurrency(found);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(found));
    } catch {
      // ignore storage errors
    }
  }, []);

  /**
   * Convert an INR amount to the selected currency and format it.
   * @param {number} inrAmount - Amount in INR (base currency)
   * @param {object} [opts] - Intl.NumberFormat options override
   */
  const formatAmount = useCallback(
    (inrAmount, opts = {}) => {
      if (inrAmount == null || isNaN(inrAmount)) return `${selectedCurrency.symbol}0`;
      const rate = EXCHANGE_RATES[selectedCurrency.code] ?? 1;
      const converted = inrAmount * rate;

      // Use compact notation for very large numbers
      const formatted = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: selectedCurrency.code === 'JPY' ? 0 : 2,
        ...opts,
      }).format(converted);

      return `${selectedCurrency.symbol}${formatted}`;
    },
    [selectedCurrency]
  );

  /**
   * Raw conversion (no formatting) — useful for chart tick formatters
   */
  const convertAmount = useCallback(
    (inrAmount) => {
      if (inrAmount == null || isNaN(inrAmount)) return 0;
      const rate = EXCHANGE_RATES[selectedCurrency.code] ?? 1;
      return inrAmount * rate;
    },
    [selectedCurrency]
  );

  return (
    <CurrencyContext.Provider
      value={{
        currency: selectedCurrency,
        currencies: CURRENCIES,
        setCurrency,
        formatAmount,
        convertAmount,
        symbol: selectedCurrency.symbol,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used inside CurrencyProvider');
  return ctx;
}
