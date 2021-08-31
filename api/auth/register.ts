import { Request, Response } from "express";

export function register(req: Request, res: Response) {
    res.send("Registro exitoso");
}
