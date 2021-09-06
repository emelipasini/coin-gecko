import { MongoClient, Collection } from "mongodb";
import config from "config";

import { User } from "../../../domain/user";
import { createUser } from "../../../shared/tests/users-utils";
import usersDB from "../../../database/users";

import { validateAndLoginUser } from "../functions/login";
import { validateAndSaveUser } from "../functions/register";

let usersCollection: Collection;
let sessionsCollection: Collection;
let client: MongoClient;
let user: User;

describe("Logging in account", () => {
    beforeAll(async () => {
        client = await MongoClient.connect(config.get("dbURI"));
        usersDB.injectDB(client);

        usersCollection = client.db(config.get("dbName")).collection("users");
        sessionsCollection = client
            .db(config.get("dbName"))
            .collection("sessions");

        user = createUser();
        await validateAndSaveUser(user);
    });

    afterAll(async () => {
        await usersCollection.drop();
        await sessionsCollection.drop();
        await client.close();
    });

    it("should login user correctly", async () => {
        const res = await validateAndLoginUser(user.username, user.password);

        expect(res.jwt).toBeDefined();
        expect(res.info).toBeDefined();
    });

    it("should not login user", async () => {
        const res = await validateAndLoginUser(
            user.username,
            "InvalidPassword"
        );

        expect(res.status).toBe(401);
        expect(res.message).toBe("Invalid credentials");
    });
});
