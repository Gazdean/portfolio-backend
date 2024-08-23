const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection.js");

const { fetchAllImages } = require('../models/images-model.js');
const { fetchAllSkills } = require('../models/skills-model.js');
const { fetchAllGalleryItems } = require('../models/gallery-model.js');
const { fetchAllProjects } = require('../models/projects-model.js');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('IMAGES', () => {
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
        it('responds with status code 200 and the image object to be an object, with 3 properties and correct keys', async () => {
            const response = await request(app)
            .get('/api/images/1')
            .expect(200)
            const {body} = response
            const image = body.image
            const keyArr = Object.keys(image)
            expect(typeof image).toBe('object');
            expect(keyArr.length).toBe(3);
            expect(image.image_id).toBe(1);
            expect(image.image_url).toBe('./Assets/Images/Gallery-images/northcoders.jpg');
            expect(image.alt_text).toBe('Gareth and members of his Northcoders final project team');          
        });  
        it("returns a status code 404 with the message '404 Not Found, image_id does not exist!' if passed a valid but non existant image_id", async () => {
            const response = await request(app)
            .get("/api/images/200")
            .expect(404)
            const{ body }= response
            const { msg } = body;
            expect(msg).toBe("404 Not Found, image_id does not exist!");
        });
        it("returns a status code 404 with the message '400 Bad Request, invalid data type!' if passed an invalid image_id", async () => {
            const response = await request(app)
            .get("/api/images/thisIsAstring")
            .expect(400)
            const{ body }= response
            const { msg } = body;
            expect(msg).toBe("400 Bad Request, invalid data type!");
        });
    })
    // POST an image
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
        it('returns a status code 400 with the message "400 Bad request, both image_url and alt_text are needed!", if the client only sends the image_url data', async () => {
            const response = await request(app)
            .post('/api/images')
            .send({image_url: "./Assets/Images/Project-images/new-image.png"})
            .expect(400)
            const {msg} = response.body
            expect(msg).toBe('400 Bad request, both image_url and alt_text are needed!')
        })
        it('returns a status code 400 with the message "400 Bad request, both image_url and alt_text are needed!", if the client only sends alt_text data', async () => {
            const response = await request(app)
            .post('/api/images')
            .send({alt_text: "This is a new image"})
            .expect(400)
            const {msg} = response.body
            expect(msg).toBe('400 Bad request, both image_url and alt_text are needed!')
        })
        it('returns a status code 400 with the message "400 Bad request, both image_url and alt_text are needed!", if the client sends an empty object', async () => {
            const response = await request(app)
            .post('/api/images')
            .send({})
            .expect(400)
            const {msg} = response.body
            expect(msg).toBe('400 Bad request, both image_url and alt_text are needed!')
        })
        it('returns a status code 201 and the created image object, if the client sends the image_url and alt_text data, any other data is ignored', async () => {
            const response = await request(app)
            .post('/api/images')
            .send({image_url: "./Assets/Images/Project-images/new-image.png", alt_text: "This is a new image again", number: 7})
            .expect(201)
            const {image} = response.body
            expect(typeof image).toBe('object');
            expect(Object.keys(image).length).toBe(3)
            expect(image).toMatchObject({
                image_id: 8,
                image_url: "./Assets/Images/Project-images/new-image.png",
                alt_text: "This is a new image again"
            });
        })
        it('returns a status code 400 with the message "400 Bad request, both image_url and alt_text are needed!", if the client sends data other than the image_url and alt_text data', async () => {
            const response = await request(app)
            .post('/api/images')
            .send({image_url: "./Assets/Images/Project-images/new-image.png", number: 7})
            .expect(400)
            const {msg} = response.body
            expect(msg).toBe('400 Bad request, both image_url and alt_text are needed!')
        })
    })
    // UPDATE an image
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
        it('returns a status code 404 and the message "404 Not Found, image_id does not exist!" if the client uses a valid but non existant image id', async () => {
            const response = await request(app)
            .patch('/api/images/200')
            .send({image_url: 'updated_image_url', alt_text: 'updated alt text'})
            .expect(404)
            const {msg} = response.body
            expect(msg).toBe('404 Not Found, image_id does not exist!')
        })
        it('returns a status code 400 and the message "400 Bad request, must include both or either image_url and alt_text!" if the client uses a sends a body of length 2 with 2 incorrect keys', async () => {
            const response = await request(app)
            .patch('/api/images/2')
            .send({wrong: 'updated_image_url', dont: 'updated alt text'})
            .expect(400)
            const {msg} = response.body
            expect(msg).toBe('400 Bad request, must include both or either image_url and alt_text!')
        })
        it('returns a status code 400 and the message "400 Bad request, must include both or either image_url and alt_text!" if the client uses a sends a body of length 1 with 1 incorrect key', async () => {
            const response = await request(app)
            .patch('/api/images/2')
            .send({wrong: 'updated_image_url'})
            .expect(400)
            const {msg} = response.body
            expect(msg).toBe('400 Bad request, must include both or either image_url and alt_text!')
        })
        it("returns a status code 404 with the message '404 Not Found, image_id does not exist!' if passed a valid but non existant image_id", async () => {
            const response = await request(app)
            .patch("/api/images/200")
            .expect(404)
            const{ body }= response
            const { msg } = body;
            expect(msg).toBe("404 Not Found, image_id does not exist!");
        });
        it("returns a status code 400 with the message '400 Bad Request, invalid data type!' if passed an invalid image_id", async () => {
            const response = await request(app)
            .patch("/api/images/thisIsAstring")
            .expect(400)
            const{ body }= response
            const { msg } = body;
            expect(msg).toBe("400 Bad Request, invalid data type!");
        });
    })
    // DELETE an image by image_id
    describe('DELETE/api/images/:image_id', () => {
        it('returns a status code of 204 if the delete was successful', async () => {
            const response = await request(app)
            .delete('/api/images/2')
            .expect(204)
            const checkResponse = await request(app)
            .get('/api/images/2')
            .expect(404)
            const {msg} = checkResponse.body
            expect(msg).toBe('404 Not Found, image_id does not exist!')
        })
        it("returns a status code 404 with the message '404 Not Found, image_id does not exist!' if passed a valid but non existant image_id", async () => {
            const response = await request(app)
            .delete("/api/images/200")
            .expect(404)
            const{ body }= response
            const { msg } = body;
            expect(msg).toBe("404 Not Found, image_id does not exist!");
        });
        it("returns a status code 400 with the message '400 Bad Request, invalid data type!' if passed an invalid image_id", async () => {
            const response = await request(app)
            .delete("/api/images/thisIsAstring")
            .expect(400)
            const{ body }= response
            const { msg } = body;
            expect(msg).toBe("400 Bad Request, invalid data type!");
        });
        it('sets any skills image_id that has the deleted image_id as a foreign key to null', async () => {
            const response = await request(app)
            .delete('/api/images/7')
            .expect(204)
            const checkImageDeleted= await request(app)
            .get('/api/images/7')
            .expect(404)
            const {msg} = checkImageDeleted.body
            expect(msg).toBe('404 Not Found, image_id does not exist!')
            const checkSkillImageId = await request(app)
            .get('/api/skills/4')
            .expect(200)
            const {skill} = checkSkillImageId.body
            expect(skill.image_id).toBe(null);
        })
    })
})

