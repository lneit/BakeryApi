import { productSchema, resultSchema } from './schemas.swagger'
export const getProducts = {
    tags: ['Products'],
    description: "Returns all available products in the bakery.",
    operationId: 'getProducts',
    responses: {
        "200": {
            description: "A list of products.",
            "content": {
                "application/json": {
                    schema: {
                        type: 'array',
                        items: productSchema
                    }
                }
            }
        }
    }
}

export const createProduct = {
    tags: ['Products'],
    description: "Creates a new product in the bakery.",
    operationId: 'createProduct',
    requestBody: {
        "description": "Product Object",
        "required": true,
        "content": {
            "application/json": {
                schema: productSchema
            }
        }
    },
    responses: {
        "200": {
            description: "Successful create product response.",
            "content": {
                "application/json": {
                    schema: resultSchema
                }
            }
        },
        "422": {
            description: "Unprocessable Entity",
            "content": {
                "application/json": {
                    schema: resultSchema
                }
            }
        }
    }
}

export const getProduct = {
    tags: ['Products'],
    description: "Returns a product by the Product Code",
    operationId: 'getProduct',
    parameters: [
        {
            name: "code",
            in: "path",
            required: true,
            description: "Product Code",
            type: "string"
        }
    ],
    responses: {
        "200": {
            description: "Successful get product response",
            "content": {
                "application/json": {
                    schema: productSchema
                }
            }
        },
        "422": {
            description: "Unprocessable Entity",
            "content": {
                "application/json": {
                    schema: resultSchema
                }
            }
        }
    }
}

export const deleteProduct = {
    tags: ['Products'],
    description: "Deletes a product by the Product Code",
    operationId: 'deleteProduct',
    parameters: [
        {
            name: "code",
            in: "path",
            required: true,
            description: "Product Code",
            type: "string"
        }
    ],
    responses: {
        "200": {
            description: "Successful delete product response",
            "content": {
                "application/json": {
                    schema: resultSchema
                }
            }
        },
        "422": {
            description: "Unprocessable Entity",
            "content": {
                "application/json": {
                    schema: resultSchema
                }
            }
        }
    }
}

export const updateProduct = {
    tags: ['Products'],
    description: "Updates a product in the bakery.",
    operationId: 'updateProduct',
    parameters: [
        {
            name: "code",
            in: "path",
            required: true,
            description: "Product Code",
            type: "string"
        }
    ],
    requestBody: {
        "description": "Product Object",
        "required": true,
        "content": {
            "application/json": {
                schema: productSchema
            }
        }
    },
    responses: {
        "200": {
            description: "Successful update product response.",
            "content": {
                "application/json": {
                    schema: resultSchema
                }
            }
        },
        "422": {
            description: "Unprocessable Entity",
            "content": {
                "application/json": {
                    schema: resultSchema
                }
            }
        }
    }
}