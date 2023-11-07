import { Request, Response, NextFunction } from "express";
const express = require("express");
const app = express();
export const errorhandler = () => {
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || 500);
    res.json({
      error: err.message,
    });
  });
};
