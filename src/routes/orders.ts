import { Router } from 'express';
import { placeOrder } from '../controllers/orders';
const router = Router();

router.post('/', placeOrder);

export default router;