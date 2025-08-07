// Simple Currency Display Utility

/**
 * Format price with Indian Rupee symbol
 * @param price - The price to format
 * @returns Formatted price string with ₹ symbol
 */
export const formatPrice = (price: number): string => {
  if (price === 0) return '₹0';
  
  // Simple formatting with ₹ symbol
  return `₹${price.toLocaleString('en-IN')}`;
};

/**
 * Format amount as Indian Rupees (for analytics/revenue)
 * @param amount - The amount to format
 * @returns Formatted currency string
 */
export const formatINR = (amount: number): string => {
  if (amount === 0) return '₹0';
  return `₹${amount.toLocaleString('en-IN')}`;
};
