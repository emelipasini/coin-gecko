import CoinGecko from "coingecko-api";
import { Request, Response } from "express";
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

        const CoinGeckoClient = new CoinGecko();

        const faveCoins = await coinsDB.getFavorites(userObj.username);
        const allCoins = await CoinGeckoClient.coins.all();

        const result: Record<string, any>[] = [];

        const userCurrency = Currency[userObj.currency];

        for (const coin of allCoins.data) {
            if (faveCoins.favoriteCoins.includes(coin.id)) {
                result.push({
                    id: coin.id,
                    name: coin.name,
                    currency: userCurrency,
                    price_ars: coin.market_data.current_price.ars,
                    price_usd: coin.market_data.current_price.usd,
                    price_eur: coin.market_data.current_price.eur,
                    symbol: coin.symbol,
                    image: coin.image.small,
                    last_updated: coin.last_updated,
                });
            }
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
