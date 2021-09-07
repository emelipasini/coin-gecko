import { MongoClient, Collection } from "mongodb";
import config from "config";

import { User } from "../../../domain/user";
import { favoriteCoin } from "../../../domain/favoriteCoins";
import { createUser } from "../../../shared/tests/users-utils";
import usersDB from "../../../database/users";
import coinsDB from "../../../database/coins";

import { createFavoriteCoins } from "../../../shared/tests/coins-utils";
import { getAndSortCoins } from "../functions/get-top";

let usersCollection: Collection;
let coinsCollection: Collection;
let client: MongoClient;

let user: User;
let userCoins: favoriteCoin;

describe("Get top coins", () => {
    beforeAll(async () => {
        client = await MongoClient.connect(config.get("dbURI"));
        await usersDB.injectDB(client);
        await coinsDB.injectDB(client);

        usersCollection = client.db(config.get("dbName")).collection("users");
        coinsCollection = client
            .db(config.get("dbName"))
            .collection("favoriteCoins");

        user = createUser();
        await usersDB.addUser(user);

        userCoins = createFavoriteCoins(user.username, 26);
        await coinsDB.saveFavorites(
            userCoins.username,
            userCoins.favoriteCoins
        );
    }, 20000);

    afterAll(async () => {
        await usersCollection.drop();
        await coinsCollection.drop();
        await client.close();
    });

    it("should get the user coins sorted", async () => {
        const res = await getAndSortCoins(user, 5);

        expect(res.length).toBe(5);
        expect(res[0].price).toBeGreaterThan(res[1].price);
        expect(res[3].price).toBeGreaterThan(res[4].price);
    });

    it("should get the user coins sorted", async () => {
        const res = await getAndSortCoins(user, 26);

        expect(res.length).toBe(25);
        expect(res[0].price).toBeGreaterThan(res[1].price);
        expect(res[3].price).toBeGreaterThan(res[4].price);
    });
});
