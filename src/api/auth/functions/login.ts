import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import usersDB from "../../../database/users";
import { User } from "../../../domain/user";

export async function login(req: Request, res: Response) {
    try {
        const { username, password } = req.query as any as User;

        const { status, message, jwt, info } = await validateAndLoginUser(
            username,
            password
        );

        if (jwt) {
            res.send({ jwt, info });
        } else {
            res.status(status).send({ message });
        }
    } catch (e) {
        res.status(500).json(e);
    }
}

export async function validateAndLoginUser(username: string, password: string) {
    try {
        let userData = await usersDB.findUsername(username);
        if (!userData) {
            return {
                status: 401,
                message: "Invalid credentials",
            };
        }

        const passwordIsValid = await bcrypt.compare(
            password,
            userData.password
        );
        if (!passwordIsValid) {
            return {
                status: 401,
                message: "Invalid credentials",
            };
        }

        userData = new User(
            userData.firstname,
            userData.lastname,
            userData.username,
            userData.password,
            userData.currency
        );

        const jwt = userData.generateToken();
        const loginResponse = await usersDB.loginUser(userData.username, jwt);

        if (!loginResponse.success) {
            return {
                status: 500,
                message: loginResponse.error,
            };
        }
        const info = userData.getJSONData();
        return { jwt, info };
    } catch (error) {
        return error;
    }
}
