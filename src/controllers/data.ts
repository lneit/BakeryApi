import { Product } from '../models/products';

// A primitive implementation of Products data store
export class Products {
    constructor(private products: Product[] = []) {}

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
        this.products = this.products.filter(product => product.code !== code);
    }

    update(product: Product): void {
        const filtered = this.products.filter(el => el.code !== product.code);
        this.products = [
            ...filtered,
            product
        ];
    }
}

export const PRODUCTS = new Products();