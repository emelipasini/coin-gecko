import { Request, Response } from "express";
import { User } from "../../../domain/user";
import usersDB from "../../../database/users";

export async function register(req: Request, res: Response) {
    try {
        const { status, message } = await validateUser(
            req.query as any as User
        );

        return res.status(status).json({ message });
    } catch (error) {
        console.error(error);
    }
}

export async function validateUser(userInfo: User) {
    try {
        await usersDB.addUser(userInfo);
        return {
            status: 201,
            message: "User created",
        };
    } catch (error) {
        console.error(error);
    }
}

export function passwordIsValid(password: string): boolean {
    if (password.length < 8) {
        return false;
    }
    return true;
}
