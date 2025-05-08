import jwt from "jsonwebtoken";

export function generateToken(userId: string) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  return token;
}
