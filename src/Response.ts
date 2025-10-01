import express,{ Response } from "express";

export const ok = (res: Response, data: any, msg?: string, code = 200) =>
  res.status(code).json({ success: true, data, message: msg });

export const fail = (res: Response, msg: string, code = 400) =>
  res.status(code).json({ success: false, data: null, message: msg });
