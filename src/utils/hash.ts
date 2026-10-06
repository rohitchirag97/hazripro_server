import bcrypt from "bcryptjs";

export const hash = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

export const compareHash = async (string: string, hashedString: string) => {
  const isMatch = await bcrypt.compare(string, hashedString);
  return isMatch;
};
