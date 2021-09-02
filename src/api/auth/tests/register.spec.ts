import { MongoClient, Collection } from "mongodb";
import { User } from "../../../domain/user";
import { createUser } from "../../../shared/tests/users-utils";
import { registerAccount } from "../functions/register";
import config from "config";
import usersDB from "../../../database/users";

let usersCollection: Collection;
let client: MongoClient;

describe("Account registration", () => {
    // El username debe ser unico
    // La password debe tener 8 caracteres y ser alfanumerica
    // Los campos son obligatorios

    beforeAll(async () => {
        client = await MongoClient.connect(config.get("dbURI"));
        usersCollection = await client
            .db(config.get("dbName"))
            .collection("users");
        usersDB.injectDB(client);
    });

    afterAll(async () => {
        await usersCollection.drop();
        await client.close();
    });

    it("should work when the data is correct", async () => {
        const user: User = createUser();

        expect(async () => {
            await registerAccount(user);
        }).not.toThrow();
    });
});
