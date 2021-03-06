import { collectItemData, collectItemExtras, collectItemImages, collectItemNamesDE } from "./requests/collector";
import { MarketableItemIDs } from "./resources/marketableItemIDs";
import { selectItemMetrics, selectListingData } from "./processing/selector";
import { asyncReadFile, asyncWriteFile } from "./shared/tools";
import { ItemExtrasDictionary, ItemMetrics, ListingData, ResponseData } from "./shared/interface";
import { requestItemImageXIVapi, requestItemNameXIVapi } from "./requests/client";
import { MarketableItemIDsReduced } from "./resources/marketableItemsReduced";
import { checkRetainers } from "./processing/checkRetainers";
import { retainersK, retainersN } from "./resources/retainerNames";

(async () => {
    // Request data with https
    //_____________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    // // console.time("Start");
    // let marketItemData = await collectItemData("Shiva", MarketableItemIDsReduced, 2000, 1);
    // await asyncWriteFile("./export/response.json", JSON.stringify(marketItemData));
    // console.timeEnd("Start");
    // Use data from last request
    // _____________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    // let marketItemData: ResponseData[][] = JSON.parse((await asyncReadFile("./export/response.json")).toString());
    // Selects certain infos of the entire dataset and saves them in smaller json files
    // _____________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    // console.time("End");
    // await asyncWriteFile("./export/compiledData/filtered.json", JSON.stringify(priceFilteredData));
    // let metricData = await selectItemMetrics(marketItemData, 80000);
    // await asyncWriteFile("./export/compiledData/metrics.json", JSON.stringify(metricData));
    // let listingData = await selectListingData(marketItemData);
    // await asyncWriteFile("./export/compiledData/listings.json", JSON.stringify(listingData));
    // console.time("End");
    // Grab all german names of marketableItems
    // _____________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    // let itemNameData = await collectItemNamesDE(MarketableItemIDs, 2000, 5);
    // await asyncWriteFile("./export/compiledData/itemNamesDE.json", JSON.stringify(itemNameData));
    // Grab all itemExtras
    // _____________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    // let itemExtraData = await collectItemExtras(MarketableItemIDsReduced, 2000, 5);
    // await asyncWriteFile("./export/compiledData/itemExtras.json", JSON.stringify(itemExtraData));
    // Grab all itemImages
    // _____________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    let itemExtraData = await asyncReadFile("./export/compiledData/itemExtras.json");
    let extraItems: ItemExtrasDictionary = JSON.parse(itemExtraData.toString())
    await collectItemImages(extraItems, 2000, 3)
    // await asyncWriteFile("./export/compiledData/itemExtras.json", JSON.stringify(itemExtraData));
    // Load Data
    // _____________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    // let listingItemData: ListingData[] = JSON.parse(
    //     (await asyncReadFile("./export/compiledData/listings.json")).toString()
    // );
    // let metricItemData: ItemMetrics[] = JSON.parse(
    //     (await asyncReadFile("./export/compiledData/metric.json")).toString()
    // );
    // CheckRetainers
    // _____________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    // let retainerData = await checkRetainers(retainersK, listingItemData);
    // await asyncWriteFile("./export/processed/retainers.json", JSON.stringify(retainerData));
    // console.log(retainerData);
    // console.log(retainerData.length);
    // let pictureBuffer = await requestItemImageXIVapi("/i/050000/050104_hr1.png");
    // await asyncWriteFile("./export/test.png", pictureBuffer);
})();
