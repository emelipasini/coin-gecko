import { randomUUID } from "crypto";
import { name, random, datatype } from "faker";
export { helpers } from "faker";
import { User } from "../../domain/user";

export function createUser() {
    const firstname = name.firstName();
    const lastname = name.lastName();
    const username = new Date().toISOString(); // Necesito que sea unico
    const password = createPassword();
    const currency = randomNumber(2);

    const user = new User(firstname, lastname, username, password, currency);

    return user;
}

export function createPassword(): string {
    return random.alphaNumeric(8);
}

export function randomNumber(max?: number): number {
    return datatype.number(max);
}
