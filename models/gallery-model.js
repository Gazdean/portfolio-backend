const db = require("../db/connection.js");

exports.fetchAllGalleryItems = async () => {
        const result = await db.query(`SELECT * FROM gallery;`);
        const gallery = result.rows;
        if (gallery.length === 0) {
            return Promise.reject ({ status: 200, msg: 'Gallery is empty!' });
        } else {
            return gallery
        }
};

exports.fetchGalleryItemById = async (gallery_item_id) => {
        const result = await db.query(`
            SELECT * FROM gallery
            WHERE gallery_item_id=$1;
        `,[gallery_item_id]);
       
        const galleryItem = result.rows;

        if (galleryItem.length === 0) return Promise.reject({status: 404, msg: '404 Not Found, gallery_item_id does not exist!'})
        else return galleryItem
};

exports.createGalleryItem = async (body) => {
    const {title, description, image_id} = body
    
    if (title && image_id) {
        const result = await db.query(`
            INSERT INTO gallery (title, description, image_id)
            VALUES($1, $2, $3)
            RETURNING *;
            `, [title, description, image_id])
        return result.rows[0]
    } else {
        return Promise.reject({status: 400, msg: "400 Bad request, both a title and image_id are required!"})
    }
}

// exports.updateImage = async (body, image_id) => {
//     const existingImage = await this.fetchImageById(image_id)
//     const {image_url, alt_text} = body

//     if (!image_url && !alt_text) {
//         return Promise.reject({status: 400, msg: '400 Bad request, must include both or either image_url and alt_text!'})
//     }
   
//     let setString = ``
//     const dataArr = [image_id]
//     if (image_url) {
//         setString += 'image_url = $2'
//         dataArr.push(image_url)
//     }
//     if (!setString.length && alt_text) { 
//         setString += 'alt_text = $2'
//         dataArr.push(alt_text)
//     } else if (setString.length && alt_text) {
//         setString += ', alt_text = $3'
//         dataArr.push(alt_text)
//     }
    
//     if (setString) {    
//         const result = await db.query(`
//             UPDATE images 
//             SET ${setString}
//             WHERE image_id = $1
//             RETURNING *;
//             `, dataArr)
//         return result.rows[0]
//     }
// }

// exports.removeImageById = async (image_id) => {
//     const image = await this.fetchImageById(image_id)
//     const result = await db.query(`
//         DELETE FROM images
//         WHERE image_id = $1;
//       `, [image_id])
//    return
// }