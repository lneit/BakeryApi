import _ from 'lodash';
import * as Joi from 'joi';
import apiSchemas from '../schemas/apiSchemas';
import { RequestHandler } from 'express';


export const validateRequest = (path: string): RequestHandler => (req, resp, next) => {
    const method = req.method;

    const validatedMethods = ['POST', 'PATCH'];

    if (_.includes(validatedMethods, method) && _.has(apiSchemas, path)) {
        const schema = _.get(apiSchemas, path);

        if(schema) {
            const {error, value} = Joi.validate(req.body, schema);
            if (error) {
                resp.status(400).json({message: "Invalid request data", code: 'N/A'});
                return;
            } else {
                // Replace request body with validated value
                req.body = value;
            }
        }
    }
    next();
}