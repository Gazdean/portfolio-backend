const galleryRouter = require('express').Router()

const {getAllGalleryItems, getGalleryItemById, postGalleryItem/*, patchGalleryItem, deleteGalleryItemById*/} = require('../controllers/gallery-controller.js')

galleryRouter.get('/', getAllGalleryItems)
galleryRouter.get('/:gallery_item_id', getGalleryItemById)
galleryRouter.post('/', postGalleryItem)
// galleryRouter.patch('/:gallery_item_id', patchGalleryItem)
// galleryRouter.delete('/:gallery_item_id', deleteGalleryItemById)

module.exports= galleryRouter