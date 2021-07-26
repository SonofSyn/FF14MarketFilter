import axios from "axios"
import fs from "fs"
import { promisify } from "util";
import { ItemNames } from "./itemNames";
import { MarketableItems } from "./marketableItem";
import { forEachAsync } from "./tools";


interface Listing {
    lastReviewTime: number,
    pricePerUnit: number,
    totalPrice: number
    quantity: number,
    hq: boolean,
    retainerName: string
}

interface ResponseData {
    id: string,
    datum: number,
    name: string,
    minPriceNQ: number,
    maxPriceNQ: number,
    minPriceHQ: number,
    maxPriceHQ: number,
    amountNQListings: number,
    amountHQListing: number,
    // Listings: Listing[]

}

let requestItem = async (itemID: number, minPriceLimit: number) => {
    const response = await axios({
        method: 'get',
        url: 'https://universalis.app/api/Shiva/' + itemID,
        responseType: 'json'
    });
    if (minPriceLimit !== 0) {
        if (response.data.minPriceHQ <= minPriceLimit)
            return undefined;
    }
    // let listing: Listing[] = response.data.listings.map((listing_1: { lastReviewTime: number; pricePerUnit: number; total: number; quantity: number; hq: boolean; retainerName: string; }) => {
    //     return {
    //         lastReviewTime: listing_1.lastReviewTime,
    //         pricePerUnit: listing_1.pricePerUnit,
    //         totalPrice: listing_1.total,
    //         quantity: listing_1.quantity,
    //         hq: listing_1.hq,
    //         retainerName: listing_1.retainerName
    //     };
    // });
    let responseItem: ResponseData = {
        id: response.data.itemID,
        datum: response.data.lastUploadTime,
        name: ItemNames[response.data.itemID.toString()],
        minPriceNQ: response.data.minPriceNQ,
        maxPriceNQ: response.data.maxPriceNQ,
        minPriceHQ: response.data.minPriceHQ,
        maxPriceHQ: response.data.maxPriceHQ,
        amountNQListings: response.data.stackSizeHistogramNQ["1"],
        amountHQListing: response.data.stackSizeHistogramHQ["1"],
        // Listings: listing
    };
    // fs.writeFile('./data/response.json', JSON.stringify(responseItem), () => { })
    return responseItem;
}


let requestMarketableItems = async (minPriceLimit: number = 0) => {
    let data: ResponseData[] = []
    let items = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 1601, 1602, 1603, 1604, 1605, 1606, 1607, 1609, 1611, 1613, 1614]
    await forEachAsync(items, async (item) => {
        let response = await requestItem(item, minPriceLimit)
        if (response !== undefined) data.push(response)
    })
    console.log(data)
    fs.writeFile('./data/response.json', JSON.stringify(data), () => { })
}

requestMarketableItems(1500)