describe('SKILLS', () => {
    describe('GET/api/skills', () => {
        it('responds with status code 200 and body with a key of skills', async () => {
            const response = await request(app)
            .get('/api/skills')
            .expect(200)
            const {body} = response
            expect(body.hasOwnProperty('skills')).toBe(true)
        });
        it('responds with status code 200 and skills array of length 10', async () => {
            const response = await request(app)
            .get('/api/skills')
            .expect(200)
            const {body} = response
            const {skills} = body
            expect(Array.isArray(skills)).toBe(true);
            expect(skills.length).toBe(10);
        });
        it('responds with status code 200 and the skills array elements to be objects', async () => {
            const response = await request(app)
            .get('/api/skills')
            .expect(200)
            const {body} = response
            const {skills} = body
            skills.forEach(skill => {
                const skillKeys = Object.keys(skill)
                expect(typeof skill).toBe('object');
                expect(skillKeys.length).toBe(6);
                expect(typeof skill.skill_id).toBe('number')
                expect(skill.skill_id).not.toBe(undefined)
                expect(typeof skill.title).toBe('string')
                expect(skill.title).not.toBe(undefined)
                skill.icon_background_color && expect(typeof skill.icon_background_color).toBe('string')
                skill.icon_color && expect(typeof skill.icon_color).toBe('string')
                skill.icon_class && expect(typeof skill.icon_class).toBe('string')
                skill.image_id && expect(typeof skill.image_id).toBe('number')
                
            }) 
        });
        it('should respond with status code 200 and the message "no skills are available" if there are no skill objects availabe', async () => {
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] });
            await expect(fetchAllSkills()).rejects.toEqual({
                status: 200,
                msg: 'No skills available'
            });
            db.query.mockRestore();
        }); 
    })

    describe('GET/api/skills/:skill_id', () => {
        it('responds with status code 200 and body with a key of skill', async () => {
            const response = await request(app)
            .get('/api/skills/1')
            .expect(200)
            const {body} = response
            expect(body.hasOwnProperty('skill')).toBe(true)
        });
        it('responds with status code 200 and the skill object to be an object, with at least 2 keys title and skill_id', async () => {
            const response = await request(app)
            .get('/api/skills/2')
            .expect(200)
            const {body} = response
            const skill = body.skill
            const keyArr = Object.keys(skill)
            expect(typeof skill).toBe('object');
            expect(keyArr.length).toBe(6);
            expect(skill.skill_id).toBe(2);
            expect(skill.title).toBe('CSS 3');
            expect(skill.icon_class).toBe('fa-brands fa-css3');          
            expect(skill.icon_background_color).toBe('blue');       
            expect(skill.icon_color).toBe(null);       
            expect(skill.image_id).toBe(null);       
        });  
        it("returns a status code 404 with the message '404 Not Found, skill_id does not exist!' if passed a valid but non existant skill_id", async () => {
            const response = await request(app)
            .get("/api/skills/200")
            .expect(404)
            const{ body }= response
            const { msg } = body;
            expect(msg).toBe("404 Not Found, skill_id does not exist!");
        });
        it("returns a status code 404 with the message '400 Bad Request, invalid data type!' if passed an invalid skill_id", async () => {
            const response = await request(app)
            .get("/api/skills/thisIsAstring")
            .expect(400)
            const{ body }= response
            const { msg } = body;
            expect(msg).toBe("400 Bad Request, invalid data type!");
        });
    })

    describe('POST/api/skills', () => {
        it('returns a status code 201, and the created skill object if successful when sent all of the data fields', async () => {
            const response = await request(app)
            .post('/api/skills')
            .send({
                title: "My new skill", 
                icon_class: 'New icon',
                image_id: 4,
                icon_background_color:"black",
                icon_color: 'blue' 
            })
            .expect(201)
            const {skill} = response.body
            expect(typeof skill).toBe('object');
            expect(Object.keys(skill).length).toBe(6)
            expect(skill).toMatchObject({
                skill_id: 11,
                title: "My new skill",
                icon_class: "New icon",
                image_id: 4,
                icon_background_color:"black",
                icon_color: 'blue'
            });
        })
        it('returns a status code 201, and the created skill object if successful when sent some of the data fields', async () => {
            const response = await request(app)
            .post('/api/skills')
            .send({
                title: "My new skill", 
                icon_class: 'New icon',
                image_id: 4,
 
            })
            .expect(201)
            const {skill} = response.body
            expect(typeof skill).toBe('object');
            expect(Object.keys(skill).length).toBe(6)
            expect(skill).toMatchObject({
                skill_id: 11,
                title: "My new skill",
                icon_class: "New icon",
                image_id: 4,
                icon_background_color: null,
                icon_color: null
            });
        })
        it('returns a status code 201, and the created skill object if successful when sent just the title', async () => {
            const response = await request(app)
            .post('/api/skills')
            .send({
                title: "My new skill"
            })
            .expect(201)
            const {skill} = response.body
            expect(typeof skill).toBe('object');
            expect(Object.keys(skill).length).toBe(6)
            expect(skill).toMatchObject({
                skill_id: 11,
                title: "My new skill",
                icon_class: null,
                image_id: null,
                icon_background_color: null,
                icon_color: null
            });
        })
        it('returns a status code 201, with the created object if sent a title and any incorrect data is ignored', async () => {
            const response = await request(app)
            .post('/api/skills')
            .send({
                title: 'Ignore other data',
                wrong_data: 3000
            })
            .expect(201)
            .expect(201)
            const {skill} = response.body
            const skillKeys = Object.keys(skill)
            expect(typeof skill).toBe('object');
            expect(skillKeys.length).toBe(6)
            expect(skillKeys.includes('wrong_data')).toBe(false)
            expect(skill).toMatchObject({
                skill_id: 11,
                title: "Ignore other data",
                icon_class: null,
                image_id: null,
                icon_background_color: null,
                icon_color: null
            });
        })
        it('returns a status code 400 with the message "400 Bad request, a title is required!", if the client doesnt send title', async () => {
            const response = await request(app)
            .post('/api/skills')
            .send({
                icon_class: 'New icon',
                image_id: 4,
            })
            .expect(400)
            const {msg} = response.body
            expect(msg).toBe('400 Bad request, a title is required!')
        })
        it('returns a status code 400 with the message "400 Bad request, a title is required!", if the client sends an empty object', async () => {
            const response = await request(app)
            .post('/api/skills')
            .send({})
            .expect(400)
            const {msg} = response.body
            expect(msg).toBe('400 Bad request, a title is required!')
        })
        it('returns a status code 400, with the message "400 Bad request, a title is required!" if sent no title but only incorrect data', async () => {
            const response = await request(app)
            .post('/api/skills')
            .send({alt_text: "This is a new image"})
            .expect(400)
            const {msg} = response.body
            expect(msg).toBe('400 Bad request, a title is required!')
        })
    })

    describe('PATCH/api/skills/:skill_id', () => {   
        it('returns a status code 201 and the updated skill object when the client updates the all allowed data by skill id', async () => {
            const response = await request(app)
            .patch('/api/skills/1')
            .send({
                title: "My updated title", 
                icon_class: 'Updated icon',
                image_id: 2,
                icon_background_color:"red",
                icon_color: 'white' 
            })
            .expect(201)
            const {skill} = response.body
            expect(typeof skill).toBe('object');
            expect(Object.keys(skill).length).toBe(6)
            expect(skill).toMatchObject({
                skill_id: 1,
                title: "My updated title",
                icon_class: "Updated icon",
                image_id: 2, 
                icon_background_color:"red",
                icon_color: 'white'
            });
        })
        it('returns a status code 201 and the updated skill object when the client updates the some of the data by image id', async () => {
            const response = await request(app)
            .patch('/api/skills/2')
            .send({
                title: "My updated title", 
                icon_class: 'Updated icon',
                image_id: 2 
            })
            .expect(201)
            const {skill} = response.body
            expect(skill).toMatchObject({
                skill_id: 2,
                title: "My updated title",
                icon_class: "Updated icon",
                image_id: 2, 
                icon_background_color:"blue",
                icon_color: null            
            })
        })
        it('returns status code 201 and the updated object but only updates the image object with valid keys, it ignores invalid data', async () => {
            const response = await request(app)
            .patch('/api/skills/1')
            .send({
                title: "My updated title", 
                icon: 'Updated icon',
                image_id: 2,
                color:"red",
                icon_color: 'white' 
            })
            .expect(201)
            const {skill} = response.body
            expect(skill).toMatchObject({
                skill_id: 1,
                icon_class: "fa-brands fa-html5",
                icon_background_color:"#e34c26",
                title: "My updated title", 
                image_id: 2,
                icon_color: 'white'            
            })
        })
        it('returns status code 400 and the message "400 Bad Request, title cannot be an empty string!" if the client sends the title as an empty string', async () => {
            const response = await request(app)
            .patch('/api/skills/3')
            .send({
                title: '', 
                image_id: 3,
                icon_color: 'blue'
            })
            .expect(400)
            const {msg} = response.body
            expect(msg).toBe("400 Bad Request, title cannot be an empty string!")
        })
        it('returns status code 400 and the the message "400 Bad Request, title cannot be an empty string!" if just an empty title is sent', async () => {
            const response = await request(app)
            .patch('/api/skills/3')
            .send({
                title: '', 
            })
            .expect(400)
            const {msg} = response.body
            expect(msg).toBe("400 Bad Request, title cannot be an empty string!")
        })
        it("returns a status code 404 with the message '400 Bad Request, invalid data type!' if passed an invalid image_id", async () => {
            const response = await request(app)
            .patch('/api/skills/2')
            .send({image_id: 'wrong data type'})
            .expect(400)
            const{ body }= response
            const { msg } = body;
            expect(msg).toBe("400 Bad Request, invalid data type!");
        });
        it('returns a status code 400 and the message "400 Bad Request, no data sent!" if the client uses a sends a body with no keys', async () => {
            const response = await request(app)
            .patch('/api/skills/2')
            .send({})
            .expect(400)
            const {msg} = response.body
            expect(msg).toBe("400 Bad Request, no data sent!")
        })
    })
    describe('DELETE/api/skills/:skill_id', () => {
        it('returns a status code of 204 if the delete was successful', async () => {
            //delete skill
            const response = await request(app)
            .delete('/api/skills/2')
            .expect(204)
            // check skill has been deleted
            const checkResponse = await request(app)
            .get('/api/skills/2')
            .expect(404)
            const {msg} = checkResponse.body
            expect(msg).toBe('404 Not Found, skill_id does not exist!')
        })
        it("returns a status code 404 with the message '404 Not Found, skill_id does not exist!' if passed a valid but non existant skill_id", async () => {
            const response = await request(app)
            .delete("/api/skills/200")
            .expect(404)
            const{ body }= response
            const { msg } = body;
            expect(msg).toBe("404 Not Found, skill_id does not exist!");
        });
        it("returns a status code 400 with the message '400 Bad Request, invalid data type!' if passed an invalid skill_id", async () => {
            const response = await request(app)
            .delete("/api/skills/thisIsAstring")
            .expect(400)
            const{ body }= response
            const { msg } = body;
            expect(msg).toBe("400 Bad Request, invalid data type!");
        });
    })
})

