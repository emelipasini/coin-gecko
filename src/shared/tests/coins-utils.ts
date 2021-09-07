import { favoriteCoin } from "../../domain/favoriteCoins";

export function createFavoriteCoins(username: string, quantity: number) {
    const faveCoins = addCoins(quantity);

    const userCoins: favoriteCoin = new favoriteCoin(username, faveCoins);

    return userCoins;
}

function addCoins(quantity: number) {
    const coins = [
        "bitcoin",
        "ethereum",
        "dogecoin",
        "usd-coin",
        "litecoin",
        "binance-usd",
        "internet-computer",
        "stellar",
        "tron",
        "cosmos",
        "the-graph",
        "tezos",
        "neo",
        "algorand",
        "shiba-inu",
        "kusama",
        "bitcoin-cash-sv",
        "cardano",
        "tether",
        "ripple",
        "polkadot",
        "uniswap",
        "chainlink",
        "matic-network",
        "avalanche-2",
        "vechain",
    ];

    return coins.slice(0, quantity);
}
