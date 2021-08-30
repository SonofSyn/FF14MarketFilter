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
    orders: Order[];
}

export interface ItemMetrics {
    id: string;
    date: string;
    name: string;
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
