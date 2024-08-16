const {fetchAllImages} = require('../models/images-model.js')

exports.getAllImages = async (req, res, next) => {
    try {
        const images = await fetchAllImages();
        res.status(200).send({images});
    } catch (error) {
        next(error);
    }
};