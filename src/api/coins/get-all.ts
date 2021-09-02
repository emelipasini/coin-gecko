import CoinGecko from "coingecko-api";

const CoinGeckoClient = new CoinGecko();

async function getPing() {
    let ping = await CoinGeckoClient.ping();
    console.log(ping);
}
