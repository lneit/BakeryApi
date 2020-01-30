import { getProducts } from './openAPI/products.swagger';

export const swaggerDocument = {
    openapi: '3.0.1',
    info: {
        version: '1.0.0',
        title: 'Bakery APIs Document',
        description: 'These API-s help a bakery manage their products and serve orders',
        termsOfService: '',
        contact: {
            name: 'Paige Turner',
            email: 'paige.turner@gmail.com',
            url: 'https://paigeturner.any'
        },
        license: {
            name: 'Apache 2.0',
            url: 'https://www.apache.org/licenses/LICENSE-2.0.html'
        },
    },
    servers: [
        {
            url: 'http://localhost:3000/api/v1',
            description: 'Local server'
        },
    ],
    tags: [
        {
            name: 'Products'
        }
    ],
    paths: {
        "/products": {
            "get": getProducts
        }
    }
}