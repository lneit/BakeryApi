import app from '../server';
import supertest from 'supertest';
import { Product } from '../models/products';
import { ProductOrder, OrderPackagingResult } from '../models/orders';
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
            count: 3,
            price: 5.95
        },
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
    beforeEach(() => {
        jest.resetAllMocks();
    });
    

    it('Test bad order', async done => {
        const resp = await request
            .post(`${baseURL}/orders`)
           
        expect(resp.status).toBe(400);
        done();
    });

    it('Test product code not found', async done => {
        jest.spyOn(products, 'get').mockReturnValueOnce(undefined);

        const resp = await request
            .post(`${baseURL}/orders`)
            .send(order)
            .set('Accept', 'application/json');
           
        expect(resp.status).toBe(422);
        expect(resp.body.message).toContain('Could not find a product');
        expect(resp.body.code).toBe('VS');
        done();
    });

    it('Test product packaging that matches the order not found', async done => {
        const modifiedProduct = {
            code: 'VS',
            name: 'Vegemite Scroll',
            packaging_options: [
                {
                    count: 3,
                    price: 6.99
                }
            ]};
        jest.spyOn(products, 'get')
            .mockReturnValueOnce(new Product(modifiedProduct.code, modifiedProduct.name, modifiedProduct.packaging_options))
            .mockReturnValueOnce(new Product(PRODUCT2.code, PRODUCT2.name, PRODUCT2.packaging_options))
            .mockReturnValueOnce(new Product(PRODUCT3.code, PRODUCT3.name, PRODUCT3.packaging_options));

        const resp = await request
            .post(`${baseURL}/orders`)
            .send(order)
            .set('Accept', 'application/json');
           
        expect(resp.status).toBe(422);
        expect(resp.body.message).toContain('Could not find packaging');
        expect(resp.body.code).toBe('VS');
        done();
    });

    it('Test packaging breakdown for an order', async done => {
        jest.spyOn(products, 'get')
            .mockReturnValueOnce(new Product(PRODUCT1.code, PRODUCT1.name, PRODUCT1.packaging_options))
            .mockReturnValueOnce(new Product(PRODUCT2.code, PRODUCT2.name, PRODUCT2.packaging_options))
            .mockReturnValueOnce(new Product(PRODUCT3.code, PRODUCT3.name, PRODUCT3.packaging_options));

        const resp = await request
            .post(`${baseURL}/orders`)
            .send(order)
            .set('Accept', 'application/json');

        const result: OrderPackagingResult[] = resp.body;

        expect(resp.status).toBe(200);
        expect(Array.isArray(result)).toBeTruthy();
        expect(result.length).toBe(3);

        const vsProductPack = result.find(el => el.code === 'VS');
        const bmProductPack = result.find(el => el.code === 'BM');
        const crProductPack = result.find(el => el.code === 'CR');

        expect(vsProductPack && vsProductPack.count).toBe(10);
        expect(vsProductPack && vsProductPack.totalPrice).toBeCloseTo(17.98);
        expect(bmProductPack && bmProductPack.count).toBe(14);
        // Attention, same number of packages but lower price!!! 54.8 vs 53.8
        expect(bmProductPack && bmProductPack.totalPrice).toBeCloseTo(53.8);

        expect(crProductPack && crProductPack.count).toBe(13);
        expect(crProductPack && crProductPack.totalPrice).toBeCloseTo(25.85);

        done();
    });
});