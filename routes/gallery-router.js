const galleryRouter = require('express').Router()

const {getAllGallery/*, getGalleryById, postGallery, patchGallery, deleteGalleryById*/} = require('../controllers/gallery-controller.js')

galleryRouter.get('/', getAllGallery)
// galleryRouter.get('/:gallery_id', getGalleryById)
// galleryRouter.post('/', postGallery)
// galleryRouter.patch('/:gallery_id', patchGallery)
// galleryRouter.delete('/:gallery_id', deleteGalleryById)

module.exports= galleryRouter