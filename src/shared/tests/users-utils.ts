import { name, random, datatype } from "faker";
export { helpers } from "faker";
import { User } from "../../domain/user";

export function createUser() {
    const user = new User();

    user.firstname = name.firstName();
    user.lastname = name.lastName();
    user.username = createUsername();
    user.password = createPassword();
    user.currency = randomNumber(2);

    return user;
}

export function createUsername(): string {
    return random.alphaNumeric(10);
}

export function createPassword(): string {
    return random.alphaNumeric(8);
}

export function randomNumber(max?: number): number {
    return datatype.number(max);
}
