export interface Order {
    lastReviewTime: number;
    pricePerUnit: number;
    totalPrice: number;
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
