const db = require("../db/connection.js");

exports.fetchAllImages = async () => {
        const result = await db.query(`SELECT * FROM images`);
        const images = result.rows;
        if (images.length === 0) {
            throw { status: 200, msg: 'No images available' };
        } else {
            return images;
        }
};

exports.fetchImageById = async (image_id) => {
        const result = await db.query(`
            SELECT * FROM images
            WHERE image_id=$1;
        `,[image_id]);
       
        
        const image = result.rows;
        if (image.length === 0) return Promise.reject({status: 404, msg: 'image_id does not exist!'})
        else return image
};