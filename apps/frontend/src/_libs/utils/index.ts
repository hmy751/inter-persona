
export const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const urlToFile = async (url: string, filename: string, mimeType: string) => {
  const response = await fetch(url);
  const blob = await response.blob();

  return new File([blob], filename, { type: mimeType });
};
