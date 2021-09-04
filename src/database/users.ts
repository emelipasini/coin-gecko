import { Collection, MongoClient } from "mongodb";
import { User } from "../domain/user";
import config from "config";
import { favoriteCoin } from "../domain/favoriteCoins";

let users: Collection;
let sessions: Collection;
let coins: Collection;

export default class usersDB {
    static async injectDB(conn: MongoClient) {
        if (users && sessions && coins) {
            return;
        }
        try {
            users = conn.db(config.get("dbName")).collection("users");
            sessions = conn.db(config.get("dbName")).collection("sessions");
            coins = conn.db(config.get("dbName")).collection("favoriteCoins");
        } catch (e) {
            console.error(
                `Unable to establish collection handles in users database: ${e}`
            );
        }
    }

    static async addUser(userInfo: User) {
        await users.insertOne(userInfo);
    }

    static async findUsername(username: string) {
        return await users.findOne({ username: username });
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

    static async loginUser(username: string, jwt: string) {
        try {
            await sessions.updateOne(
                { username: username },
                { $set: { jwt } },
                { upsert: true }
            );
            return { success: true };
        } catch (e) {
            console.error(`Error occurred while logging in user, ${e}`);
            return { error: e };
        }
    }

    static async getUserSession(username: string) {
        try {
            return sessions.findOne({ username: username });
        } catch (e) {
            console.error(`Error occurred while retrieving user session, ${e}`);
            return null;
        }
    }

    static async logoutUser(username: string) {
        try {
            await sessions.deleteOne({ username: username });
            return { success: true };
        } catch (e) {
            console.error(`Error occurred while logging out user, ${e}`);
            return { error: e };
        }
    }
}
