import { MongoClient, Collection } from "mongodb";
import config from "config";

import { User } from "../../../domain/user";
import { createUser } from "../../../shared/tests/users-utils";
import usersDB from "../../../database/users";

import { validateAndSaveUser } from "../functions/register";

let usersCollection: Collection;
let client: MongoClient;
let oldUser: User;

describe("Account registration", () => {
    beforeAll(async () => {
        client = await MongoClient.connect(config.get("dbURI"));
        usersDB.injectDB(client);

        usersCollection = client.db(config.get("dbName")).collection("users");

        oldUser = createUser();
        await usersDB.addUser(oldUser);
    });

    afterAll(async () => {
        await usersCollection.drop();
        await client.close();
    });

    it("should save the new user", async () => {
        const user: User = createUser();

        const res = await validateAndSaveUser(user);
        const newUser = await usersDB.findUsername(user.username);

        expect(res.status).toBe(201);
        expect(res.message).toBe("User created");
        expect(newUser.username).toBe(user.username);
    });

    it("should fail when the password is too short", async () => {
        const user: User = createUser();
        user.password = user.password.slice(3);

        const res = await validateAndSaveUser(user);

        expect(res.status).toBe(400);
        expect(res.message).toBe("Bad Request: Invalid password");
    });

    it("should fail when the password is not alphanumeric", async () => {
        const user: User = createUser();
        user.password = "password";

        const res = await validateAndSaveUser(user);

        expect(res.status).toBe(400);
        expect(res.message).toBe("Bad Request: Invalid password");
    });

    it("should fail when the username already exists", async () => {
        const user: User = createUser();
        user.username = oldUser.username;

        const res = await validateAndSaveUser(user);

        expect(res.status).toBe(400);
        expect(res.message).toBe("Bad Request: Username already exists");
    });
});
