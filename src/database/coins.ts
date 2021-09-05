import { Collection, MongoClient } from "mongodb";
import config from "config";
import { favoriteCoin } from "../domain/favoriteCoins";

let coins: Collection;

export default class coinsDB {
    static async injectDB(conn: MongoClient) {
        if (coins) {
            return;
        }
        try {
            coins = conn.db(config.get("dbName")).collection("favoriteCoins");
        } catch (e) {
            console.error(
                `Unable to establish collection handles in users database: ${e}`
            );
        }
    }

    static async getFavorites(username: string) {
        try {
            return await coins.findOne({ username });
        } catch (e) {
            console.error(`Error occurred while logging in user, ${e}`);
            return { error: e };
        }
    }

    static async addFavorite(username: string, coin: string) {
        try {
            const user = await coins.findOne({ username });
            if (!user) {
                const faveCoins = new favoriteCoin(username, [coin]);
                await coins.insertOne(faveCoins);
            } else {
                await coins.updateOne(
                    { username: username },
                    { $addToSet: { favoriteCoins: coin } }
                );
            }

            return { success: true };
        } catch (e) {
            console.error(`Error occurred while logging in user, ${e}`);
            return { error: e };
        }
    }
}
