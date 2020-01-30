import { Router } from 'express';
import {
    createProduct,
    getProduct,
    getProducts,
    deleteProduct,
    updateProduct } from '../controllers/products';
const router = Router();

router.post('/', createProduct);

router.get('/:code', getProduct);

router.get('/', getProducts);

router.patch('/:code', updateProduct);

router.delete('/:code', deleteProduct);

export default router;