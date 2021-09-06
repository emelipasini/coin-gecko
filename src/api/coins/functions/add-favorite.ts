import { Request, Response } from "express";

import coinsDB from "../../../database/coins";
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
        const response = await saveFavorite(userObj.username, coinId);

        res.send(response);
    } catch (e) {
        res.status(500).json(e);
    }
}

export async function saveFavorite(username: string, coinId: string) {
    try {
        await coinsDB.addFavorite(username, coinId);

        return {
            status: 200,
            message: "Coin added successfully",
        };
    } catch (error) {
        return error;
    }
}
