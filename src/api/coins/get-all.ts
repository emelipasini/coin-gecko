import CoinGecko from "coingecko-api";
import { Request, Response } from "express";

export async function getCoins(req: Request, res: Response) {
    const CoinGeckoClient = new CoinGecko();

    let coinsData = await CoinGeckoClient.coins.all();
    const allCoins: Record<string, any>[] = [];

    for (const coin of coinsData.data) {
        allCoins.push({
            name: coin.name,
            price: coin.market_data.current_price.ars,
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
}
