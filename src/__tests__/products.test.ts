import app from '../server';
import supertest from 'supertest';

const request = supertest(app);

it('Sample test for product GET endpoint', async done => {
    const resp = await request.get('/product');

    expect(resp.status).toBe(200);
    expect(resp.body.message).toBe('ok');

    done();
});