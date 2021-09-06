import { Request, Response } from "express";

import usersDB from "../../../database/users";
import { User } from "../../../domain/user";

export async function logout(req: Request, res: Response) {
    try {
        const userObj = req.query.userObj as any as User;

        const session = await usersDB.getUserSession(userObj.username);
        if (!session) {
            return res.status(401).send({ message: "The session has expired" });
        }

        const logoutResult = await usersDB.logoutUser(userObj.username);
        const { error } = logoutResult;
        if (error) {
            res.status(500).json({ error });
            return;
        }
        res.json(logoutResult);
    } catch (e) {
        res.status(500).json(e);
    }
}
