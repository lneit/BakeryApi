import express, { Request, Response, NextFunction } from 'express';
import swaggerUi from 'swagger-ui-express';
import { json } from 'body-parser';
import * as swaggerDocument from './swagger.json';
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';

const app = express();

app.use(json());

app.use('/api/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/v1/products', productRoutes);

app.use('/api/v1/orders', orderRoutes);

app.use((err: Error, req: Request, resp: Response, next: NextFunction) => {
    return resp.status(500).json({message: err.message});
});

export default app;