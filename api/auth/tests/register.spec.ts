import { Collection } from "mongodb";
import { MongoConnection } from "../../../connection";
import { User } from "../../../domain/user";
import { createUser } from "../../../shared/tests/users-utils";
import { registerAccount } from "../functions/register";

let dbConnection: MongoConnection;
let usersCollection: Collection;

describe("Account registration", () => {
    // El username debe ser unico
    // La password debe tener 8 caracteres y ser alfanumerica
    // Los campos son obligatorios

    beforeAll(async () => {
        dbConnection = await MongoConnection.CreateConnection(
            process.env.DB_URI
        );
        usersCollection = dbConnection.client
            .db(process.env.DB_NAME)
            .collection("users");
    });

    afterAll(async () => {
        await usersCollection.drop();
        await dbConnection.close();
    });

    it("should work when the data is correct", async () => {
        const user: User = createUser();

        await registerAccount(user);
    });
});
