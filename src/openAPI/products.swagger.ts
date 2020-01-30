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
                        items: {
                            name: {
                                type: 'string',
                                description: 'Product Name'
                            },
                            code: {
                                type: 'string',
                                description: 'Product Code'
                            },
                            packaging_options: {
                                type: 'array',
                                items: {
                                    count: {
                                        type: 'number',
                                        description: 'Packaging Option Count'
                                    },
                                    price: {
                                        type: 'number',
                                        description: 'Packaging Option Price'
                                    },
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}