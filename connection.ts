import { MongoClient } from "mongodb";

export class MongoConnection {
    static async CreateConnection(mongoURL: string): Promise<MongoConnection> {
        const client = new MongoClient(mongoURL);
        await client.connect();
        return new MongoConnection(client);
    }

    constructor(public client: MongoClient) {}

    async close(): Promise<void> {
        await this.client.close();
    }
}
