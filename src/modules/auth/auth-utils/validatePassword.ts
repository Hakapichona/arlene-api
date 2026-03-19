import bcrypt from 'bcrypt';

export const validatePassword = async (
  pass: string,
  currentPass: string,
): Promise<boolean> => {
  return await bcrypt.compare(pass, currentPass);
};
