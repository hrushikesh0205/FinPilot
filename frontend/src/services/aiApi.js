import axiosInstance from './axiosInstance';

/**
 * Scan a receipt image using backend AI multimodal OCR
 * @param {File} file - Receipt image file (JPEG, PNG, WEBP)
 * @returns {Promise<AxiosResponse<{
 *   merchant: string,
 *   receiptNumber: string,
 *   date: string,
 *   subtotal: number,
 *   tax: number,
 *   total: number,
 *   currency: string,
 *   paymentMethod: string,
 *   category: string,
 *   items: Array<{ name: string, quantity: number, price: number }>,
 *   rawText: string
 * }>>}
 */
export const scanReceipt = (file) => {
  const formData = new FormData();
  formData.append('file', file);

  return axiosInstance.post('/api/ai/receipt/scan', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

/**
 * Fetch personalized AI financial insights and recommendations based on user expenses & budgets
 * @returns {Promise<AxiosResponse<{
 *   summary: string,
 *   keyInsights: string[],
 *   recommendations: string[],
 *   totalSpent: number,
 *   totalBudget: number,
 *   currency: string
 * }>>}
 */
export const getFinancialInsights = () =>
  axiosInstance.get('/api/ai/insights');
