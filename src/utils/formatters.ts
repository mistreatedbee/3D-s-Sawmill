export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR'
  }).format(amount);
};

export const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat('en-ZA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(dateString));
};

// Alias for backward compatibility
export const formatPrice = formatCurrency;

// Default export object for convenient usage
export const formatters = {
  formatPrice: formatCurrency,
  formatCurrency,
  formatDate
};