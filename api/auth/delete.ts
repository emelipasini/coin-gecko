import { Request, Response } from "express";

export function deleteUser(req: Request, res: Response) {
    res.send("Cuenta borrada con exito");
}
