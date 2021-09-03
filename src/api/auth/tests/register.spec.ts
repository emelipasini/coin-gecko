import { MongoClient, Collection } from "mongodb";
import { User } from "../../../domain/user";
import { createUser } from "../../../shared/tests/users-utils";
import { validateUser } from "../functions/register";
import config from "config";
import usersDB from "../../../database/users";

let usersCollection: Collection;
let client: MongoClient;
let oldUser: User;

describe("Account registration", () => {
    beforeAll(async () => {
        client = await MongoClient.connect(config.get("dbURI"));
        usersDB.injectDB(client);

        usersCollection = await client
            .db(config.get("dbName"))
            .collection("users");

        oldUser = createUser();
        await usersDB.addUser(oldUser);
    });

    afterAll(async () => {
        await usersCollection.drop();
        await client.close();
    });

    it.only("should work when the data is correct", async () => {
        const user: User = createUser();

        const res = await validateUser(user);

        expect(res.status).toBe(201);
        expect(res.message).toBe("User created");
    });

    it("should fail when the password is too short", async () => {
        const user: User = createUser();
        user.password = "1234";

        const res = await validateUser(user);

        expect(res.status).toBe(400);
        expect(res.message).toBe("Bad Request: Password is not valid");
    });

    it("should fail when the password is too short", async () => {
        const user: User = createUser();
        user.username = oldUser.username;

        const res = await validateUser(user);

        expect(res.status).toBe(400);
        expect(res.message).toBe("Bad Request: Username already exists");
    });
});
