import { Request, Response } from "express";
import { User } from "../../../domain/user";
import usersDB from "../../../database/users";

export function register(req: Request, res: Response) {
    registerAccount(req.query as any as User);

    return res.status(201).json({ message: "User created" });
}

export async function registerAccount(userInfo: User) {
    try {
        const insertResult = await usersDB.addUser(userInfo);
    } catch (error) {
        console.error(error);
    }
}

export function passwordIsValid(password: string) {}
