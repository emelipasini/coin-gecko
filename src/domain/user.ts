import jwt from "jsonwebtoken";
import config from "config";

import { Currency } from "./currency.enum";

export class User {
    firstname: string;
    lastname: string;
    username: string;
    password: string;
    currency: Currency;

    constructor(
        firstname: string,
        lastname: string,
        username: string,
        password: string,
        currency: Currency
    ) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.username = username;
        this.password = password;
        this.currency = currency;
    }

    generateToken() {
        return jwt.sign(
            {
                exp: Math.floor(Date.now() / 1000) + 60 * 60 * 4,
                ...this.getJSONData(),
            },
            config.get("secret")
        );
    }

    static validateToken(userJwt: string) {
        return jwt.verify(userJwt, config.get("secret"), (error, res) => {
            if (error) {
                return { error };
            }
            return new User(
                res.firstname,
                res.lastname,
                res.username,
                null,
                res.currency
            );
        });
    }

    getJSONData() {
        return {
            firstname: this.firstname,
            lastname: this.lastname,
            username: this.username,
            currency: this.currency,
        };
    }
}
