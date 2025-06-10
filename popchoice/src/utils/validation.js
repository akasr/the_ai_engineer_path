export const sanitizeInput = input => {
  if (typeof input !== 'string') {
    return '';
  }

  const temp = document.createElement('div');
  temp.textContent = input.trim();
  return temp.innerHTML;
};

export const isValidPositiveInteger = value => {
  const num = parseInt(value, 10);
  return !isNaN(num) && num > 0 && num.toString() === value.trim();
};

export const isValidStringInput = input => {
  const sanitized = sanitizeInput(input);
  return sanitized.length > 0;
};
