const {fetchAllImages, fetchImageById} = require('../models/images-model.js')

exports.getAllImages = async (req, res, next) => {
    try {
        const images = await fetchAllImages();
        res.status(200).send({images});
    } catch (error) {
        next(error);
    }
};

exports.getImageById = async (req, res, next) => {
    const image_id = req.params.image_id
    try {
        const image = await fetchImageById(image_id);
        res.status(200).send({image});
    } catch (error) {
        next(error);
    }
}