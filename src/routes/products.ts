import { Router } from 'express';
import { createProduct } from '../controllers/products';
const router = Router();

router.post('/', createProduct);

router.get('/:code', (req, resp) => {
    resp.json({message: 'ok'});
});

router.get('/');

router.patch('/:code');

router.delete('/:code');

export default router;