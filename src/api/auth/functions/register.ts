import { Request, Response } from "express";
import { User } from "../../../domain/user";
import usersDB from "../../../database/users";
import bcrypt from "bcryptjs";

export async function register(req: Request, res: Response) {
    try {
        const userFromBody = req.query as any as User;

        const userInfo = new User(
            userFromBody.firstname,
            userFromBody.lastname,
            userFromBody.username,
            userFromBody.password,
            userFromBody.currency
        );

        userInfo.password = await bcrypt.hash(userFromBody.password, 10);

        const { status, message } = await validateUser(userInfo);

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
