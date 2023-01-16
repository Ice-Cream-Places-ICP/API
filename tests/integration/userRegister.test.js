const request = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');

const userRegisterTest = () => describe('POST /auth/register', () => {
    const validPassword = 'ABCdef1@';
    const invalidPassword = 'invalid-password';
    const validEmail = 'test-email@gmail.com';
    const invalidEmail = 'invalid-email';
    const authRoute = '/auth/register';
    let res;

    beforeEach(async () => {
        res = null;
        if (mongoose.connection.readyState === 0) {
            mongoose.connect(process.env.TEST_DB_CONNECTION);
        }
        await mongoose.connection.dropDatabase();
    })

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    })

    describe('given any body', () => {
        const bodies = [
            { dumbData: '' },
            { email: validEmail, },
            { password: validPassword },
            {}
        ]
        test('should specify json in the content type header', async () => {
            for (const body of bodies) {
                const res = await request(app)
                    .post(authRoute)
                    .send(body)
                expect(res.headers['content-type']).toEqual(expect.stringContaining('json'));
            }
        });

        test('should contain json message in reponse body', async () => {
            for (const body of bodies) {
                const res = await request(app)
                    .post(authRoute)
                    .send(body)
                expect(res.body).toBeDefined();
            }
        });
    })

    describe('given valid email and password', () => {
        beforeEach(async () => {
            res = await request(app)
                .post(authRoute)
                .send({
                    email: validEmail,
                    password: validPassword
                })
        });

        test('should return "New user created" message', async () => {
            expect(res.body.message).toBe('New user created');
        })

        test('should respond with status code 200', async () => {
            expect(res.statusCode).toBe(200);
        });
    });

    describe('given invalid email', () => {
        beforeEach(async () => {
            res = await request(app)
                .post(authRoute)
                .send({
                    email: invalidEmail,
                    password: validPassword
                })
        });

        test('should return "Invalid email" message', async () => {
            expect(res.body.message).toBe("Invalid email");
        });
        
        test('should return status code 400', async () => {
            expect(res.statusCode).toBe(400);
        });
    })

    describe('given invalid password', () => {
        beforeEach(async () => {
            res = await request(app)
                .post(authRoute)
                .send({
                    email: validEmail,
                    password: invalidPassword
                })
        });

        test('should return "Password must contain minimum 8 letters containing at least - 1 lowercase, 1 uppercase, 1 number, 1 symbol" message', async () => {
            expect(res.body.message).toBe('Password must contain minimum 8 letters containing at least - 1 lowercase, 1 uppercase, 1 number, 1 symbol');
        })

        test('should return status code 400', async () => {
            expect(res.statusCode).toBe(400);
        });
    })

    describe('when the email or password is missing', () => {
        const bodies = [
            { email: validEmail, },
            { password: validPassword },
            {}
        ]

        test('should return status false', async () => {
            for (const body of bodies) {
                const res = await request(app)
                    .post(authRoute)
                    .send(body);
                expect(res.body.status).toBe(false);
            }
        })

        test('should return "All fields are required" message', async () => {
            for (const body of bodies) {
                const res = await request(app)
                    .post(authRoute)
                    .send(body);
                expect(res.body.message).toBe('All fields are required');
            }
        })

        test('should return status code 400', async () => {
            for (const body of bodies) {
                const res = await request(app)
                    .post(authRoute)
                    .send(body);
                expect(res.statusCode).toBe(400);
            }
        })
    });

    describe('when user already exists', () => {
        beforeEach(async () => {
            await request(app)
                .post(authRoute)
                .send({
                    email: validEmail,
                    password: validPassword
                })

            res = await request(app)
                .post(authRoute)
                .send({
                    email: validEmail,
                    password: validPassword
                })
                .send({
                    email: validEmail,
                    password: validPassword
                })
        });

        test('should contain "User already exists" json message inside body', async () => {
            expect(res.body.message).toBe('User already exists');
        })

        test('should return status false', async () => {
            expect(res.body.status).toBe(false);
        })

        test('should return status code 400', async () => {
            expect(res.statusCode).toBe(400);
        })
    })
});

module.exports = userRegisterTest;