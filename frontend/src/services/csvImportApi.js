import axiosInstance from './axiosInstance';

export const previewCsv = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return axiosInstance.post('/api/import/csv/preview', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const confirmCsvImport = (data) =>
  axiosInstance.post('/api/import/csv/confirm', data);
