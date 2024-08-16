const imagesRouter = require('express').Router()

const {getAllImages, getImageById} = require('../controllers/images-controller.js')

imagesRouter.get('/', getAllImages)
imagesRouter.get('/:image_id', getImageById)

module.exports= imagesRouter