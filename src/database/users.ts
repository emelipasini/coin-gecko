import { Collection, MongoClient } from "mongodb";
import { User } from "../domain/user";
import config from "config";

let users: Collection;

export default class usersDB {
    static async injectDB(conn: MongoClient) {
        if (users) {
            return;
        }
        try {
            users = await conn.db(config.get("dbName")).collection("users");
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
        return await users.findOne({ username });
    }
}
