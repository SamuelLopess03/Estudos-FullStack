export const addThousandsSeparator = (num) => {
  if (num == null || isNaN(num)) return "";

  const fixedNum = Number(num).toFixed(2);

  const numStr = fixedNum.replace(".", ",");

  const parts = numStr.split(",");
  let integerPart = parts[0];
  const fractionalPart = parts[1];

  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return `${integerPart},${fractionalPart}`;
};
