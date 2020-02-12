import { RequestHandler } from 'express';
import { ProductOrder, OrderPackagingResult } from '../models/orders';
import { findProductPackaging } from '../utils/orders';
import { PRODUCTS } from '../models/productStore';

export const placeOrder: RequestHandler = (req, resp, next) => {
    const order = req.body as ProductOrder[];

    if (!order.length || order.length <= 0) {
        resp.status(400).json({message: "Bad order format"});
        return;
    }

    const result: OrderPackagingResult[] = [];

    for (const {count, code} of order) {
        const product = PRODUCTS.get(code);
        if (!!!product) {
            resp.status(422).json({message: "Could not find a product", code});
            return;
        }

        const {options, reminder} = findProductPackaging(count, product.packagingOptions);

        if (reminder !== 0) {
        resp.status(422).json({message: "Could not find packaging for a product product", code});
            return;
        }

        result.push({
            code,
            count,
            totalPrice: options.reduce((sum, opt) => sum + ((opt.packs * opt.price) || 0), 0),
            packaging: options
        });
    }

    resp.status(200).json(result);
};