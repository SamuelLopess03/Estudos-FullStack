import jwt from "jsonwebtoken";

export const generateToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY);

  return token;
};

export const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  } catch (error) {
    console.error(error);
  }
};
