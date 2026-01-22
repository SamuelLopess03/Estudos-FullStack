export const validateEmail = (email) => {
  if (email.trim()) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return regex.test(email);
  }

  return false;
};
