import { Router } from 'express';
import {
    createProduct,
    getProduct,
    getProducts,
    deleteProduct,
    updateProduct } from '../controllers/products';
import { validateRequest } from '../middlewares/apiValidation';

const router = Router();

router.post('/', validateRequest('/products'), createProduct);

router.get('/:code', getProduct);

router.get('/', getProducts);

router.patch('/:code', updateProduct);

router.delete('/:code', deleteProduct);

export default router;