const format = require('pg-format');
const db = require('../connection');

const seed = async () => {
  try {
    // Drop tables
    await db.query(`DROP TABLE IF EXISTS gallery;`)
    await db.query(`DROP TABLE IF EXISTS projects;`);
    await db.query(`DROP TABLE IF EXISTS skills;`);
    await db.query(`DROP TABLE IF EXISTS images;`);

    // Create tables

    await db.query(`
      CREATE TABLE images (
        image_id SERIAL PRIMARY KEY,
        title VARCHAR(50),
        alt_text VARCHAR(50) NOT NULL,
        image_url VARCHAR(100) NOT NULL
      );
      `)
    await db.query(`
      CREATE TABLE skills (
        skill_id SERIAL PRIMARY KEY,
        title VARCHAR(50) NOT NULL,
        icon VARCHAR(50),
        icon_color VARCHAR(20),
        image_id INT REFERENCES images(image_id)
      );
      `)
    await db.query(`
      CREATE TABLE projects (
        project_id SERIAL PRIMARY KEY,
        title VARCHAR(50) NOT NULL,
        description TEXT,
        github_url VARCHAR(100),
        live_project_url VARCHAR(100),
        image_id INT REFERENCES images(image_id)
      );
      `)
    await db.query(`
      CREATE TABLE gallery (
        gallery_item_id SERIAL PRIMARY KEY,
        title VARCHAR(50) NOT NULL,
        description TEXT,
        image_id INT REFERENCES images(image_id)
      );
      `)

  } catch (error) {
    console.log('error in seed.js', error)
  }
};

module.exports = seed;