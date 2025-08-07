// Indian Currency Formatting Utilities

/**
 * Format a number as Indian Rupees (INR)
 * @param amount - The amount to format
 * @param showSymbol - Whether to show the ₹ symbol (default: true)
 * @returns Formatted currency string
 */
export const formatINR = (amount: number, showSymbol: boolean = true): string => {
  if (amount === 0) return showSymbol ? '₹0' : '0';
  
  // Convert to string and split by decimal
  const parts = amount.toString().split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1] || '00';
  
  // Add commas for Indian number system (1,23,456)
  let formattedInteger = '';
  for (let i = integerPart.length - 1, j = 0; i >= 0; i--, j++) {
    if (j > 0 && j % 2 === 1 && i > 0) {
      formattedInteger = ',' + formattedInteger;
    }
    formattedInteger = integerPart[i] + formattedInteger;
  }
  
  // Ensure decimal has 2 digits
  const formattedDecimal = decimalPart.padEnd(2, '0').slice(0, 2);
  
  const symbol = showSymbol ? '₹' : '';
  return `${symbol}${formattedInteger}${formattedDecimal !== '00' ? `.${formattedDecimal}` : ''}`;
};

/**
 * Format a number as Indian Rupees with paise (for smaller amounts)
 * @param amount - The amount to format
 * @param showSymbol - Whether to show the ₹ symbol (default: true)
 * @returns Formatted currency string
 */
export const formatINRWithPaise = (amount: number, showSymbol: boolean = true): string => {
  if (amount === 0) return showSymbol ? '₹0' : '0';
  
  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);
  
  const symbol = showSymbol ? '₹' : '';
  
  if (paise === 0) {
    return formatINR(rupees, showSymbol);
  } else {
    return `${symbol}${rupees}.${paise.toString().padStart(2, '0')}`;
  }
};

/**
 * Convert USD to INR (approximate conversion rate)
 * @param usdAmount - Amount in USD
 * @returns Amount in INR
 */
export const usdToINR = (usdAmount: number): number => {
  // Using approximate conversion rate (you can update this)
  const conversionRate = 83; // 1 USD ≈ 83 INR
  return usdAmount * conversionRate;
};

/**
 * Format price for display with currency conversion
 * @param price - Price in USD
 * @param currency - Currency to display ('INR' or 'USD')
 * @returns Formatted price string
 */
export const formatPrice = (price: number, currency: 'INR' | 'USD' = 'INR'): string => {
  if (currency === 'INR') {
    const inrPrice = usdToINR(price);
    return formatINR(inrPrice);
  } else {
    return `$${price.toFixed(2)}`;
  }
};
