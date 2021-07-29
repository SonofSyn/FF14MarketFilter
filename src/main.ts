import { collectItemNameData } from "./requests/collector";
import { MarketableItemIDs } from "./resources/marketableItemIDs";
import { selectItemMetrics, selectListingData, selectPriceFilteredData } from "./processing/selector";
import { asyncReadFile, asyncWriteFile } from "./shared/tools";
import { ResponseData } from "./shared/interface";

(async () => {
    // Request data with https
    //_____________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    console.time("Start");
    let marketItemData = await collectItemNameData("Shiva", MarketableItemIDs, 3000, 1);
    await asyncWriteFile("./export/response.json", JSON.stringify(marketItemData));
    console.timeEnd("Start");

    // Use data from last request
    //_____________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    // let marketItemData: ResponseData[][] = JSON.parse((await asyncReadFile("./data/response.json")).toString());

    // Selects certain infos of the entire dataset and saves them in smaller json files
    //_____________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    console.time("End");
    let priceFilteredData = await selectPriceFilteredData(marketItemData, 8000);
    await asyncWriteFile("./export/compiledData/filtered.json", JSON.stringify(priceFilteredData));
    let metricData = await selectItemMetrics(marketItemData);
    await asyncWriteFile("./export/compiledData/metrics.json", JSON.stringify(metricData));
    let listingData = await selectListingData(marketItemData);
    await asyncWriteFile("./export/compiledData/listings.json", JSON.stringify(listingData));
    console.time("End");
})();
