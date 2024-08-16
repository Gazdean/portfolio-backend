const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection.js");

const { fetchAllImages } = require('../models/images-model.js');

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
        it('responds with status code 200 and the image array elements to be objects, each with 3 properties and correct keys', () => {
            return request(app)
            .get('/api/images')
            .expect(200)
                .then(( {body} ) => {
                    const {images} = body
                    images.forEach(image => {
                        const keyArr = Object.keys(image)
                        expect(typeof image).toBe('object');
                        expect(keyArr.length).toBe(3);
                        expect(image).toMatchObject({
                            image_id: expect.any(Number),
                            image_url: expect.any(String),
                            alt_text: expect.any(String),
                          });
                    })
                    
                });
        });
        it('should respond with status code 200 and the message "no images are available" if there are no image objects availabe', async () => {
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] });
            await expect(fetchAllImages()).rejects.toEqual({
                status: 200,
                msg: 'No images available'
            });
            db.query.mockRestore();
        });   
    }); 
})

describe('GET /api/images/:image_id', () => {
    it('responds with status code 200 and body with a key of image', () => {
        return request(app)
        .get('/api/images/1')
        .expect(200)
        .then(( {body} ) => {
            expect(body.hasOwnProperty('image')).toBe(true)
        });
    });
    it('responds with status code 200 and image array of length 1', () => {
        return request(app)
        .get('/api/images/1')
        .expect(200)
            .then(( {body} ) => {
                const {image} = body
                expect(Array.isArray(image)).toBe(true);
                expect(image.length).toBe(1);
            });
    });
    it('responds with status code 200 and the image array object to be an object,  with 3 properties and correct keys', () => {
        return request(app)
        .get('/api/images/1')
        .expect(200)
        .then(( {body} ) => {
            const image = body.image[0]
            const keyArr = Object.keys(image)
            expect(typeof image).toBe('object');
            expect(keyArr.length).toBe(3);
            expect(image.image_id).toBe(1);
            expect(image.image_url).toBe('./Assets/Images/Gallery-images/northcoders.jpg');
            expect(image.alt_text).toBe('Gareth and members of his Northcoders final project team');          
        });
    });  
    it("returns a status code 404 with the message 'image_id does not exist' if passed a valid but non existant image_id(its a number)", () => {
        return request(app)
          .get("/api/images/200")
          .expect(404)
          .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("image_id does not exist!");
          });
      });
    it("returns a status code 404 with the message 'image_id does not exist' if passed a valid but non existant image_id(its a number)", () => {
        return request(app)
          .get("/api/images/error")
          .expect(404)
          .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("bad request invalid data type!");
          });
      });

})