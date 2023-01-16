const request = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');
const Shop = require('../../models/Shop');

const getShopByIdTest = () => describe('GET /shops/:id', () => {
    let res;
    let id;
    let body;
    let route = `/shops/${id}`;
    const routeWithInvalidId = `/shops/1`;
    const routeWithNonExistingShopId = `/shops/AAAAAAAAAAAAAAAAAAAAAAAA`;

    beforeAll(async () => {
        await mongoose.connect(process.env.TEST_DB_CONNECTION);
        body = {
            name: "test",
            address: {
                country: "test",
                city: "test",
                postCode: "test",
                streetName: "test",
                streetNumber: "test",
                location: {
                    coordinates: [],
                    type: "Point"
                }
            },
            openingHours: [
                {
                    weekDay: 0,
                    startHour: 1,
                    startMinute: 20,
                    endHour: 2,
                    endMinute: 20
                }
            ],
            flavors: [
                {
                    name: "test",
                    available: true
                }
            ],
            rating: 0,
            reviews: [],
            employees: [],
            createdAt: new Date(),
            updatedAt: new Date()
        }
        const shop = new Shop(body);
        const createdShop = await shop.save();
        id = createdShop._id.toString();
        route = `/shops/${id}`;
    })

    beforeEach(async () => {
        if (mongoose.connection.readyState === 0) {
            mongoose.connect(process.env.TEST_DB_CONNECTION);
        }
    })

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    })

    describe('given valid id', () => {
        beforeEach(async () => {
            res = await request(app)
                .get(route)
                .send()
        })

        test('should specify json in the content type header', async () => {
            expect(res.headers['content-type']).toEqual(expect.stringContaining('json'));
        });

        test('should contain json message in reponse body', async () => {
            expect(res.body).toBeDefined();
        });
    })

    describe('given valid id of shop that exists within database', () => {
        const validResponseMessage = 'Shop retrieved';
        beforeEach(async () => {
            res = await request(app)
                .get(route)
        })

        test(`should return "${validResponseMessage}" message`, async () => {
            expect(res.body.message).toBe(validResponseMessage);
        })

        test('should return body containing all fields with valid values', async () => {
            let shop = body;
            shop._id = id;
            expect(res.body.content).toEqual(
                expect.objectContaining(JSON.parse(JSON.stringify(shop)))
            );
        })

        test(`should return status code 200`, async () => {
            expect(res.statusCode).toBe(200);
        })
    });

    describe(`given valid id of shop that doesn't exists within database`, () => {
        const validResponseMessage = 'Shop not found';
        beforeEach(async () => {
            res = await request(app)
                .get(routeWithNonExistingShopId)
        })
        
        test(`should return "${validResponseMessage}" message`, async () => {
            expect(res.body.message).toBe(validResponseMessage);
        })

        test(`should return status code 400`, async () => {
            expect(res.statusCode).toBe(400);
        })
    });

    describe('given invalid id', () => {
        const validResponseMessage = 'Invalid shop id';
        beforeEach(async () => {
            res = await request(app)
                .get(routeWithInvalidId)
        })

        test(`should return "${validResponseMessage}" message`, async () => {
            expect(res.body.message).toBe(validResponseMessage);
        })

        test(`should return status code 400`, async () => {
            expect(res.statusCode).toBe(400);
        })
    });
});

module.exports = getShopByIdTest;