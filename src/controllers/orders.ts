import { RequestHandler } from 'express';
import { Packaging, ProductOrder } from '../models/orders';
import { PRODUCTS } from './data';

export const placeOrder: RequestHandler = (req, resp, next) => {
    const order = req.body as ProductOrder[];

    const packaging: Packaging[] = [];

    resp.status(200).json(packaging);
};