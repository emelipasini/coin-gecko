import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import { User } from "../../../domain/user";
import usersDB from "../../../database/users";

export async function register(req: Request, res: Response) {
    try {
        const userFromBody = req.query as any as User;

        const { status, message } = await validateAndSaveUser(userFromBody);

        return res.status(status).json({ message });
    } catch (e) {
        res.status(500).json(e);
    }
}

export async function validateAndSaveUser(userFromBody: User) {
    try {
        const userInfo = new User(
            userFromBody.firstname,
            userFromBody.lastname,
            userFromBody.username,
            userFromBody.password,
            userFromBody.currency
        );

        if (!passwordIsValid(userInfo.password)) {
            return {
                status: 400,
                message: "Bad Request: Invalid password",
            };
        }

        if (await usernameExists(userInfo.username)) {
            return {
                status: 400,
                message: "Bad Request: Username already exists",
            };
        }

        userInfo.password = await bcrypt.hash(userInfo.password, 10);

        await usersDB.addUser(userInfo);

        return {
            status: 201,
            message: "User created",
        };
    } catch (error) {
        return error;
    }
}

function passwordIsValid(password: string): boolean {
    const letter = /[a-zA-Z]/;
    const number = /[0-9]/;
    if (!(number.test(password) && letter.test(password))) {
        return false;
    }

    if (password.length < 8) {
        return false;
    }
    return true;
}

async function usernameExists(username: string) {
    return await usersDB.findUsername(username);
}
