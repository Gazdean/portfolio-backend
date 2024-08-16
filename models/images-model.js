const db = require("../db/connection.js");

exports.fetchAllImages = async () => {
    try {
        const result = await db.query("SELECT * FROM images");
        const images = result.rows;
        // if (images.length === 0) {
        //     throw { status: 200, msg: 'No images available' };
        // } else {
            return images;
        // }
    }
};