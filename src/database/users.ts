import { Collection, MongoClient } from "mongodb";
import { User } from "../domain/user";
import config from "config";

let users: Collection;
let sessions: Collection;

export default class usersDB {
    static async injectDB(conn: MongoClient) {
        if (users && sessions) {
            return;
        }
        try {
            users = await conn.db(config.get("dbName")).collection("users");
            sessions = await conn
                .db(config.get("dbName"))
                .collection("sessions");
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
