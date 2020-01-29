export interface PackagingOption {
    count: number,
    price: number
};

export class Product {
    constructor(public code: string, name: string, packagingOptions: PackagingOption[]) {}
}