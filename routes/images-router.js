const imagesRouter = require('express').Router()

const {getAllImages} = require('../controllers/images-controller.js')

imagesRouter.get('/', getAllImages)

module.exports= imagesRouter