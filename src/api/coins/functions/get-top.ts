import { Request, Response } from "express";
import axios from "axios";
import coinsDB from "../../../database/coins";
import { Currency } from "../../../domain/currency.enum";
import { User } from "../../../domain/user";

export async function getTop(req: Request, res: Response) {
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

        const stop: number = Number(req.params.number);
        if (stop && stop < 26) {
            result = result.slice(0, stop);
        }

        const response = {
            status: 200,
            message: "success",
            coinsAmmount: result.length,
            data: result,
        };

        res.send(response);
    } catch (e) {
        res.status(500).json(e);
    }
}
