export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

export const validateImage = (file: File): { isValid: boolean; error?: string } => {
  if (!file.type.startsWith('image/')) {
    return { isValid: false, error: 'Файл должен быть изображением' };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { isValid: false, error: 'Размер файла не должен превышать 5MB' };
  }

  return { isValid: true };
};
