import FormData from 'form-data';

export const toFormData = (object: Record<string, any>) => {
  const formData = new FormData();

  Object.entries(object).forEach(([key, value]) => {
    if (key === 'files') {
      value.forEach((file: any) => (
        formData.append('files', file)
      ));
    } else {
      formData.append(key, value);
    }
  });

  return formData;
};
