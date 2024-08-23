const {fetchAllProjects, fetchProjectById/*, createProject, updateProjectById, removeProjectById*/} = require('../models/projects-model.js')

exports.getAllProjects = async (req, res, next) => {
    try {
        const projects = await fetchAllProjects();
        res.status(200).send({projects});
    } catch (error) {
        next(error);
    }
};

exports.getProjectById = async (req, res, next) => {
    const {project_id} = req.params
    
    try {
        const project = await fetchProjectById(project_id);
        res.status(200).send({project});
    } catch (error) {
        next(error);
    }
}

// exports.postGalleryItem = async (req, res, next) => {
//     const {body} = req
//     try {
//         const newGalleryItem = await createGalleryItem(body)
//         res.status(201).send({ galleryItem: newGalleryItem });
//     } catch (error) {
//         next(error)
//     }
// }

// exports.patchGalleryItemById = async (req, res, next) => {
//     const {body} = req
//     const {gallery_item_id} =req.params
   
//     try {
//         const updatedGalleryItem = await updateGalleryItemById(body, gallery_item_id)
//         res.status(201).send({ galleryItem: updatedGalleryItem });
//     } catch (error) {
//         next(error)
//     }
// }

// exports.deleteGalleryItemById = async (req, res, next) => {
//     const {gallery_item_id} =req.params
//     try {
//         await removeGalleryItemById(gallery_item_id)
//         res.status(204).send({});
//     } catch (error) {
//         next(error)
//     }
// }