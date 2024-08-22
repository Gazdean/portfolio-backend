const db = require("../db/connection.js");
const {fetchImageById} = require('../models/images-model.js')

exports.fetchAllSkills = async () =>{
    const result = await db.query(`
        SELECT * 
        FROM skills;
        `)
    if (!result.rows.length) return Promise.reject({ status: 200, msg: 'No skills available' })
    return result.rows
}

exports.fetchSkillById = async (skill_id) => {
    const result = await db.query(`
        SELECT * FROM skills
        WHERE skill_id=$1;
    `,[skill_id]);
   
    const skill = result.rows;
    if (skill.length === 0) return Promise.reject({status: 404, msg: '404 Not Found, skill_id does not exist!'})
    else return skill[0]
};

exports.createSkill = async (body) => {
    const {title, icon_class, icon_background_color, icon_color, image_id} = body
    
    if (title) {     
        const result = await db.query(`
            INSERT INTO skills (title, icon_class, icon_background_color, icon_color, image_id)
            VALUES($1, $2, $3, $4, $5)
            RETURNING *;
            `, [title, icon_class, icon_background_color, icon_color, image_id])
        return result.rows[0]
    } else {
        return Promise.reject({status: 400, msg: "400 Bad request, a title is required!"})
    }
}

exports.updateSkill = async (body, skill_id) => {
    if (!Object.keys(body).length){
        return Promise.reject({status: 400, msg: '400 Bad Request, no data sent!'})
    }
    await this.fetchSkillById(skill_id)
    const {image_id, title} = body
    if (image_id)  {
        await fetchImageById(image_id)
    }
    const greenKeyArr = ['title', 'icon_class', 'image_id', 'icon_background_color', 'icon_color']

    let setString = ``

    const dataArr = [skill_id]
    let count = 2

    for (const key in body) {
        if(key === 'title' && !title.length) return Promise.reject({status: 400, msg: '400 Bad Request, title cannot be an empty string!'})
        else if (greenKeyArr.includes(key)){
            dataArr.push(body[key])
            if (!setString.length) {
                setString += `${key} = $${count}`
                count ++
            }
            else {
                setString += `, ${key} = $${count}` 
                count ++
            }
        }
    }
    if (setString) {   
        const result = await db.query(`
            UPDATE skills 
            SET ${setString}
            WHERE skill_id = $1
            RETURNING *;
            `, dataArr)
        return result.rows[0]
    }
}

exports.removeSkillById = async (skill_id) => {
const skill = await this.fetchSkillById(skill_id)
const result = await db.query(`
    DELETE FROM skills
    WHERE skill_id = $1;
  `, [skill_id])
return
}