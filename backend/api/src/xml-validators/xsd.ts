import { NextFunction } from "express";
import fs from 'fs';

export default function validateRequest() {
  return async (req: Request, res: Response, next: NextFunction) => {
    /* try {

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400);
      }
      next(error);
    } */
  };
}