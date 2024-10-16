import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const autheticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bearder = req.headers.authorization;

  if (!bearder) {
    const error = new Error("No autorizado");
    return res.status(401).json({ error: error.message });
  }

  const [, token] = bearder.split(" ");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (typeof decoded === "object" && decoded.id) {
      const user = await User.findById(decoded.id).select("_id name email");
      if (user) {
        req.user = user;
      } else {
        return res.status(401).json({ error: "Token no valido" });
      }
    }
  } catch (error) {
    return res.status(401).json({ error: "Token no valido" });
  }

  next();
};
