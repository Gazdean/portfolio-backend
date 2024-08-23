const projectsRouter = require('express').Router()

const {getAllProjects/*, getProjectsById, postProjectById, patchProjectById, deleteProjectById*/} = require('../controllers/projects-controller.js')

projectsRouter.get('/', getAllProjects)
// projectsRouter.get('/:project_id', getProjectsById)
// projectsRouter.post('/', postProject)
// projectsRouter.patch('/:project_id', patchProjectById)
// projectsRouter.delete('/:project_id', deleteProjectById)

module.exports= projectsRouter