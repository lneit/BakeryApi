export const productSchema = {
    type: 'Object',
    properties: {
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
};

export const resultSchema ={
    type: 'Object',
    properties: {
        message: {
            type: 'string',
            description: 'Operation result'
        },
        code: {
            type: 'string',
            description: 'Product Code'
        }
    }
};