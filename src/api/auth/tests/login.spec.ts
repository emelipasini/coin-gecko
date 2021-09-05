import { MongoClient, Collection } from "mongodb";
import { User } from "../../../domain/user";
import { createUser } from "../../../shared/tests/users-utils";
import { validateAndLoginUser } from "../functions/login";
import config from "config";
import usersDB from "../../../database/users";
import { validateAndSaveUser } from "../functions/register";

let usersCollection: Collection;
let client: MongoClient;
let user: User;

describe("Logging in account", () => {
    beforeAll(async () => {
        client = await MongoClient.connect(config.get("dbURI"));
        usersDB.injectDB(client);

        usersCollection = client.db(config.get("dbName")).collection("users");

        user = createUser();
        await validateAndSaveUser(user);
    });

    afterAll(async () => {
        await usersCollection.drop();
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
