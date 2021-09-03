import { Request, Response } from "express";
import usersDB from "../../../database/users";
import { User } from "../../../domain/user";

export async function logout(req: Request, res: Response) {
    try {
        const userJwt = req.get("Authorization").slice("Bearer ".length);
        const userObj: any = await User.validateToken(userJwt);

        let { error } = userObj;
        if (error) {
            res.status(401).json({ error });
            return;
        }

        const logoutResult = await usersDB.logoutUser(userObj.username);
        ({ error } = logoutResult);
        if (error) {
            res.status(500).json({ error });
            return;
        }
        res.json(logoutResult);
    } catch (e) {
        res.status(500).json(e);
    }
}
