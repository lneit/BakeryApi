import { Router } from 'express';

const router = Router();

router.post('/');

router.get('/', (req, resp) => {
    resp.json({message: 'ok'});
});

router.patch('/:code');

router.delete('/:code');

export default router;