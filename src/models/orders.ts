export interface Packaging {
    packs: number,
    count: number,
    price: number
};

export interface ProductPackaging {
    options: Packaging[],
    reminder: number
};

export interface ProductOrder {
    count: number,
    code: string
};

export interface OrderPackagingResult {
    code: string,
    count: number,
    totalPrice: number,
    packaging: Packaging[]
};