describe('GALLERY', () => {
    describe('GET/api/gallery', () => {
        it('responds with status code 200 and body with a key of gallery', async () => {
            const response = await request(app)
            .get('/api/gallery')
            .expect(200)
            const {body} = response
            expect(body.hasOwnProperty('gallery')).toBe(true)
        });
        it('responds with status code 200 and gallery array of length 3', async () => {
            const response = await request(app)
            .get('/api/gallery')
            .expect(200)
            const {body} = response
            const {gallery} = body
            expect(Array.isArray(gallery)).toBe(true);
            expect(gallery.length).toBe(3);
        });
        it('responds with status code 200 and the gallery array elements to be objects', async () => {
            const response = await request(app)
            .get('/api/gallery')
            .expect(200)
            const {body} = response
            const {gallery} = body
            gallery.forEach(galleryItem => {
                const galleryItemKeys = Object.keys(galleryItem)
                expect(typeof galleryItem).toBe('object');
                expect(galleryItemKeys.length).toBe(5);
                expect(typeof galleryItem.gallery_item_id).toBe('number')
                expect(galleryItem.gallery_item_id).not.toBe(undefined)
                expect(typeof galleryItem.title).toBe('string')
                expect(galleryItem.title).not.toBe(undefined)
                galleryItem.description && expect(typeof galleryItem.description).toBe('string')
                expect(typeof galleryItem.show).toBe('boolean')
                expect(galleryItem.show).toBe(true)
                
            }) 
        });
        it('should respond with status code 200 and the message "Gallery is empty" if there are no gallery objects available', async () => {
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] });
            await expect(fetchAllGalleryItems()).rejects.toEqual({
                status: 200,
                msg: 'Gallery is empty!'
            });
            db.query.mockRestore();
        }); 

         // TODO get gallery by show = true
    })

    describe('GET/api/gallery/:gallery_item_id', () => {
        it('responds with status code 200 and body with a key of galleryItem', async () => {
            const response = await request(app)
            .get('/api/gallery/1')
            .expect(200)
            const {body} = response
            expect(body.hasOwnProperty('galleryItem')).toBe(true)
        });
        it('responds with status code 200 and the galleryItem array object to be an object', async () => {
            const response = await request(app)
            .get('/api/gallery/2')
            .expect(200)
            const {body} = response
            const galleryItem = body.galleryItem
            const keyArr = Object.keys(galleryItem)
            expect(typeof galleryItem).toBe('object');
            expect(keyArr.length).toBe(5);
            expect(galleryItem.gallery_item_id).toBe(2);
            expect(galleryItem.title).toBe("At the summit of Mount Blanc");
            expect(galleryItem.description).toBe("At the top of Mount Blanc, after a two day climb with stop offs at the Tête Rousse Hut 3167m, and Goutier hut at 3835m",);          
            expect(galleryItem.show).toBe(true);       
            expect(galleryItem.image_id).toBe(2);             
        });  
        it('responds with status code 200 and the galleryItem array object with description set to null if description is missing from test data', async () => {
            const response = await request(app)
            .get('/api/gallery/3')
            .expect(200)
            const {body} = response
            const galleryItem = body.galleryItem
            expect(galleryItem.description).toBe(null);                      
        });
        it("returns a status code 404 with the message '404 Not Found, gallery_item_id does not exist!' if passed a valid but non existant gallery_item_id", async () => {
            const response = await request(app)
            .get("/api/gallery/200")
            .expect(404)
            const{ body }= response
            const { msg } = body;
            expect(msg).toBe("404 Not Found, gallery_item_id does not exist!");
        });
        it("returns a status code 404 with the message '400 Bad Request, invalid data type!' if passed an invalid gallery_item_id", async () => {
            const response = await request(app)
            .get("/api/gallery/thisIsAstring")
            .expect(400)
            const{ body }= response
            const { msg } = body;
            expect(msg).toBe("400 Bad Request, invalid data type!");
        });
    })

    describe('POST/api/gallery', () => {
        it('returns a status code 201, and the created gallery object if successful when sent all of the data fields', async () => {
            const response = await request(app)
            .post('/api/gallery')
            .send({
                title: "My new gallery item", 
                description: 'New description',
                image_id: 3
            })
            .expect(201)
            const {galleryItem} = response.body
            expect(typeof galleryItem).toBe('object');
            expect(Object.keys(galleryItem).length).toBe(5)
            expect(galleryItem).toMatchObject({
                gallery_item_id: 4,
                title: "My new gallery item",
                description: 'New description',
                image_id: 3,
                show: true
            });
        })
        it('returns a status code 201, and the created skill object if successful when sent some of the data fields', async () => {
            const response = await request(app)
            .post('/api/gallery')
            .send({
                title: "My new gallery item", 
                image_id: 3,
            })
            .expect(201)
            const {galleryItem} = response.body
            expect(typeof galleryItem).toBe('object');
            expect(Object.keys(galleryItem).length).toBe(5)
            expect(galleryItem).toMatchObject({
                gallery_item_id: 4,
                title: "My new gallery item",
                description: null,
                image_id: 3,
                show: true
            });
        })
        it('returns a status code 201, with the created object if sent a title and image_id, any incorrect data is ignored', async () => {
            const response = await request(app)
            .post('/api/gallery')
            .send({
                title: "My new gallery item", 
                image_id: 3,
                boolean: true
            })
            .expect(201)
            const {galleryItem} = response.body
            expect(typeof galleryItem).toBe('object');
            expect(Object.keys(galleryItem).length).toBe(5)
            expect(galleryItem).toMatchObject({
                gallery_item_id: 4,
                title: "My new gallery item",
                description: null,
                image_id: 3,
                show: true
            });
            expect(galleryItem).not.toHaveProperty('boolean')
        })
        it('returns a status code 400 with the message "400 Bad request, both a title and image_id are required!", if the client doesnt send an image_id', async () => {
            const response = await request(app)
            .post('/api/gallery')
            .send({
                title: "My new gallery item"
            })
            .expect(400)
            const {msg} = response.body
            expect(msg).toBe('400 Bad request, both a title and image_id are required!')
        })
        it('returns a status code 400 with the message "400 Bad request, both a title and image_id are required!", if the client doesnt send a title', async () => {
            const response = await request(app)
            .post('/api/gallery')
            .send({
                image_id: 4
            })
            .expect(400)
            const {msg} = response.body
            expect(msg).toBe('400 Bad request, both a title and image_id are required!')
        })
        it('returns a status code 400 with the message "400 Bad request, both a title and image_id are required!", if the client sends an empty object', async () => {
            const response = await request(app)
            .post('/api/gallery')
            .send({})
            .expect(400)
            const {msg} = response.body
            expect(msg).toBe('400 Bad request, both a title and image_id are required!')
        })
        it('returns a status code 400, with the message "400 Bad request, both a title and image_id are required!" if sent no title or image_id but only incorrect data', async () => {
            const response = await request(app)
            .post('/api/gallery')
            .send({alt_text: "This is a new image"})
            .expect(400)
            const {msg} = response.body
            expect(msg).toBe("400 Bad request, both a title and image_id are required!")
        })
    })

    describe('PATCH/api/skills/:skill_id', () => {   
        it('returns a status code 201 and the updated image object when the client updates the all allowed data by gallery_item_id', async () => {
            const response = await request(app)
            .patch('/api/gallery/1')
            .send({
                title: "My new gallery item",
                description: 'New description',
                show: false   
            })
            .expect(201)
            const {galleryItem} = response.body
            expect(typeof galleryItem).toBe('object');
            expect(Object.keys(galleryItem).length).toBe(5)
            expect(galleryItem).toMatchObject({
                gallery_item_id: 1,
                title: "My new gallery item",
                description: 'New description',
                image_id: 1,
                show: false
                
            });
        })
        it('returns a status code 201 and the updated skill object when the client updates the description and show by gallery_item_id', async () => {
            const response = await request(app)
            .patch('/api/gallery/1')
            .send({
                description: 'New description',
                show: false   
            })
            .expect(201)
            const {galleryItem} = response.body
            expect(typeof galleryItem).toBe('object');
            expect(Object.keys(galleryItem).length).toBe(5)
            expect(galleryItem).toMatchObject({
                gallery_item_id: 1,
                title: "Final day at Northcoders, project group",
                description: 'New description',
                image_id: 1,
                show: false
            });
        })
        it('returns a status code 201 and the updated skill object when the client updates the description and title by gallery_item_id', async () => {
            const response = await request(app)
            .patch('/api/gallery/1')
            .send({
                description: 'New description',
                title: "hey"  
            })
            .expect(201)
            const {galleryItem} = response.body
            expect(typeof galleryItem).toBe('object');
            expect(Object.keys(galleryItem).length).toBe(5)
            expect(galleryItem).toMatchObject({
                gallery_item_id: 1,
                title: "hey",
                description: 'New description',
                image_id: 1,
                show: true
            });
        })
        it('returns a status code 201 and the updated skill object when the client updates the show and title by gallery_item_id', async () => {
            const response = await request(app)
            .patch('/api/gallery/1')
            .send({
                show: false,
                title: "hey"  
            })
            .expect(201)
            const {galleryItem} = response.body
            expect(typeof galleryItem).toBe('object');
            expect(Object.keys(galleryItem).length).toBe(5)
            expect(galleryItem).toMatchObject({
                gallery_item_id: 1,
                title: "hey",
                description: "My final project group, at the Northcoders offices in manchester just before our  presentations",
                image_id: 1,
                show: false
            });
        })
        it('returns a status code 201 and the updated skill object when the client updates just show by gallery_item_id', async () => {
            const response = await request(app)
            .patch('/api/gallery/2')
            .send({
                show: false,
            })
            .expect(201)
            const {galleryItem} = response.body
            expect(typeof galleryItem).toBe('object');
            expect(Object.keys(galleryItem).length).toBe(5)
            expect(galleryItem).toMatchObject({
                gallery_item_id: 2,
                title: "At the summit of Mount Blanc",
                description: "At the top of Mount Blanc, after a two day climb with stop offs at the Tête Rousse Hut 3167m, and Goutier hut at 3835m",
                image_id: 2,
                show: false
            });
        })
        it('returns a status code 201 and the updated skill object when the client updates just description by gallery_item_id', async () => {
            const response = await request(app)
            .patch('/api/gallery/2')
            .send({
                description: 'this'
            })
            .expect(201)
            const {galleryItem} = response.body
            expect(typeof galleryItem).toBe('object');
            expect(Object.keys(galleryItem).length).toBe(5)
            expect(galleryItem).toMatchObject({
                gallery_item_id: 2,
                title: "At the summit of Mount Blanc",
                description: "this",
                image_id: 2,
                show: true
            });
        })
        it('returns a status code 201 and the updated skill object when the client updates just title by gallery_item_id', async () => {
            const response = await request(app)
            .patch('/api/gallery/2')
            .send({
                title: 'hello'
            })
            .expect(201)
            const {galleryItem} = response.body
            expect(typeof galleryItem).toBe('object');
            expect(Object.keys(galleryItem).length).toBe(5)
            expect(galleryItem).toMatchObject({
                gallery_item_id: 2,
                title: "hello",
                description: "At the top of Mount Blanc, after a two day climb with stop offs at the Tête Rousse Hut 3167m, and Goutier hut at 3835m",
                image_id: 2,
                show: true
            });
        })
        it('returns status code 201 and the updated object but only updates the image object with valid keys, it ignores invalid data', async () => {
            const response = await request(app)
            .patch('/api/gallery/1')
            .send({
                title: "My new gallery item",
                description: 'New description',
                show: false,
                wrongKey: true
            })
            .expect(201)
            const {galleryItem} = response.body
            expect(typeof galleryItem).toBe('object');
            expect(Object.keys(galleryItem).length).toBe(5)
            expect(galleryItem).not.toHaveProperty('wrongKey')
            expect(galleryItem).toMatchObject({
                gallery_item_id: 1,
                title: "My new gallery item",
                description: 'New description',
                image_id: 1,
                show: false  
            });
        })
        it('returns status code 400 and the the message "400 Bad Request, title cannot be an empty string!" if the client sends the title as an empty string', async () => {
            const response = await request(app)
            .patch('/api/gallery/2')
            .send({
                title: ''
            })
            .expect(400)
            const {msg} = response.body
            expect(msg).toBe("400 Bad Request, title cannot be an empty string!")
        })
        it("returns a status code 400 with the message '400 Bad Request, invalid data type!' if passed an invalid gallery_item_id", async () => {
            const response = await request(app)
            .patch('/api/gallery/wrongdata')
            .send({title: 'new title'})
            .expect(400)
            const{ body }= response
            const { msg } = body;
            expect(msg).toBe("400 Bad Request, invalid data type!");
        });
        it("returns a status code 404 with the message '404 Not Found, gallery_item_id does not exist!' if passed an invalid gallery_item_id", async () => {
            const response = await request(app)
            .patch('/api/gallery/400')
            .send({title: 'wrong data type'})
            .expect(404)
            const{ body }= response
            const { msg } = body;
            expect(msg).toBe("404 Not Found, gallery_item_id does not exist!");
        });
        it('returns a status code 400 and the message "400 Bad Request, no data sent!" if the client uses a sends a body with no keys', async () => {
            const response = await request(app)
            .patch('/api/gallery/2')
            .send({})
            .expect(400)
            const {msg} = response.body
            expect(msg).toBe("400 Bad Request, no data sent!")
        })
        it('returns a status code 400 and the message "400 Bad Request, invalid data type!" if the client uses a sends a show as not a boolean', async () => {
            const response = await request(app)
            .patch('/api/gallery/2')
            .send({show: 2})
            .expect(400)
            const {msg} = response.body
            expect(msg).toBe("400 Bad Request, invalid data type!")
        })
    })

    describe('DELETE/api/skills/:skill_id', () => {
        it('returns a status code of 204 if the delete was successful', async () => {
            //delete gallery item
            const response = await request(app)
            .delete('/api/gallery/2')
            .expect(204)
            // check gallery item has been deleted
            const checkResponse = await request(app)
            .get('/api/gallery/2')
            .expect(404)
            const {msg} = checkResponse.body
            expect(msg).toBe('404 Not Found, gallery_item_id does not exist!')
        })
        it("returns a status code 404 with the message '404 Not Found, gallery_item_id does not exist!' if passed a valid but non existant gallery_item_id", async () => {
            const response = await request(app)
            .delete("/api/gallery/200")
            .expect(404)
            const{ body }= response
            const { msg } = body;
            expect(msg).toBe("404 Not Found, gallery_item_id does not exist!");
        });
        it("returns a status code 400 with the message '400 Bad Request, invalid data type!' if passed an invalid gallery_item_id", async () => {
            const response = await request(app)
            .delete("/api/gallery/thisIsAstring")
            .expect(400)
            const{ body }= response
            const { msg } = body;
            expect(msg).toBe("400 Bad Request, invalid data type!");
        });
    })
})

