import FormData from 'form-data';

export const toFormData = (object: Record<string, any>) => {
  const formData = new FormData();

  Object.entries(object).forEach(([key, value]) => {
    if (key === 'files') {
      value.forEach((file: { buffer: Buffer; originalname: string; }) => {
        formData.append('files', file.buffer, { filename: file.originalname });
      });
    } else {
      const formattedValue = typeof value === 'object' ? JSON.stringify(value) : value || '';

      formData.append(key, formattedValue);
    }
  });

  return formData;
};
