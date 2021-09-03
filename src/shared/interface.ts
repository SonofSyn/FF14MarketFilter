export interface Order {
    lastReviewTime: string;
    pricePerUnit: number;
    total: number;
    quantity: number;
    hq: boolean;
    retainerName: string;
}

export interface ListingData {
    id: string;
    date: string;
    name: string;
    crafter: string;
    itemLevel: number;
    orders: Order[];
}

export interface ItemMetrics {
    id: string;
    date: string;
    name: string;
    crafter: string;
    itemLevel: number;
    minPriceNQ: number;
    maxPriceNQ: number;
    minPriceHQ: number;
    maxPriceHQ: number;
    amountNQListings: number;
    amountHQListing: number;
}

export interface ResponseData {
    id: string;
    date: string;
    name: string;
    crafter: string;
    itemLevel: number;
    minPriceNQ: number;
    maxPriceNQ: number;
    minPriceHQ: number;
    maxPriceHQ: number;
    amountNQListings: number;
    amountHQListing: number;
    orders: Order[];
}

export interface Retainer {
    name: string;
    crafter: string;
    itemLevel: number;
    retainerOrder: Order;
    undercuts: Order[];
}

export type Server =
    | "Cerberus"
    | "Louisoix"
    | "Moogle"
    | "Omega"
    | "Ragnarok"
    | "Spriggan"
    | "Light"
    | "Lich"
    | "Odin"
    | "Phoenix"
    | "Shiva"
    | "Twintania"
    | "Zodiark";

export interface ItemDictionary {
    [id: string]: string;
}

export interface ItemExtrasDictionary {
    [id: string]: { name: string; icon: string; level: number; crafter: string };
}

export interface ItemExtrasReducedDictionary {
    [id: string]: { level: number; crafter: string };
}
