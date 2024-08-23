const projectsRouter = require('express').Router()

const {getAllProjects, getProjectById/*, postProjectById, patchProjectById, deleteProjectById*/} = require('../controllers/projects-controller.js')

projectsRouter.get('/', getAllProjects)
projectsRouter.get('/:project_id', getProjectById)
// projectsRouter.post('/', postProject)
// projectsRouter.patch('/:project_id', patchProjectById)
// projectsRouter.delete('/:project_id', deleteProjectById)

module.exports= projectsRouter