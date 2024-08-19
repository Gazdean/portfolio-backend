const skillsRouter = require('express').Router()

const {getAllskills} = require('../controllers/skills-controller.js')

skillsRouter.get('/', getAllskills)
// skillsRouter.get('/:skill_id', getSkillById)
// skillsRouter.post('/', postSkill)
// skillsRouter.patch('/:skill_id', patchSkill)
// skillsRouter.delete('/:skill_id', deleteSkillById)

module.exports= skillsRouter