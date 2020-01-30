import { Router } from 'express';
import { createProduct, getProduct, getProducts } from '../controllers/products';
const router = Router();

router.post('/', createProduct);

router.get('/:code', getProduct);

router.get('/', getProducts);

router.patch('/:code');

router.delete('/:code');

export default router;