describe('PROJECTS', () => {
    describe('GET/api/projects', () => {
        it('responds with status code 200 and body with a key of projects', async () => {
            const response = await request(app)
            .get('/api/projects')
            .expect(200)
            const {body} = response
            expect(body.hasOwnProperty('projects')).toBe(true)
        });
        it('responds with status code 200 and projects array of length 3', async () => {
            const response = await request(app)
            .get('/api/projects')
            .expect(200)
            const {body} = response
            const {projects} = body
            expect(Array.isArray(projects)).toBe(true);
            expect(projects.length).toBe(3);
        });
        it('responds with status code 200 and the project array elements to be objects and correct data types', async () => {
            const response = await request(app)
            .get('/api/projects')
            .expect(200)
            const {body} = response
            const {projects} = body
            projects.forEach(project => {
                console.log(project)
                const projectKeys = Object.keys(project)
                expect(typeof project).toBe('object');
                expect(projectKeys.length).toBe(7);
                expect(typeof project.project_id).toBe('number')
                expect(project.project_id).not.toBe(undefined)
                expect(typeof project.title).toBe('string')
                expect(project.title).not.toBe(undefined)
                project.description && expect(typeof project.description).toBe('string')
                expect(typeof project.show).toBe('boolean')
                expect(project.show).toBe(true)
                expect(project.position).toBe(null)
                
            }) 
        });
        it('should respond with status code 200 and the message "There are no projects!" if there are no project objects available', async () => {
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] });
            await expect(fetchAllProjects()).rejects.toEqual({
                status: 200,
                msg: 'There are no projects!'
            });
            db.query.mockRestore();
        }); 

        // TODO get projects by show = true
    })

    describe('GET/api/gallery/:project_id', () => {
        it('responds with status code 200 and body with a key of galleryItem', async () => {
            const response = await request(app)
            .get('/api/gallery/1')
            .expect(200)
            const {body} = response
            expect(body.hasOwnProperty('galleryItem')).toBe(true)
        });
        // it('responds with status code 200 and the galleryItem array object to be an object', async () => {
        //     const response = await request(app)
        //     .get('/api/gallery/2')
        //     .expect(200)
        //     const {body} = response
        //     const galleryItem = body.galleryItem
        //     const keyArr = Object.keys(galleryItem)
        //     expect(typeof galleryItem).toBe('object');
        //     expect(keyArr.length).toBe(5);
        //     expect(galleryItem.gallery_item_id).toBe(2);
        //     expect(galleryItem.title).toBe("At the summit of Mount Blanc");
        //     expect(galleryItem.description).toBe("At the top of Mount Blanc, after a two day climb with stop offs at the Tête Rousse Hut 3167m, and Goutier hut at 3835m",);          
        //     expect(galleryItem.show).toBe(true);       
        //     expect(galleryItem.image_id).toBe(2);             
        // });  
        // it('responds with status code 200 and the galleryItem array object with description set to null if description is missing from test data', async () => {
        //     const response = await request(app)
        //     .get('/api/gallery/3')
        //     .expect(200)
        //     const {body} = response
        //     const galleryItem = body.galleryItem
        //     expect(galleryItem.description).toBe(null);                      
        // });
        // it("returns a status code 404 with the message '404 Not Found, gallery_item_id does not exist!' if passed a valid but non existant gallery_item_id", async () => {
        //     const response = await request(app)
        //     .get("/api/gallery/200")
        //     .expect(404)
        //     const{ body }= response
        //     const { msg } = body;
        //     expect(msg).toBe("404 Not Found, gallery_item_id does not exist!");
        // });
        // it("returns a status code 404 with the message '400 Bad Request, invalid data type!' if passed an invalid gallery_item_id", async () => {
        //     const response = await request(app)
        //     .get("/api/gallery/thisIsAstring")
        //     .expect(400)
        //     const{ body }= response
        //     const { msg } = body;
        //     expect(msg).toBe("400 Bad Request, invalid data type!");
        // });
    })

