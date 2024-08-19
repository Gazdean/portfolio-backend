const { fetchAllSkills } = require('../models/skills-model.js')

exports.getAllSkills = async (req, res, next) => {
    try {
        const skills = await fetchAllSkills()
        res.status(200).send({skills})
    } catch (error) {
        next(error)
    }
}