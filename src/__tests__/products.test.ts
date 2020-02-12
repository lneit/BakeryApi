import app from '../server';
import supertest from 'supertest';
import { Product } from '../models/products';
import { PRODUCTS as products } from '../models/productStore';

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
    const allProducts = [];
    allProducts.push(new Product(PRODUCT1.code, PRODUCT1.name, PRODUCT1.packaging_options));
    allProducts.push(new Product(PRODUCT2.code, PRODUCT2.name, PRODUCT2.packaging_options));

    jest.spyOn(products, 'getAll').mockReturnValue(allProducts);

    it('Test get all products', async done => {
        const resp = await request.get(`${baseURL}/products`);
        expect(resp.status).toBe(200);
        expect(typeof resp.body).toBe('object');
        expect(resp.body.length).toBe(2);
        expect(Array.isArray(resp.body)).toBeTruthy();
        done();
    });
    it('Test get all products returns empty array', async done => {
        jest.spyOn(products, 'getAll').mockReturnValue([]);

        const resp = await request.get(`${baseURL}/products`);
        expect(resp.status).toBe(200);
        expect(typeof resp.body).toBe('object');
        expect(resp.body.length).toBe(0);
        expect(Array.isArray(resp.body)).toBeTruthy();
        done();
    });
    it('Test get product by code, successful', async done => {
        const {code, name, packaging_options} = PRODUCT1;
        jest.spyOn(products, 'get').mockReturnValue(
            new Product(code, name, packaging_options));

        const resp = await request.get(`${baseURL}/products/VS`);
        expect(resp.status).toBe(200);
        expect(typeof resp.body).toBe('object');
        expect(resp.body.code).toBe(code);
        done();
    });
    it('Test get product by code, not found', async done => {
        jest.spyOn(products, 'get').mockReturnValue(undefined);

        const resp = await request.get(`${baseURL}/products/BM`);
        expect(resp.status).toBe(422);
        expect(resp.body.code).toBe('BM');
        expect(resp.body.message).toBe('Could not find a product');
        done();
    });
    it('Test get product by code, incorrect path', async done => {
        const resp = await request.get(`${baseURL}/product/BM`);
        expect(resp.status).toBe(404);
        done();
    });
});

describe('Test products POST endpoint', () => {
    const addProductSpy = jest.spyOn(products, 'add');

    it('Test successful creation of a new product', async done => {
        const getProductSpy = jest.spyOn(products, 'get').mockReturnValue(undefined);
        const resp = await request
            .post(`${baseURL}/products`)
            .send(PRODUCT1)
            .set('Accept', 'application/json');

        expect(getProductSpy).toBeCalled();
        expect(addProductSpy).toBeCalled();
        expect(resp.status).toBe(201);
        expect(resp.body.code).toBe(PRODUCT1.code);
        expect(resp.body.message).toBe('Created the product');
        done();
    });
    it('Test request bad format', async done => {
        const badProduct = {
            code: 'XX',
            name: 'XXX'
        };

        const resp = await request
            .post(`${baseURL}/products`)
            .send(badProduct)
            .set('Accept', 'application/json');

        expect(addProductSpy).not.toBeCalled();
        expect(resp.status).toBe(400);
        expect(resp.body.message).toBe('Invalid request data');
        done();
    });
    it('Test unsuccessful creation of a product with already existing product code', async done => {
        const {code, name, packaging_options} = PRODUCT1;
        const getProductSpy = jest.spyOn(products, 'get').mockReturnValue(
            new Product(code, name, packaging_options));

        const resp = await request
            .post(`${baseURL}/products`)
            .send(PRODUCT1)
            .set('Accept', 'application/json');

        expect(getProductSpy).toBeCalled();
        expect(addProductSpy).not.toBeCalled();
        expect(resp.status).toBe(409);
        expect(resp.body.code).toBe(code);
        expect(resp.body.message).toBe('Product already exists');
        done();
    });
});

describe('Test products PATCH endpoint', () => {
    const updateProductSpy = jest.spyOn(products, 'update').mockImplementation();

    const updatedProduct = {
        ...PRODUCT1,
        packaging_options: [
            {
                count: 8,
                price: 10.99
            }
        ]
    };
    it('Test product update, successful', async done => {
        const {code, name, packaging_options} = PRODUCT1;
        jest.spyOn(products, 'get').mockReturnValue(
            new Product(code, name, packaging_options));

        const resp = await request
            .patch(`${baseURL}/products/${updatedProduct.code}`)
            .send(updatedProduct)
            .set('Accept', 'application/json');

        expect(updateProductSpy).toBeCalled();
        expect(resp.status).toBe(200);
        expect(resp.body.message).toContain('Updated the product');
        expect(resp.body.code).toBe(updatedProduct.code);
        done();
    });
    it('Test product update, product code parameter does not match the product in the body', async done => {
        jest.spyOn(products, 'get').mockReturnValue(undefined);
        const resp = await request
            .patch(`${baseURL}/products/NNN`)
            .send(updatedProduct)
            .set('Accept', 'application/json');

        expect(updateProductSpy).not.toBeCalled();
        expect(resp.status).toBe(422);
        expect(resp.body.message).toContain('Product code request parameter does not match');
        expect(resp.body.code).toBe('NNN');
        done();
    });
    it('Test product update for a non existing product', async done => {
        jest.spyOn(products, 'get').mockReturnValue(undefined);
        const resp = await request
            .patch(`${baseURL}/products/${updatedProduct.code}`)
            .send(updatedProduct)
            .set('Accept', 'application/json');

        expect(updateProductSpy).not.toBeCalled();
        expect(resp.status).toBe(422);
        expect(resp.body.message).toContain('Could not find a product');
        expect(resp.body.code).toBe(updatedProduct.code);
        done();
    });
});

describe('Test products DELETE endpoint', () => {
    const deleteProductSpy = jest.spyOn(products, 'delete').mockImplementation();

    it('Test deletion of a product, successful', async done => {
        const {code, name, packaging_options} = PRODUCT1;
        jest.spyOn(products, 'get').mockReturnValue(
            new Product(code, name, packaging_options));

        const resp = await request
            .delete(`${baseURL}/products/${code}`)
            .set('Accept', 'application/json');

        expect(deleteProductSpy).toBeCalledTimes(1);
        expect(resp.status).toBe(200);
        expect(resp.body.code).toBe(code);
        expect(resp.body.message).toBe('Deleted the product');
        done();
    });
    it('Test deletion of a product that does not exist', async done => {
        jest.spyOn(products, 'get').mockReturnValue(undefined);
        const resp = await request
            .delete(`${baseURL}/products/MMM`)
            .set('Accept', 'application/json');

        expect(deleteProductSpy).not.toBeCalled();
        expect(resp.status).toBe(422);
        expect(resp.body.code).toBe('MMM');
        expect(resp.body.message).toBe('Could not find a product');
        done();
    });
});