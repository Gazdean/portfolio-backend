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

        if (image.length === 0) return Promise.reject({status: 404, msg: 'Not Found, image_id does not exist!'})
        else return image
};

exports.createImage = async (body) => {
    const {image_url, alt_text} = body
    
    if (Object.keys(body).length === 2 && image_url && alt_text) {
        const result = await db.query(`
            INSERT INTO images (image_url, alt_text)
            VALUES($1, $2)
            RETURNING *;
            `, [image_url, alt_text])

        return result.rows[0]
    } else if (Object.keys(body).length > 2 || (Object.keys(body).length === 1 && (!image_url && !alt_text))) {
        return Promise.reject({status: 400, msg: 'Bad request, incorrect data sent, only include image_url and alt_text!'})
    } else {
        return Promise.reject({status: 400, msg: "Bad request, both image_url and alt_text are needed!"})
    }
}

exports.updateImage = async (body, image_id) => {
    const existingImage = await this.fetchImageById(image_id)
    const {image_url, alt_text} = body

    if (!image_url && !alt_text) {
        return Promise.reject({status: 400, msg: 'Bad request, must include both or either image_url and alt_text!'})
    }
   
    let setString = ``
    const dataArr = [image_id]
    if (image_url) {
        setString += 'image_url = $2'
        dataArr.push(image_url)
    }
    if (!setString.length && alt_text) { 
        setString += 'alt_text = $2'
        dataArr.push(alt_text)
    } else if (setString.length && alt_text) {
        setString += ', alt_text = $3'
        dataArr.push(alt_text)
    }
    
    if (setString) {    
        const result = await db.query(`
            UPDATE images 
            SET ${setString}
            WHERE image_id = $1
            RETURNING *;
            `, dataArr)
        return result.rows[0]
    }
}

exports.removeImageById = async (image_id) => {
    const image = await this.fetchImageById(image_id)
    const result = await db.query(`
        DELETE FROM images
        WHERE image_id = $1;
      `, [image_id])
   return
}