import { Request, Response } from "express";
import axios from "axios";

import { Currency } from "../../../domain/currency.enum";
import { User } from "../../../domain/user";
import coinsDB from "../../../database/coins";
import usersDB from "../../../database/users";

export async function getTop(req: Request, res: Response) {
    try {
        const userObj = req.query.userObj as any as User;

        const session = await usersDB.getUserSession(userObj.username);
        if (!session) {
            return res.status(401).send({ message: "The session has expired" });
        }

        const stop: number = Number(req.params.number);
        const result = await getAndSortCoins(userObj, stop);

        const response = {
            message: "success",
            coinsAmmount: result.length,
            data: result,
        };

        res.status(200).send(response);
    } catch (e) {
        res.status(500).json(e);
    }
}

export async function getAndSortCoins(userObj: User, stop?: number) {
    try {
        const faveCoins = await coinsDB.getFavorites(userObj.username);
        const userCurrency = Currency[userObj.currency];

        let searchCoins: string;
        for (let i = 0; i < faveCoins.favoriteCoins.length; i++) {
            const coin = faveCoins.favoriteCoins[i];

            if (i === 0) {
                searchCoins = coin;
            } else {
                searchCoins += `%2C${coin}`;
            }
        }

        const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${userCurrency}&ids=${searchCoins}&per_page=50&page=1`;
        const allCoins = await axios.get(url);
        let result: Record<string, any>[] = [];

        for (const coin of allCoins.data) {
            result.push({
                id: coin.id,
                name: coin.name,
                currency: userCurrency,
                price: coin.current_price,
                symbol: coin.symbol,
                image: coin.image,
                last_updated: coin.last_updated,
            });
        }

        result = result.sort((a, b) => {
            return b.price - a.price;
        });
        result = result.slice(0, 25);

        if (stop && stop < 26) {
            result = result.slice(0, stop);
        }

        return result;
    } catch (error) {
        return error;
    }
}
