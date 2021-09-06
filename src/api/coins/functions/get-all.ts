import CoinGecko from "coingecko-api";
import { Request, Response } from "express";

import { Currency } from "../../../domain/currency.enum";
import { User } from "../../../domain/user";

export async function getCoins(req: Request, res: Response) {
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

        const CoinGeckoClient = new CoinGecko();

        let coinsData = await CoinGeckoClient.coins.all();
        const allCoins: Record<string, any>[] = [];

        const userCurrency = Currency[userObj.currency];

        for (const coin of coinsData.data) {
            allCoins.push({
                id: coin.id,
                name: coin.name,
                currency: userCurrency,
                price: coin.market_data.current_price[userCurrency],
                symbol: coin.symbol,
                image: coin.image.small,
                last_updated: coin.last_updated,
            });
        }

        const response = {
            status: 200,
            message: "success",
            coins_ammount: allCoins.length,
            data: allCoins,
        };

        res.send(response);
    } catch (e) {
        res.status(500).json(e);
    }
}
