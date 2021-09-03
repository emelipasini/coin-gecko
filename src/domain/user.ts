import { Currency } from "./currency.enum";
import jwt from "jsonwebtoken";
import config from "config";

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

    getJSONData() {
        return {
            firstname: this.firstname,
            lastname: this.lastname,
            username: this.username,
            currency: this.currency,
        };
    }
}
