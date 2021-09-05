import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import usersDB from "../../../database/users";
import { User } from "../../../domain/user";

export async function login(req: Request, res: Response) {
    try {
        const { username, password } = req.query as any as User;

        let userData = await usersDB.findUsername(username);
        if (!userData) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const passwordIsValid = await bcrypt.compare(
            password,
            userData.password
        );

        if (!passwordIsValid) {
            return res.status(401).json({ message: "Invalid credentials" });
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
            res.status(500).json({ error: loginResponse.error });
            return;
        }

        res.json({ auth_token: jwt, info: userData.getJSONData() });
    } catch (e) {
        res.status(500).json(e);
    }
}
