import { MongoConnection } from "../../../connection";
import { Request, Response } from "express";
import { User } from "../../../domain/user";

export function register(req: Request, res: Response) {
    try {
        registerAccount(req.query as any as User);

        res.send(req.query);
    } catch (error) {
        console.error(error);
    }
}

export async function registerAccount(user: User) {
    try {
        let dbCon: MongoConnection;
        console.log(process.env.TEST);
        console.log(process.env.DB_URI);
        dbCon = await MongoConnection.CreateConnection(process.env.DB_URI);

        const users = dbCon.client.db(process.env.DB_NAME).collection("users");
        console.log(process.env.DB_NAME);

        await users.insertOne(user);
        console.log(user);

        await dbCon.close();
    } catch (error) {
        console.error(error);
    }
}