//     describe('POST/api/gallery', () => {
//         it('returns a status code 201, and the created gallery object if successful when sent all of the data fields', async () => {
//             const response = await request(app)
//             .post('/api/gallery')
//             .send({
//                 title: "My new gallery item", 
//                 description: 'New description',
//                 image_id: 3
//             })
//             .expect(201)
//             const {galleryItem} = response.body
//             expect(typeof galleryItem).toBe('object');
//             expect(Object.keys(galleryItem).length).toBe(5)
//             expect(galleryItem).toMatchObject({
//                 gallery_item_id: 4,
//                 title: "My new gallery item",
//                 description: 'New description',
//                 image_id: 3,
//                 show: true
//             });
//         })
//         it('returns a status code 201, and the created skill object if successful when sent some of the data fields', async () => {
//             const response = await request(app)
//             .post('/api/gallery')
//             .send({
//                 title: "My new gallery item", 
//                 image_id: 3,
//             })
//             .expect(201)
//             const {galleryItem} = response.body
//             expect(typeof galleryItem).toBe('object');
//             expect(Object.keys(galleryItem).length).toBe(5)
//             expect(galleryItem).toMatchObject({
//                 gallery_item_id: 4,
//                 title: "My new gallery item",
//                 description: null,
//                 image_id: 3,
//                 show: true
//             });
//         })
//         it('returns a status code 201, with the created object if sent a title and image_id, any incorrect data is ignored', async () => {
//             const response = await request(app)
//             .post('/api/gallery')
//             .send({
//                 title: "My new gallery item", 
//                 image_id: 3,
//                 boolean: true
//             })
//             .expect(201)
//             const {galleryItem} = response.body
//             expect(typeof galleryItem).toBe('object');
//             expect(Object.keys(galleryItem).length).toBe(5)
//             expect(galleryItem).toMatchObject({
//                 gallery_item_id: 4,
//                 title: "My new gallery item",
//                 description: null,
//                 image_id: 3,
//                 show: true
//             });
//             expect(galleryItem).not.toHaveProperty('boolean')
//         })
//         it('returns a status code 400 with the message "400 Bad request, both a title and image_id are required!", if the client doesnt send an image_id', async () => {
//             const response = await request(app)
//             .post('/api/gallery')
//             .send({
//                 title: "My new gallery item"
//             })
//             .expect(400)
//             const {msg} = response.body
//             expect(msg).toBe('400 Bad request, both a title and image_id are required!')
//         })
//         it('returns a status code 400 with the message "400 Bad request, both a title and image_id are required!", if the client doesnt send a title', async () => {
//             const response = await request(app)
//             .post('/api/gallery')
//             .send({
//                 image_id: 4
//             })
//             .expect(400)
//             const {msg} = response.body
//             expect(msg).toBe('400 Bad request, both a title and image_id are required!')
//         })
//         it('returns a status code 400 with the message "400 Bad request, both a title and image_id are required!", if the client sends an empty object', async () => {
//             const response = await request(app)
//             .post('/api/gallery')
//             .send({})
//             .expect(400)
//             const {msg} = response.body
//             expect(msg).toBe('400 Bad request, both a title and image_id are required!')
//         })
//         it('returns a status code 400, with the message "400 Bad request, both a title and image_id are required!" if sent no title or image_id but only incorrect data', async () => {
//             const response = await request(app)
//             .post('/api/gallery')
//             .send({alt_text: "This is a new image"})
//             .expect(400)
//             const {msg} = response.body
//             expect(msg).toBe("400 Bad request, both a title and image_id are required!")
//         })
//     })

