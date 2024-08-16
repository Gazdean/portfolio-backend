const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection.js");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('images', () => {
    describe('GET /api/images', () => {
        it('responds with status code 200 and body with a key of images', () => {
            return request(app)
            .get('/api/images')
            .expect(200)
            .then(( {body} ) => {
                expect(body.hasOwnProperty('images')).toBe(true)
                const {images} = body
                expect(images.length).toBe(7);
            });
        });
        it('responds with status code 200 and images array of length 7', () => {
            return request(app)
            .get('/api/images')
            .expect(200)
                .then(( {body} ) => {
                    const {images} = body
                    expect(Array.isArray(images)).toBe(true);
                    expect(images.length).toBe(7);
                });
        });
        it('responds with status code 200 and the image array elements to be objects, each with 3 properties ', () => {
            return request(app)
            .get('/api/images')
            .expect(200)
                .then(( {body} ) => {
                    const {images} = body
                    images.forEach(image => {
                        const keyArr = Object.keys(image)
                        expect(typeof image).toBe('object');
                        expect(keyArr.length).toBe(3);
                    })
                    
                });
        });
    });
})