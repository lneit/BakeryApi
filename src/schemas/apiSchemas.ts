import * as Joi from 'joi';

const productSchema = Joi.object({
    code: Joi.string().required(),
    name: Joi.string().required(),
    packaging_options: Joi.array().items(
        Joi.object({
            count: Joi.number().integer().required(),
            price: Joi.number().required()
        })
    ).required()
});

const ordersSchema = Joi.any();

export default {
    '/products': productSchema,
    '/orders': ordersSchema
};