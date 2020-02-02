import app from '../server';
import supertest from 'supertest';
import { Product, PackagingOption } from '../models/products';
import { Packaging, ProductOrder } from '../models/orders';
import { PRODUCTS as products } from '../controllers/data';

const request = supertest(app);

const baseURL = '/api/v1';

const PRODUCT1 = {
    code: 'VS',
    name: 'Vegemite Scroll',
    packaging_options: [
        {
            count: 3,
            price: 6.99
        },
        {
            count: 5,
            price: 8.99
        }
    ]};

const PRODUCT2 = {
    code: 'BM',
    name: 'Blueberry Muffin',
    packaging_options: [
        {
            count: 2,
            price: 9.95
        },
        {
            count: 5,
            price: 16.95
        },
        {
            count: 8,
            price: 24.95
        }
    ]};

const PRODUCT3 = {
    code: 'CR',
    name: 'Croissant',
    packaging_options: [
        {
            count: 5,
            price: 9.95
        },
        {
            count: 9,
            price: 16.99
        }
    ]};

describe('Test Orders POST endpoint', () => {
    const allProducts = [];
    allProducts.push(new Product(PRODUCT1.code, PRODUCT1.name, PRODUCT1.packaging_options));
    allProducts.push(new Product(PRODUCT2.code, PRODUCT2.name, PRODUCT2.packaging_options));
    allProducts.push(new Product(PRODUCT3.code, PRODUCT3.name, PRODUCT3.packaging_options));

    // jest.spyOn(products, 'getAll').mockReturnValue(allProducts);

    const order: ProductOrder[] = [
        {
            count: 10,
            code: 'VS'
        },
        {
            count: 14,
            code: 'BM'
        },
        {
            count: 13,
            code: 'CR'
        }
    ];

    const packagingBreakdown: any[] = [
        {
            code: 'VS',
            count: 10,
            totalPrice: 17.98,
            packaging: [
                {
                    packs: 2,
                    count: 5,
                    price: 8.99
                }
            ]
        },
        {
            code: 'BM',
            count: 14,
            totalPrice: 54.8,
            packaging: [
                {
                    packs: 1,
                    count: 8,
                    price: 24.95
                },
                {
                    packs: 3,
                    count: 2,
                    price: 9.95
                }
            ]
        },
        {
            code: 'CR',
            count: 13,
            totalPrice: 25.85,
            packaging: [
                {
                    packs: 2,
                    count: 5,
                    price: 9.95
                },
                {
                    packs: 1,
                    count: 3,
                    price: 5.95
                }
            ]
        }
    ];

    it('Test packaging breakdown for an order', async done => {
        const resp = await request.post(`${baseURL}/orders`);
        expect(resp.status).toBe(200);
        expect(resp.body.packaging).toContain(packagingBreakdown);
        done();
    });
});