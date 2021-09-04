import { Request, Response } from "express";
import usersDB from "../../../database/users";
import { User } from "../../../domain/user";

export async function addFavorite(req: Request, res: Response) {
    try {
        if (!req.get("Authorization")) {
            return res
                .status(401)
                .send({ status: 401, message: "Unauthorized" });
        }

        const userJwt = req.get("Authorization").slice("Bearer ".length);
        const userObj: any = User.validateToken(userJwt);

        let { error } = userObj;
        if (error) {
            res.status(401).json({ error });
            return;
        }

        const coinId = req.params.id;

        await usersDB.addFavorite(userObj.username, coinId);

        const response = {
            status: 200,
            message: "success",
        };

        res.send(response);
    } catch (e) {
        res.status(500).json(e);
    }
}
