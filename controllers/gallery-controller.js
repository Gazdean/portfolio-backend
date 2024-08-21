const {fetchAllImages/*, fetchImageById, createImage, updateImage, removeImageById*/} = require('../models/images-model.js')

exports.getAllImages = async (req, res, next) => {
    try {
        const images = await fetchAllImages();
        res.status(200).send({images});
    } catch (error) {
        next(error);
    }
};

// exports.getImageById = async (req, res, next) => {
//     const {image_id} = req.params
    
//     try {
//         const image = await fetchImageById(image_id);
//         res.status(200).send({image});
//     } catch (error) {
//         next(error);
//     }
// }

// exports.postImage = async (req, res, next) => {
//     const {body} = req
//     try {
//         const newImage = await createImage(body)
//         res.status(201).send({ image: newImage });
//     } catch (error) {
//         next(error)
//     }
// }

// exports.patchImage = async (req, res, next) => {
//     const {body} = req
//     const {image_id} =req.params
//     try {
//         const updatedImage = await updateImage(body, image_id)
//         res.status(201).send({ image: updatedImage });
//     } catch (error) {
//         next(error)
//     }
// }

// exports.deleteImageById = async (req, res, next) => {
//     const {image_id} =req.params
//     try {
//         await removeImageById(image_id)
//         res.status(204).send({});
//     } catch (error) {
//         next(error)
//     }
// }