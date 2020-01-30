export interface PackagingOption {
    count: number,
    price: number
};

export class Product {
    constructor(public code: string, public name: string, public packagingOptions: PackagingOption[]) {}
}