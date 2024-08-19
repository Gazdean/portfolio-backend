const imagesRouter = require('express').Router()

const {getAllImages, getImageById, postImage, patchImage, deleteImageById} = require('../controllers/images-controller.js')

imagesRouter.get('/', getAllImages)
imagesRouter.get('/:image_id', getImageById)
imagesRouter.post('/', postImage)
imagesRouter.patch('/:image_id', patchImage)
imagesRouter.delete('/:image_id', deleteImageById)

module.exports= imagesRouter