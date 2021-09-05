import { MongoClient, Collection } from "mongodb";
import { User } from "../../../domain/user";
import { createUser } from "../../../shared/tests/users-utils";
import config from "config";
import usersDB from "../../../database/users";
import coinsDB from "../../../database/coins";
import { saveFavorite } from "../functions/add-favorite";

let usersCollection: Collection;
let coinsCollection: Collection;
let client: MongoClient;
let user: User;

describe("Logging in account", () => {
    beforeAll(async () => {
        client = await MongoClient.connect(config.get("dbURI"));
        usersDB.injectDB(client);
        coinsDB.injectDB(client);

        usersCollection = client.db(config.get("dbName")).collection("users");
        coinsCollection = client
            .db(config.get("dbName"))
            .collection("favoriteCoins");

        user = createUser();
        await usersDB.addUser(user);
    });

    afterAll(async () => {
        await usersCollection.drop();
        await coinsCollection.drop();
        await client.close();
    });

    it("should add the new coin only once", async () => {
        const res = await saveFavorite(user.username, "bitcoin");
        await saveFavorite(user.username, "bitcoin");

        const faveCoins = await coinsDB.getFavorites(user.username);

        expect(res.status).toBe(200);
        expect(res.message).toBe("Coin added successfully");
        expect(faveCoins.favoriteCoins.length).toBe(1);
        expect(faveCoins.favoriteCoins[0]).toBe("bitcoin");
    });
});
