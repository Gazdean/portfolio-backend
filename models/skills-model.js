const db = require("../db/connection.js");

exports.fetchAllSkills = async () =>{
    const result = await db.query(`
        SELECT * 
        FROM skills;
        `)
    if (!result.rows.length) return Promise.reject({ status: 200, msg: 'No skills available' })
    return result.rows
}