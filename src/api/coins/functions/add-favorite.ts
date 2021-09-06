import { Request, Response } from "express";

import { User } from "../../../domain/user";
import coinsDB from "../../../database/coins";
import usersDB from "../../../database/users";

export async function addFavorite(req: Request, res: Response) {
    try {
        const userObj = req.query.userObj as any as User;

        const session = await usersDB.getUserSession(userObj.username);
        if (!session) {
            return res.status(401).send({ message: "The session has expired" });
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
