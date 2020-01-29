import express, { Request, Response, NextFunction } from 'express';
import productRoutes from './routes/products';

const app = express();

app.use('/product', productRoutes);

app.use((err: Error, req: Request, resp: Response, next: NextFunction) => {
    return resp.status(500).json({message: err.message});
});

export default app;