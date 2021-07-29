import { ListingData, Order } from "../shared/interface";
import { forEachAsync } from "../shared/tools";
/**
 * Checks all given Listing for the given retainer names if included returns all arrays containing retainers and the order of the retainer
 *
 * @param {string[]} retainers
 * @param {ListingData[]} listingData
 * @return {*}  {Promise<ListingData[]>}
 */
export let checkListingForRetainers = async (
    retainers: string[],
    listingData: ListingData[]
): Promise<{ listing: ListingData; retainerOrder: Order }[]> => {
    let listings: { listing: ListingData; retainerOrder: Order }[] = [];
    await forEachAsync(listingData, async (listing) => {
        await forEachAsync(listing.orders, async (order) => {
            if (retainers.includes(order.retainerName)) {
                listings.push({ listing: listing, retainerOrder: order });
            }
        });
    });
    return listings;
};

/**
 * Checks in listing if the retainer was undercut by someone else
 *
 * @param {ListingData} listing
 * @param {Order} retainerorder
 * @return {*}
 */
export let checkRetainerUndercut = async (
    listing: ListingData,
    retainerorder: Order,
    retainers: string[]
): Promise<Order[]> => {
    let foundUndercuts: Order[] = [];
    await forEachAsync(listing.orders, async (order) => {
        if (
            order.hq === retainerorder.hq &&
            order.total < retainerorder.total &&
            !retainers.includes(order.retainerName)
        ) {
            foundUndercuts.push(order);
        }
    });
    return foundUndercuts;
};

/**
 * Checks whether any retainers are undercut and returns all undercuts and the retainers order
 *
 * @param {string[]} retainers
 * @param {ListingData[]} listingData
 * @return {*}  {Promise<
 *     {
 *         retainerOrder: Order;
 *         undercuts: Order[];
 *     }[]
 * >}
 */
export let checkRetainers = async (
    retainers: string[],
    listingData: ListingData[]
): Promise<
    {
        retainerOrder: Order;
        undercuts: Order[];
    }[]
> => {
    let retainerListings = await checkListingForRetainers(retainers, listingData);
    let undercuts: { retainerOrder: Order; undercuts: Order[] }[] = [];

    await forEachAsync(retainerListings, async (listing) => {
        undercuts.push({
            retainerOrder: listing.retainerOrder,
            undercuts: await checkRetainerUndercut(listing.listing, listing.retainerOrder, retainers),
        });
    });
    return undercuts;
};
