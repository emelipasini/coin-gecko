import { Currency } from "./currency.enum";

export class User {
    _id: string;

    firstname: string;

    lastname: string;

    username: string;

    password: string;

    currency: Currency;
}
