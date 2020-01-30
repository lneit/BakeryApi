import app from '../server';
import supertest from 'supertest';
import { PRODUCTS } from '../controllers/data';
import { Product } from '../models/products';

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

describe('Test products GET endpoint', () => {
    it('Test GET all products', async done => {
        jest.mock('../controllers/data', () => ({
            get PRODUCTS () {
              return [];
            }
        }));
        const resp = await request.get(`${baseURL}/products`);
        expect(resp.status).toBe(200);
        done();
    });
    it('Test GET product by code, successful', async done => {
        const {code, name, packaging_options} = PRODUCT1;

        jest.mock('../controllers/data', () => ({
            get PRODUCTS () {
                const prodArray: Product[] = [];
                prodArray.push(new Product(code, name, packaging_options));
                return prodArray;
            }
        }));
        const resp = await request.get(`${baseURL}/products/VS`);
        expect(resp.status).toBe(200);
        done();
    });
    it('Test GET product by code, not found', async done => {
        const resp = await request.get(`${baseURL}/products/BM`);
        expect(resp.status).toBe(422);
        done();
    });
    it('Test GET product by code, incorrect path', async done => {
        const resp = await request.get(`${baseURL}/products`);
        expect(resp.status).toBe(404);
        done();
    });
});

describe('Test products POST endpoint', () => {
    it('Test POST to create a new, fist product, successful', async done => {
        jest.mock('../controllers/data', () => ({
            get PRODUCTS () {
              return [];
            }
        }));
        const resp = await request
            .post(`${baseURL}/products`)
            .send(PRODUCT1)
            .set('Accept', 'application/json');

        expect(resp.status).toBe(201);
        expect(PRODUCTS.length).toBe(1);
        expect(PRODUCTS[0].code).toBe('VS');
        done();
    });
    it('Test POST to create a subsequent product, successful', async done => {
        const {code, name, packaging_options} = PRODUCT1;

        jest.mock('../controllers/data', () => ({
            get PRODUCTS () {
                const prodArray: Product[] = [];
                prodArray.push(new Product(code, name, packaging_options));
                return prodArray;
            }
        }));

        const resp = await request
            .post(`${baseURL}/products`)
            .send(PRODUCT2)
            .set('Accept', 'application/json');

        expect(resp.status).toBe(201);
        expect(PRODUCTS.length).toBe(2);
        done();
    });
    it('Test the creation of a new product with already existing product code, unsuccessful', async done => {
        const {code, name, packaging_options} = PRODUCT1;

        jest.mock('../controllers/data', () => ({
            get PRODUCTS () {
                const prodArray: Product[] = [];
                prodArray.push(new Product(code, name, packaging_options));
                return prodArray;
            }
        }));

        const resp = await request
            .post(`${baseURL}/products`)
            .send(PRODUCT1)
            .set('Accept', 'application/json');

        expect(resp.status).toBe(422);
        done();
    });
});

describe('Test products PATCH endpoint', () => {
    it('Test product update, successful', async done => {
        const updatedProduct = {
            ...PRODUCT1,
            packaging_options: [
                {
                    count: 8,
                    price: 10.99
                }
            ]
        };
        jest.mock('../controllers/data', () => ({
            get PRODUCTS () {
                const prodArray: Product[] = [];
                prodArray.push(new Product(PRODUCT1.code, PRODUCT1.name, PRODUCT1.packaging_options));
                prodArray.push(new Product(PRODUCT2.code, PRODUCT2.name, PRODUCT2.packaging_options));
                return prodArray;
            }
        }));
        const resp = await request
            .patch(`${baseURL}/products/${PRODUCT1.code}`)
            .send(updatedProduct)
            .set('Accept', 'application/json');

        expect(resp.status).toBe(200);
        expect(PRODUCTS.length).toBe(2);
        expect(PRODUCTS[0].code).toBe('VS');
        expect(PRODUCTS[0].packagingOptions.length).toBe(1);
        expect(PRODUCTS[0].packagingOptions[0].count).toBe(8);
        expect(PRODUCTS[0].packagingOptions[0].price).toBe(10.99);
        done();
    });
    it('Test product update, product not found', async done => {
        const updatedProduct = {
            ...PRODUCT1,
            packaging_options: [
                {
                    count: 8,
                    price: 10.99
                }
            ]
        };
        jest.mock('../controllers/data', () => ({
            get PRODUCTS () {
                const prodArray: Product[] = [];
                prodArray.push(new Product(PRODUCT2.code, PRODUCT2.name, PRODUCT2.packaging_options));
                return prodArray;
            }
        }));
        const resp = await request
            .patch(`${baseURL}/products/NNN`)
            .send(updatedProduct)
            .set('Accept', 'application/json');

        expect(resp.status).toBe(422);
        expect(PRODUCTS.length).toBe(1);
        done();
    });
    it('Test product update, path not found', async done => {
        const updatedProduct = {
            ...PRODUCT1,
            packaging_options: [
                {
                    count: 8,
                    price: 10.99
                }
            ]
        };
        jest.mock('../controllers/data', () => ({
            get PRODUCTS () {
                const prodArray: Product[] = [];
                prodArray.push(new Product(PRODUCT2.code, PRODUCT2.name, PRODUCT2.packaging_options));
                return prodArray;
            }
        }));
        const resp = await request
            .patch(`${baseURL}/products`)
            .send(updatedProduct)
            .set('Accept', 'application/json');

        expect(resp.status).toBe(404);
        expect(PRODUCTS.length).toBe(1);
        done();
    });
});

describe('Test products DELETE endpoint', () => {
    it('Test deletion of a product, successful', async done => {
        jest.mock('../controllers/data', () => ({
            get PRODUCTS () {
                const prodArray: Product[] = [];
                prodArray.push(new Product(PRODUCT1.code, PRODUCT1.name, PRODUCT1.packaging_options));
                prodArray.push(new Product(PRODUCT2.code, PRODUCT2.name, PRODUCT2.packaging_options));
                return prodArray;
            }
        }));
        const resp = await request
            .delete(`${baseURL}/products/${PRODUCT1.code}`)
            .set('Accept', 'application/json');

        expect(PRODUCTS.length).toBe(1);
        expect(resp.status).toBe(200);
        done();
    });
    it('Test deletion of a product with only one product in the list, successful', async done => {
        const {code, name, packaging_options} = PRODUCT1;

        jest.mock('../controllers/data', () => ({
            get PRODUCTS () {
                const prodArray: Product[] = [];
                prodArray.push(new Product(code, name, packaging_options));
                return prodArray;
            }
        }));
        const resp = await request
            .delete(`${baseURL}/products/${code}`)
            .set('Accept', 'application/json');

        expect(PRODUCTS.length).toBe(0);
        expect(resp.status).toBe(200);
        done();
    });
    it('Test deletion of a product that does not exist', async done => {
        const {code, name, packaging_options} = PRODUCT1;

        jest.mock('../controllers/data', () => ({
            get PRODUCTS () {
                const prodArray: Product[] = [];
                prodArray.push(new Product(code, name, packaging_options));
                return prodArray;
            }
        }));
        const resp = await request
            .delete(`${baseURL}/products/MMM`)
            .set('Accept', 'application/json');

        expect(PRODUCTS.length).toBe(1);
        expect(resp.status).toBe(422);
        done();
    });
});