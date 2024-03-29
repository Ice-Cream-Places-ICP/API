const request = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { roles, userStatus, authMethod } = require('../../config/constants');

const userLoginTest = () => describe('POST /auth/login', () => {
    const validPassword = 'ABCdef1@';
    const invalidPassword = 'invalid-password';
    const validEmail = 'test-email@gmail.com';
    const invalidEmail = 'invalid-email';
    const authRoute = '/auth/login';
    let res;

    beforeAll(async () => {
        mongoose.connect(process.env.TEST_DB_CONNECTION);
        const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(validPassword, salt);

        const user = new User({
            email: validEmail,
            password: hashedPassword,
            roles: roles.DEFAULT,
            status: userStatus.ACTIVE,
            authType: authMethod.EMAIL
        });

        await user.save();
    })

    beforeEach(async () => {
        res = null;
        if (mongoose.connection.readyState === 0) {
            mongoose.connect(process.env.TEST_DB_CONNECTION);
        }
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
        const validResponseMessage = 'Login Successfully';
        beforeEach(async () => {
            res = await request(app)
                .post(authRoute)
                .send({
                    email: validEmail,
                    password: validPassword
                })
        });

        test('should return body containing token', async () => {
            expect(res.body.content.token).toBeDefined();
        })

        test('should return valid token', async () => {
            const userId = jwt.decode(res.body.content.token).toString();
            var user = User.findById(userId);
            expect(user).toBeDefined();
        })

        test(`should return "${validResponseMessage}" message`, async () => {
            expect(res.body.message).toBe(validResponseMessage);
        })

        test('should return status code 200', async () => {
            expect(res.statusCode).toBe(200);
        })
    })

    describe('given invalid email or password', () => {
        const validResponseMessage = 'Invalid credentials';
        const bodies = [
            { email: validEmail, password: invalidPassword },
            { email: invalidEmail, password: validPassword },
            { email: invalidEmail, password: invalidPassword },
        ]

        test(`should return "${validResponseMessage}" message`, async () => {
            for (const body of bodies) {
                res = await request(app)
                    .post(authRoute)
                    .send(body)
                expect(res.body.message).toBe(validResponseMessage);
            }
        })

        test('should not return token', async () => {
            for (const body of bodies) {
                res = await request(app)
                    .post(authRoute)
                    .send(body)
                expect(res.header.token).toBe(undefined);
            }
        })

        test('should return status code 400', async () => {
            for (const body of bodies) {
                res = await request(app)
                    .post(authRoute)
                    .send(body)
                expect(res.statusCode).toBe(400);
            }
        })
    })

    describe('when the email or password is missing', () => {
        const validResponseMessage = 'All fields are required';
        const bodies = [
            { email: validEmail, password: '' },
            { email: '' , password: validPassword },
            { email: '', password: '' },
        ]

        test(`should return "${validResponseMessage}" message`, async () => {
            for (const body of bodies) {
                res = await request(app)
                    .post(authRoute)
                    .send(body)
                expect(res.body.message).toBe(validResponseMessage);
            }
        })

        test('should not return token', async () => {
            for (const body of bodies) {
                res = await request(app)
                    .post(authRoute)
                    .send(body)
                expect(res.header.token).toBe(undefined);
            }
        })

        test('should return status code 400', async () => {
            for (const body of bodies) {
                res = await request(app)
                    .post(authRoute)
                    .send(body)
                expect(res.statusCode).toBe(400);
            }
        })
    })
});

module.exports = userLoginTest;