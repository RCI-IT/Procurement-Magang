// src/middleware/authMiddleware.ts
// import { Request, Response, NextFunction } from 'express';

// const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
//   const token = req.cookies.token;

//   if (!token) {
//     res.status(401).json({ message: 'Unauthorized' });
//     return;
//   }

//   // If token exists and is valid, move to the next middleware
//   next();
// };

// export default authMiddleware;


import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Authorization token missing" });
    return
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded; // `user` will now be recognized thanks to the type declaration
    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    res.status(401).json({ message: "Invalid or expired token"});
    return 
  }
};

export default authMiddleware;