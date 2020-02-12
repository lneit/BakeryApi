import { RequestHandler } from 'express';
import { Product } from '../models/products';
import { PRODUCTS } from '../models/productStore';

export const getProducts: RequestHandler = (req, resp, next) => {
    resp.status(200).json(PRODUCTS.getAll());
};

export const getProduct: RequestHandler<{code: string}> = (req, resp, next) => {
    const code = req.params.code;
    const product = PRODUCTS.get(code);

    if (!!!product) {
        resp.status(422).json({message: "Could not find a product", code});
        return;
    }
    resp.status(200).json(product);
};

export const createProduct: RequestHandler = (req, resp, next) => {
    const {code, name, packaging_options} = req.body as {
        code: string,
        name: string,
        packaging_options: {
            count: number,
            price: number
        }[]
    };

    if (PRODUCTS.get(code)) {
        resp.status(422).json({message: "Product already exists", code});
        return;
    }

    PRODUCTS.add(new Product(code, name, packaging_options));

    resp.status(201).json({message: "Created the product", code});
};

export const deleteProduct: RequestHandler<{code: string}> = (req, resp, next) => {
    const code = req.params.code;

    const product = PRODUCTS.get(code);

    if (!!!product) {
        resp.status(422).json({message: "Could not find a product", code});
        return;
    }

    PRODUCTS.delete(code);

    resp.status(200).json({message: "Deleted the product", code});
};

export const updateProduct: RequestHandler<{code: string}> = (req, resp, next) => {
    const productCodeParam = req.params.code;

    const {code, name, packaging_options} = req.body as {
        code: string,
        name: string,
        packaging_options: {
            count: number,
            price: number
        }[]
    };

    if (productCodeParam !== code) {
        resp.status(422).json({
            message: "Product code request parameter does not match the product in the body of the message",
            code: productCodeParam});
        return;
    }

    const product = PRODUCTS.get(code);
    if (!!!product) {
        resp.status(422).json({message: "Could not find a product", code});
        return;
    }

    PRODUCTS.update(new Product(code, name, packaging_options));

    resp.status(200).json({message: "Updated the product", code});
};