//     describe('PATCH/api/skills/:skill_id', () => {   
//         it('returns a status code 201 and the updated image object when the client updates the all allowed data by gallery_item_id', async () => {
//             const response = await request(app)
//             .patch('/api/gallery/1')
//             .send({
//                 title: "My new gallery item",
//                 description: 'New description',
//                 show: false   
//             })
//             .expect(201)
//             const {galleryItem} = response.body
//             expect(typeof galleryItem).toBe('object');
//             expect(Object.keys(galleryItem).length).toBe(5)
//             expect(galleryItem).toMatchObject({
//                 gallery_item_id: 1,
//                 title: "My new gallery item",
//                 description: 'New description',
//                 image_id: 1,
//                 show: false
                
//             });
//         })
//         it('returns a status code 201 and the updated skill object when the client updates the description and show by gallery_item_id', async () => {
//             const response = await request(app)
//             .patch('/api/gallery/1')
//             .send({
//                 description: 'New description',
//                 show: false   
//             })
//             .expect(201)
//             const {galleryItem} = response.body
//             expect(typeof galleryItem).toBe('object');
//             expect(Object.keys(galleryItem).length).toBe(5)
//             expect(galleryItem).toMatchObject({
//                 gallery_item_id: 1,
//                 title: "Final day at Northcoders, project group",
//                 description: 'New description',
//                 image_id: 1,
//                 show: false
//             });
//         })
//         it('returns a status code 201 and the updated skill object when the client updates the description and title by gallery_item_id', async () => {
//             const response = await request(app)
//             .patch('/api/gallery/1')
//             .send({
//                 description: 'New description',
//                 title: "hey"  
//             })
//             .expect(201)
//             const {galleryItem} = response.body
//             expect(typeof galleryItem).toBe('object');
//             expect(Object.keys(galleryItem).length).toBe(5)
//             expect(galleryItem).toMatchObject({
//                 gallery_item_id: 1,
//                 title: "hey",
//                 description: 'New description',
//                 image_id: 1,
//                 show: true
//             });
//         })
//         it('returns a status code 201 and the updated skill object when the client updates the show and title by gallery_item_id', async () => {
//             const response = await request(app)
//             .patch('/api/gallery/1')
//             .send({
//                 show: false,
//                 title: "hey"  
//             })
//             .expect(201)
//             const {galleryItem} = response.body
//             expect(typeof galleryItem).toBe('object');
//             expect(Object.keys(galleryItem).length).toBe(5)
//             expect(galleryItem).toMatchObject({
//                 gallery_item_id: 1,
//                 title: "hey",
//                 description: "My final project group, at the Northcoders offices in manchester just before our  presentations",
//                 image_id: 1,
//                 show: false
//             });
//         })
//         it('returns a status code 201 and the updated skill object when the client updates just show by gallery_item_id', async () => {
//             const response = await request(app)
//             .patch('/api/gallery/2')
//             .send({
//                 show: false,
//             })
//             .expect(201)
//             const {galleryItem} = response.body
//             expect(typeof galleryItem).toBe('object');
//             expect(Object.keys(galleryItem).length).toBe(5)
//             expect(galleryItem).toMatchObject({
//                 gallery_item_id: 2,
//                 title: "At the summit of Mount Blanc",
//                 description: "At the top of Mount Blanc, after a two day climb with stop offs at the Tête Rousse Hut 3167m, and Goutier hut at 3835m",
//                 image_id: 2,
//                 show: false
//             });
//         })
//         it('returns a status code 201 and the updated skill object when the client updates just description by gallery_item_id', async () => {
//             const response = await request(app)
//             .patch('/api/gallery/2')
//             .send({
//                 description: 'this'
//             })
//             .expect(201)
//             const {galleryItem} = response.body
//             expect(typeof galleryItem).toBe('object');
//             expect(Object.keys(galleryItem).length).toBe(5)
//             expect(galleryItem).toMatchObject({
//                 gallery_item_id: 2,
//                 title: "At the summit of Mount Blanc",
//                 description: "this",
//                 image_id: 2,
//                 show: true
//             });
//         })
//         it('returns a status code 201 and the updated skill object when the client updates just title by gallery_item_id', async () => {
//             const response = await request(app)
//             .patch('/api/gallery/2')
//             .send({
//                 title: 'hello'
//             })
//             .expect(201)
//             const {galleryItem} = response.body
//             expect(typeof galleryItem).toBe('object');
//             expect(Object.keys(galleryItem).length).toBe(5)
//             expect(galleryItem).toMatchObject({
//                 gallery_item_id: 2,
//                 title: "hello",
//                 description: "At the top of Mount Blanc, after a two day climb with stop offs at the Tête Rousse Hut 3167m, and Goutier hut at 3835m",
//                 image_id: 2,
//                 show: true
//             });
//         })
//         it('returns status code 201 and the updated object but only updates the image object with valid keys, it ignores invalid data', async () => {
//             const response = await request(app)
//             .patch('/api/gallery/1')
//             .send({
//                 title: "My new gallery item",
//                 description: 'New description',
//                 show: false,
//                 wrongKey: true
//             })
//             .expect(201)
//             const {galleryItem} = response.body
//             expect(typeof galleryItem).toBe('object');
//             expect(Object.keys(galleryItem).length).toBe(5)
//             expect(galleryItem).not.toHaveProperty('wrongKey')
//             expect(galleryItem).toMatchObject({
//                 gallery_item_id: 1,
//                 title: "My new gallery item",
//                 description: 'New description',
//                 image_id: 1,
//                 show: false  
//             });
//         })
//         it('returns status code 400 and the the message "400 Bad Request, title cannot be an empty string!" if the client sends the title as an empty string', async () => {
//             const response = await request(app)
//             .patch('/api/gallery/2')
//             .send({
//                 title: ''
//             })
//             .expect(400)
//             const {msg} = response.body
//             expect(msg).toBe("400 Bad Request, title cannot be an empty string!")
//         })
//         it("returns a status code 400 with the message '400 Bad Request, invalid data type!' if passed an invalid gallery_item_id", async () => {
//             const response = await request(app)
//             .patch('/api/gallery/wrongdata')
//             .send({title: 'new title'})
//             .expect(400)
//             const{ body }= response
//             const { msg } = body;
//             expect(msg).toBe("400 Bad Request, invalid data type!");
//         });
//         it("returns a status code 404 with the message '404 Not Found, gallery_item_id does not exist!' if passed an invalid gallery_item_id", async () => {
//             const response = await request(app)
//             .patch('/api/gallery/400')
//             .send({title: 'wrong data type'})
//             .expect(404)
//             const{ body }= response
//             const { msg } = body;
//             expect(msg).toBe("404 Not Found, gallery_item_id does not exist!");
//         });
//         it('returns a status code 400 and the message "400 Bad Request, no data sent!" if the client uses a sends a body with no keys', async () => {
//             const response = await request(app)
//             .patch('/api/gallery/2')
//             .send({})
//             .expect(400)
//             const {msg} = response.body
//             expect(msg).toBe("400 Bad Request, no data sent!")
//         })
//         it('returns a status code 400 and the message "400 Bad Request, invalid data type!" if the client uses a sends a show as not a boolean', async () => {
//             const response = await request(app)
//             .patch('/api/gallery/2')
//             .send({show: 2})
//             .expect(400)
//             const {msg} = response.body
//             expect(msg).toBe("400 Bad Request, invalid data type!")
//         })
//     })

//     describe('DELETE/api/skills/:skill_id', () => {
//         it('returns a status code of 204 if the delete was successful', async () => {
//             //delete gallery item
//             const response = await request(app)
//             .delete('/api/gallery/2')
//             .expect(204)
//             // check gallery item has been deleted
//             const checkResponse = await request(app)
//             .get('/api/gallery/2')
//             .expect(404)
//             const {msg} = checkResponse.body
//             expect(msg).toBe('404 Not Found, gallery_item_id does not exist!')
//         })
//         it("returns a status code 404 with the message '404 Not Found, gallery_item_id does not exist!' if passed a valid but non existant gallery_item_id", async () => {
//             const response = await request(app)
//             .delete("/api/gallery/200")
//             .expect(404)
//             const{ body }= response
//             const { msg } = body;
//             expect(msg).toBe("404 Not Found, gallery_item_id does not exist!");
//         });
//         it("returns a status code 400 with the message '400 Bad Request, invalid data type!' if passed an invalid gallery_item_id", async () => {
//             const response = await request(app)
//             .delete("/api/gallery/thisIsAstring")
//             .expect(400)
//             const{ body }= response
//             const { msg } = body;
//             expect(msg).toBe("400 Bad Request, invalid data type!");
//         });
//     })
})