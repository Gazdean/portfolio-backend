const skillsRouter = require('express').Router()

const {getAllSkills, getSkillById, postSkill, patchSkill} = require('../controllers/skills-controller.js')

skillsRouter.get('/', getAllSkills)
skillsRouter.get('/:skill_id', getSkillById)
skillsRouter.post('/', postSkill)
skillsRouter.patch('/:skill_id', patchSkill)
// skillsRouter.delete('/:skill_id', deleteSkillById)

module.exports= skillsRouter