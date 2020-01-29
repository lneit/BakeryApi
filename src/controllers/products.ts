import { RequestHandler } from 'express';
import { PackagingOption, Product } from '../models/products';

const PRODUCTS: Product[] = [];

export const createProduct: RequestHandler = (req, resp, next) => {
    console.log("TODO implementation");
};