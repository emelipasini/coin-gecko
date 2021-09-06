import { Request, Response } from "express";
import axios from "axios";

import { Currency } from "../../../domain/currency.enum";
import { User } from "../../../domain/user";
import usersDB from "../../../database/users";

export async function getCoins(req: Request, res: Response) {
    try {
        const userObj = req.query.userObj as any as User;

        const session = await usersDB.getUserSession(userObj.username);
        if (!session) {
            return res.status(401).send({ message: "The session has expired" });
        }

        const userCurrency = Currency[userObj.currency];
        let page: number = Number(req.params.page);
        if (!page) {
            page = 1;
        }

        const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${userCurrency}&per_page=100&page=${page}`;
        const coinsData = await axios.get(url);

        const allCoins: Record<string, any>[] = [];

        for (const coin of coinsData.data) {
            allCoins.push({
                id: coin.id,
                name: coin.name,
                currency: userCurrency,
                price: coin.current_price,
                symbol: coin.symbol,
                image: coin.image.small,
                last_updated: coin.last_updated,
            });
        }

        const response = {
            status: 200,
            message: "success",
            coins_ammount: allCoins.length,
            next_page: `localhost:4200/coins/${page + 1}`,
            data: allCoins,
        };

        res.send(response);
    } catch (e) {
        res.status(500).json(e);
    }
}
