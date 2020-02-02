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

    it('Test bad order', async done => {
        const resp = await request
            .post(`${baseURL}/orders`)
           
        expect(resp.status).toBe(400);
        expect(resp.body.message).toContain('Bad order format. Please refer to POST /orders API definition.');
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

    it.only('Test packaging breakdown for an order', async done => {
        jest.spyOn(products, 'get')
            .mockReturnValueOnce(new Product(PRODUCT1.code, PRODUCT1.name, PRODUCT1.packaging_options))
            .mockReturnValueOnce(new Product(PRODUCT2.code, PRODUCT2.name, PRODUCT2.packaging_options))
            .mockReturnValueOnce(new Product(PRODUCT3.code, PRODUCT3.name, PRODUCT3.packaging_options));

        const resp = await request
            .post(`${baseURL}/orders`)
            .send(order)
            .set('Accept', 'application/json');

        const result: any[] = resp.body;

        expect(resp.status).toBe(200);
        expect(Array.isArray(result)).toBeTruthy();
        expect(result.length).toBe(3);

        const vsProductPack = result.find(el => el.code === 'VS');
        const bmProductPack = result.find(el => el.code === 'BM');
        const crProductPack = result.find(el => el.code === 'CR');

        expect(vsProductPack.count).toBe(10);
        expect(vsProductPack.totalPrice).toBe(17.98);
        expect(vsProductPack.packaging[0].packs).toBe(2);
        expect(vsProductPack.packaging[0].count).toBe(5);
        expect(vsProductPack.packaging[0].price).toBe(8.99);

        expect(bmProductPack.count).toBe(14);
        expect(bmProductPack.totalPrice).toBe(54.8);
        expect(bmProductPack.packaging[0].packs).toBe(1);
        expect(bmProductPack.packaging[0].count).toBe(8);
        expect(bmProductPack.packaging[0].price).toBe(24.95);
        expect(bmProductPack.packaging[1].packs).toBe(3);
        expect(bmProductPack.packaging[1].count).toBe(2);
        expect(bmProductPack.packaging[1].price).toBe(9.95);

        expect(crProductPack.count).toBe(13);
        expect(crProductPack.totalPrice).toBeCloseTo(25.85);
        expect(crProductPack.packaging[0].packs).toBe(2);
        expect(crProductPack.packaging[0].count).toBe(5);
        expect(crProductPack.packaging[0].price).toBe(9.95);
        expect(crProductPack.packaging[1].packs).toBe(1);
        expect(crProductPack.packaging[1].count).toBe(3);
        expect(crProductPack.packaging[1].price).toBe(5.95);

        done();
    });
});