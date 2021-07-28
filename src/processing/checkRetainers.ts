import { ListingData, Order } from "../shared/interface";
import { forEachAsync } from "../shared/tools";

export let checkListingForRetainers = async (
    retainers: string[],
    listingData: ListingData[]
): Promise<ListingData[]> => {
    let listings: ListingData[] = [];
    await forEachAsync(listingData, async (listing) => {
        await forEachAsync(listing.orders, async (order) => {
            if (retainers.indexOf(order.retainerName) !== -1) {
                listings.push(listing);
            }
        });
    });
    return listings;
};

export let checkForRetainerOrder = async (listing: ListingData, retainers: string[]): Promise<Order | undefined> => {
    let order: (Order | undefined)[] = await forEachAsync(listing.orders, async (order) => {
        let ix = retainers.indexOf(order.retainerName);
        if (ix !== -1) {
            return (order = Object.assign({}, order));
        }
    });
    if (order.length === 0) throw Error("No Retainer found.");
    return order[0];
};

export let checkRetainerUndercut = async (listing: ListingData, retainerorder: Order) => {
    let foundUndercuts: Order[] = [];
    await forEachAsync(listing.orders, async (order) => {
        if (order.hq === retainerorder.hq) {
            if (order.totalPrice < retainerorder.totalPrice) foundUndercuts.push(order);
        }
    });
    return foundUndercuts;
};

export let checkRetainers = async () => {};
