const db = require("../db/connection.js");

exports.fetchAllProjects = async () => {
        const result = await db.query(`SELECT * FROM projects;`);
        const projects = result.rows;
        if (projects.length === 0) {
            return Promise.reject ({ status: 200, msg: 'There are no projects!' });
        } else {
            return projects
        }
};

// exports.fetchGalleryItemById = async (gallery_item_id) => {
//         const result = await db.query(`
//             SELECT * FROM gallery
//             WHERE gallery_item_id=$1;
//         `,[gallery_item_id]);
       
//         const galleryItem = result.rows;

//         if (galleryItem.length === 0) return Promise.reject({status: 404, msg: '404 Not Found, gallery_item_id does not exist!'})
//         else return galleryItem[0]
// };

// exports.createGalleryItem = async (body) => {
//     const {title, description, image_id} = body
    
//     if (title && image_id) {
//         const result = await db.query(`
//             INSERT INTO gallery (title, description, image_id)
//             VALUES($1, $2, $3)
//             RETURNING *;
//             `, [title, description, image_id])
//         return result.rows[0]
//     } else {
//         return Promise.reject({status: 400, msg: "400 Bad request, both a title and image_id are required!"})
//     }
// }

// exports.updateGalleryItemById = async (body, gallery_item_id) => {
//         if (!Object.keys(body).length){
//             return Promise.reject({status: 400, msg: '400 Bad Request, no data sent!'})
//         }
//         await this.fetchGalleryItemById(gallery_item_id)
//         const {title} = body
//         const greenKeyArr = ['title', 'description', 'show']
        
//         let setString = ``
    
//         const dataArr = [gallery_item_id]
//         let count = 2
    
//         for (const key in body) {
//             if(key === 'title' && typeof title === 'string' && !title.length) return Promise.reject({status: 400, msg: '400 Bad Request, title cannot be an empty string!'})
//             else if (greenKeyArr.includes(key)){
//                 dataArr.push(body[key])
//                 if (!setString.length) {
//                     setString += `${key} = $${count}`
//                     count ++
//                 }
//                 else {
//                     setString += `, ${key} = $${count}` 
//                     count ++
//                 }
//             }
//         }
//         if (setString) {   
//             const result = await db.query(`
//                 UPDATE gallery 
//                 SET ${setString}
//                 WHERE gallery_item_id = $1
//                 RETURNING *;
//                 `, dataArr)
//             return result.rows[0]
//         }
    
// }   

// exports.removeGalleryItemById = async (gallery_item_id) => {
//     const image = await this.fetchGalleryItemById(gallery_item_id)
//     const result = await db.query(`
//         DELETE FROM gallery
//         WHERE gallery_item_id = $1;
//       `, [gallery_item_id])
//    return
// }