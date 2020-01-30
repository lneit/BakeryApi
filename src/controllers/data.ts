import { Product } from '../models/products';


export class Products {
    constructor(public products: Product[] = []) {}

    getAll(): Product[] {
        return this.products;
    }

    get(code: string): Product|undefined {
        return this.products.find(product => product.code === code);
    }

    add(product: Product): void {
        this.products.push(product);
    }

    delete(code: string): void {
        this.products = [
            ...this.products.filter(product => product.code === code)
        ];
    }
}

export const PRODUCTS = new Products();