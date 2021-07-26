import axios from "axios";
import fs from "fs";
import { ItemNames } from "./itemNames";
import { MarketableItems } from "./marketableItem";
import { forEachAsync } from "./tools";

interface Listing {
    lastReviewTime: number;
    pricePerUnit: number;
    totalPrice: number;
    quantity: number;
    hq: boolean;
    retainerName: string;
}

interface ResponseData {
    id: string;
    datum: number;
    name: string;
    minPriceNQ: number;
    maxPriceNQ: number;
    minPriceHQ: number;
    maxPriceHQ: number;
    amountNQListings: number;
    amountHQListing: number;
    // Listings: Listing[]
}

let requestItem = async (itemIDs: number[], minPriceLimit: number) => {
    const response = await axios({
        method: "get",
        url: "https://universalis.app/api/Shiva/" + itemIDs.join(","),
        responseType: "json",
    });
    if (minPriceLimit !== 0) {
        if (response.data.minPriceHQ <= minPriceLimit) return undefined;
    }
    return await forEachAsync(response.data.items, async (item: any) => {
        let responseItem: ResponseData = {
            id: item.itemID,
            datum: item.lastUploadTime,
            name: ItemNames[item.itemID.toString()],
            minPriceNQ: item.minPriceNQ,
            maxPriceNQ: item.maxPriceNQ,
            minPriceHQ: item.minPriceHQ,
            maxPriceHQ: item.maxPriceHQ,
            amountNQListings: item.stackSizeHistogramNQ["1"],
            amountHQListing: item.stackSizeHistogramHQ["1"],
            // Listings: listing
        };
        return responseItem;
    });
};

let requestMarketableItems = async (minPriceLimit: number = 0) => {
    let items = [
        2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 1601, 1602, 1603, 1604, 1605, 1606, 1607, 1609,
        1611, 1613, 1614,
    ];
    let response = await requestItem(items, minPriceLimit);
    fs.writeFile("./data/response.json", JSON.stringify(response), () => {});
};

requestMarketableItems(1500);
