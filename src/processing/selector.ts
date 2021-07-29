import { ItemMetrics, ListingData, ResponseData } from "../shared/interface";
import { forEachAsync } from "../shared/tools";
/**
 * Select only important Item Data from the entire Dataset
 *
 * @param {ResponseData[][]} data
 * @return {*}  {Promise<ItemMetrics[]>}
 */
export let selectItemMetrics = async (data: ResponseData[][], priceMinimum: number): Promise<ItemMetrics[]> => {
    let metricData: ItemMetrics[] = [];
    await forEachAsync(data, async (set) => {
        await forEachAsync(set, async (item) => {
            if (item.minPriceHQ !== undefined) {
                if (item.minPriceHQ <= priceMinimum) return;
            }
            metricData.push({
                id: item.id,
                date: item.date,
                name: item.name,
                minPriceNQ: item.minPriceNQ,
                maxPriceNQ: item.maxPriceNQ,
                minPriceHQ: item.minPriceHQ,
                maxPriceHQ: item.maxPriceHQ,
                amountNQListings: item.amountNQListings,
                amountHQListing: item.amountHQListing,
            });
        });
    });
    return metricData;
};

/**
 * Select only important Listing Data from the entire Dataset
 *
 * @param {ResponseData[][]} data
 * @return {*}  {Promise<ListingData[]>}
 */
export let selectListingData = async (data: ResponseData[][]): Promise<ListingData[]> => {
    let listingData: ListingData[] = [];
    await forEachAsync(data, async (set) => {
        await forEachAsync(set, async (item) => {
            listingData.push({
                id: item.id,
                date: item.date,
                name: item.name,
                orders: item.orders,
            });
        });
    });
    return listingData;
};

/**
 * Select only Items which are worth enough to sell
 *
 * @param {ResponseData[][]} data
 * @param {number} priceMinimum
 * @return {*}  {Promise<ResponseData[]>}
 */
export let selectPriceFilteredData = async (data: ResponseData[][], priceMinimum: number): Promise<ResponseData[]> => {
    let responseData: ResponseData[] = [];
    await forEachAsync(data, async (set) => {
        await forEachAsync(set, async (item) => {
            if (item.minPriceHQ !== undefined) {
                if (item.minPriceHQ <= priceMinimum) return;
            }
            responseData.push({
                id: item.id,
                date: item.date,
                name: item.name,
                minPriceNQ: item.minPriceNQ,
                maxPriceNQ: item.maxPriceNQ,
                minPriceHQ: item.minPriceHQ,
                maxPriceHQ: item.maxPriceHQ,
                amountNQListings: item.amountNQListings,
                amountHQListing: item.amountHQListing,
                orders: item.orders,
            });
        });
    });
    return responseData;
};
