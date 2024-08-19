const {} = require('')
const { fetchAllSkills } = require('../models/skills-model')

exports.getAllSkills = async (req, res, next) => {
    const skills = await fetchAllSkills
    console.log(skills)
}