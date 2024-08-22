const {fetchAllGalleryItems, fetchGalleryItemById, createGalleryItem/*, updateGalleryItemById, removeGalleryItemById*/} = require('../models/gallery-model.js')

exports.getAllGalleryItems = async (req, res, next) => {
    try {
        const gallery = await fetchAllGalleryItems();
        res.status(200).send({gallery});
    } catch (error) {
        next(error);
    }
};

exports.getGalleryItemById = async (req, res, next) => {
    const {gallery_item_id} = req.params
    
    try {
        const galleryItem = await fetchGalleryItemById(gallery_item_id);
        res.status(200).send({galleryItem});
    } catch (error) {
        next(error);
    }
}

exports.postGalleryItem = async (req, res, next) => {
    const {body} = req
    try {
        const newGalleryItem = await createGalleryItem(body)
        res.status(201).send({ galleryItem: newGalleryItem });
    } catch (error) {
        next(error)
    }
}

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