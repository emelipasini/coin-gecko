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
            users = conn.db(config.get("dbName")).collection("users");
            sessions = conn.db(config.get("dbName")).collection("sessions");
        } catch (e) {
            console.error(
                `Unable to establish collection handles in users database: ${e}`
            );
        }
    }

    static async addUser(userInfo: User) {
        try {
            await users.insertOne(userInfo);
        } catch (e) {
            console.error(`Error occurred while adding user, ${e}`);
            return { error: e };
        }
    }

    static async findUsername(username: string) {
        try {
            const user = await users.findOne({ username: username });
            if (!user) {
                return undefined;
            }
            return user;
        } catch (e) {
            console.error(`Error occurred while searching user, ${e}`);
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
