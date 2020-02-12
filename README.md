# Bakery Api
API server to help a bakery manage its products and serve orders.

The solution represents the RESTful API for creating, retrieving, deleting, and modifying bakery products as well as serving customer orders by determining the cost and packaging breakdown for each requested product and returning it in the response.

## Known Limitations 
The products are stored in memory instead of a database.

## Documentation
The API documentation is available at [Bakery API Docs](http://localhost:3000/api/v1/api-docs/)
Please run the API server locally using ```npm start``` from the project root directory before trying to access the API documentation.

The documentation is generated using Swagger and OpenAPI. Therefore the API-s are consumable using the above link.

Alternatively, please use ```swagger.json``` defined at ```../src``` level as an API spec.

## Test
Run unit tests using the following command from the project root directory.
```
npm install
tsc
npm test
```

## Run
Run Bakery Products API server using the following command from the project root directory.
```
npm install
tsc
npm start
```
