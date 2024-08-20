const {
  fetchAllSkills,
  fetchSkillById,
  createSkill,
  updateSkill
} = require("../models/skills-model.js");

exports.getAllSkills = async (req, res, next) => {
  try {
    const skills = await fetchAllSkills();
    res.status(200).send({ skills });
  } catch (error) {
    next(error);
  }
};

exports.getSkillById = async (req, res, next) => {
  const { skill_id } = req.params;
  try {
    const skill = await fetchSkillById(skill_id);
    res.status(200).send({ skill });
  } catch (error) {
    next(error);
  }
};

exports.postSkill = async (req, res, next) => {
  const { body } = req;
  try {
    const newSkill = await createSkill(body);
    res.status(201).send({ skill: newSkill });
  } catch (error) {
    next(error);
  }
};

exports.patchSkill = async (req, res, next) => {
  const { body } = req;
  const { skill_id } = req.params;
  try {
    const updatedSkill = await updateSkill(body, skill_id);
    res.status(201).send({ skill: updatedSkill });
  } catch (error) {
    next(error);
  }
};

// exports.deleteImageById = async (req, res, next) => {
//     const {image_id} =req.params
//     try {
//         await removeImageById(image_id)
//         res.status(204).send({});
//     } catch (error) {
//         next(error)
//     }
// }
