const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection.js");

const { fetchAllImages, fetchImageById } = require('../models/images-model.js');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('images', () => {
    // GET all images
    describe('GET/api/images', () => {
        it('responds with status code 200 and body with a key of images', async () => {
            const response = await request(app)
            .get('/api/images')
            .expect(200)
            const {body} = response
            expect(body.hasOwnProperty('images')).toBe(true)
        });
        it('responds with status code 200 and images array of length 7', async () => {
            const response = await request(app)
            .get('/api/images')
            .expect(200)
            const {body} = response
            const {images} = body
            expect(Array.isArray(images)).toBe(true);
            expect(images.length).toBe(7);
            
        });
        it('responds with status code 200 and the image array elements to be objects, each with 3 properties and correct keys', async () => {
            const response = await request(app)
            .get('/api/images')
            .expect(200)
            const {body} = response
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
        it('should respond with status code 200 and the message "no images are available" if there are no image objects availabe', async () => {
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] });
            await expect(fetchAllImages()).rejects.toEqual({
                status: 200,
                msg: 'No images available'
            });
            db.query.mockRestore();
        });   
    }); 
    // GET image by id
    describe('GET/api/images/:image_id', () => {
        it('responds with status code 200 and body with a key of image', async () => {
            const response = await request(app)
            .get('/api/images/1')
            .expect(200)
            const {body} = response
            expect(body.hasOwnProperty('image')).toBe(true)
        });
        it('responds with status code 200 and image array of length 1', async () => {
            const response = await request(app)
            .get('/api/images/1')
            .expect(200)
            const {body} = response
            const {image} = body
            expect(Array.isArray(image)).toBe(true);
            expect(image.length).toBe(1);
        });
        it('responds with status code 200 and the image array object to be an object, with 3 properties and correct keys', async () => {
            const response = await request(app)
            .get('/api/images/1')
            .expect(200)
            const {body} = response
            const image = body.image[0]
            const keyArr = Object.keys(image)
            expect(typeof image).toBe('object');
            expect(keyArr.length).toBe(3);
            expect(image.image_id).toBe(1);
            expect(image.image_url).toBe('./Assets/Images/Gallery-images/northcoders.jpg');
            expect(image.alt_text).toBe('Gareth and members of his Northcoders final project team');          
        });  
        it("returns a status code 404 with the message 'Not Found, image_id does not exist!' if passed a valid but non existant image_id", async () => {
            const response = await request(app)
            .get("/api/images/200")
            .expect(404)
            const{ body }= response
            const { msg } = body;
            expect(msg).toBe("Not Found, image_id does not exist!");
        });
        it("returns a status code 404 with the message 'Bad Request, invalid data type!' if passed an invalid image_id", async () => {
            const response = await request(app)
            .get("/api/images/thisIsAstring")
            .expect(404)
            const{ body }= response
            const { msg } = body;
            expect(msg).toBe("Bad Request, invalid data type!");
        });
    })

    describe('POST/api/images', () => {
        it('returns a status code 201, and the created image object if successful', async () => {
            const response = await request(app)
            .post('/api/images')
            .send({image_url: "./Assets/Images/Project-images/new-image.png", alt_text: "This is a new image"})
            .expect(201)
            const {image} = response.body
            expect(typeof image).toBe('object');
            expect(Object.keys(image).length).toBe(3)
            expect(image).toMatchObject({
                image_id: 8,
                image_url: "./Assets/Images/Project-images/new-image.png",
                alt_text: "This is a new image"
            });
        })
        it('returns a status code 400 with the message "Bad request, both image_url and alt_text are needed!", if the client only sends the image_url data', async () => {
            const response = await request(app)
            .post('/api/images')
            .send({image_url: "./Assets/Images/Project-images/new-image.png"})
            .expect(400)
            const {msg} = response.body
            expect(msg).toBe('Bad request, both image_url and alt_text are needed!')
        })
        it('returns a status code 400 with the message "Bad request, both image_url and alt_text are needed!", if the client only sends alt_text data', async () => {
            const response = await request(app)
            .post('/api/images')
            .send({alt_text: "This is a new image"})
            .expect(400)
            const {msg} = response.body
            expect(msg).toBe('Bad request, both image_url and alt_text are needed!')
        })
        it('returns a status code 400 with the message "Bad request, both image_url and alt_text are needed!", if the client sends an empty object', async () => {
            const response = await request(app)
            .post('/api/images')
            .send({})
            .expect(400)
            const {msg} = response.body
            expect(msg).toBe('Bad request, both image_url and alt_text are needed!')
        })
        it('returns a status code 400 with the message "Bad request, incorrect data sent, only include image_url and alt_text!", if the client sends data other than the image_url and alt_text data', async () => {
            const response = await request(app)
            .post('/api/images')
            .send({image_url: "./Assets/Images/Project-images/new-image.png", alt_text: "This is a new image", number: 7})
            .expect(400)
            const {msg} = response.body
            expect(msg).toBe('Bad request, incorrect data sent, only include image_url and alt_text!')
        })
        it('returns a status code 400 with the message "Bad request, incorrect data sent, only include image_url and alt_text!", if the client sends data other than the image_url and alt_text data', async () => {
            const response = await request(app)
            .post('/api/images')
            .send({image_url: "./Assets/Images/Project-images/new-image.png", number: 7})
            .expect(400)
            const {msg} = response.body
            expect(msg).toBe('Bad request, both image_url and alt_text are needed!')
        })
    })

    describe('PATCH/api/images/:image_id', () => {   
        it('returns a status code 201 and the updated image object when the client updates the image_url by image id', async () => {
            const response = await request(app)
            .patch('/api/images/1')
            .send({image_url: 'new-image-url.png'})
            .expect(201)
            const {image} = response.body
            expect(image).toMatchObject({
                image_id: 1,
                image_url: 'new-image-url.png',
                alt_text: 'Gareth and members of his Northcoders final project team'
            })
        })
        it('returns a status code 201 and the updated image object when the client updates the alt_text by image id', async () => {
            const response = await request(app)
            .patch('/api/images/2')
            .send({alt_text: 'new alt text'})
            .expect(201)
            const {image} = response.body
            expect(image).toMatchObject({
                image_id: 2,
                image_url: './Assets/Images/Gallery-images/mont-blanc.jpg',
                alt_text: 'new alt text'
            })
        })
        it('returns a status code 201 and the updated image object when the client updates the alt_text and image_url by image id', async () => {
            const response = await request(app)
            .patch('/api/images/3')
            .send({image_url: 'updated_image_url', alt_text: 'updated alt text'})
            .expect(201)
            const {image} = response.body
            expect(image).toMatchObject({
                image_id: 3,
                image_url: 'updated_image_url',
                alt_text: 'updated alt text'
            })
        })
        it('only updates the image object with valid keys', async () => {
            const response = await request(app)
            .patch('/api/images/3')
            .send({image_url: 'updated_image_url', wrong: 'updated alt text'})
            .expect(201)
            const {image} = response.body
            expect(image).toMatchObject({
                image_id: 3,
                image_url: 'updated_image_url',
                alt_text: 'Gareth making pizza in his self built tradition brick pizza oven'
            })
            expect(image.wrong).toBe(undefined)
        })
        it('returns a status code 404 and the message "image id does not exist!" if the client uses a valid but non existant image id', async () => {
            const response = await request(app)
            .patch('/api/images/200')
            .send({image_url: 'updated_image_url', alt_text: 'updated alt text'})
            .expect(404)
            const {msg} = response.body
            expect(msg).toBe('Not Found, image_id does not exist!')
        })
        it('returns a status code 400 and the message "Bad request, must include both or either image_url and alt_text!" if the client uses a sends a body of length 2 with 2 incorrect keys', async () => {
            const response = await request(app)
            .patch('/api/images/2')
            .send({wrong: 'updated_image_url', dont: 'updated alt text'})
            .expect(400)
            const {msg} = response.body
            expect(msg).toBe('Bad request, must include both or either image_url and alt_text!')
        })
        it('returns a status code 400 and the message "Bad request, must include both or either image_url and alt_text!" if the client uses a sends a body of length 1 with 1 incorrect key', async () => {
            const response = await request(app)
            .patch('/api/images/2')
            .send({wrong: 'updated_image_url'})
            .expect(400)
            const {msg} = response.body
            expect(msg).toBe('Bad request, must include both or either image_url and alt_text!')
        })
        it("returns a status code 404 with the message 'Not Found, image_id does not exist!' if passed a valid but non existant image_id", async () => {
            const response = await request(app)
            .patch("/api/images/200")
            .expect(404)
            const{ body }= response
            const { msg } = body;
            expect(msg).toBe("Not Found, image_id does not exist!");
        });
        it("returns a status code 404 with the message 'Bad Request, invalid data type!' if passed an invalid image_id", async () => {
            const response = await request(app)
            .patch("/api/images/thisIsAstring")
            .expect(404)
            const{ body }= response
            const { msg } = body;
            expect(msg).toBe("Bad Request, invalid data type!");
        });
    })

    describe('DELETE/api/images/:image_id', () => {
        it('returns a status code of 204 if the delete was successful', async () => {
            const response = await request(app)
            .delete('/api/images/2')
            .expect(204)
            const checkResponse = await request(app)
            .get('/api/images/2')
            .expect(404)
            const {msg} = checkResponse.body
            expect(msg).toBe('Not Found, image_id does not exist!')
        })
        it("returns a status code 404 with the message 'Not Found, image_id does not exist!' if passed a valid but non existant image_id", async () => {
            const response = await request(app)
            .delete("/api/images/200")
            .expect(404)
            const{ body }= response
            const { msg } = body;
            expect(msg).toBe("Not Found, image_id does not exist!");
        });
        it("returns a status code 404 with the message 'Bad Request, invalid data type!' if passed an invalid image_id", async () => {
            const response = await request(app)
            .delete("/api/images/thisIsAstring")
            .expect(404)
            const{ body }= response
            const { msg } = body;
            expect(msg).toBe("Bad Request, invalid data type!");
        });
    })
})

describe('skills', () => {
    describe('GET/api/skills', () => {
        it('responds with status code 200 and body with a key of skills', async () => {
            const response = await request(app)
            .get('/api/skills')
            .expect(200)
            const {body} = response
            expect(body.hasOwnProperty('skills')).toBe(true)
        });
    })
})