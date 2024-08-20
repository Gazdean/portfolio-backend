const db = require('../connection.js');
const format = require('pg-format');

const seed = async ({imagesData, skillsData, projectsData, galleryData}) => {
  
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
        alt_text VARCHAR(200) NOT NULL,
        image_url VARCHAR(100) NOT NULL
      );
      `)
    await db.query(`
      CREATE TABLE skills (
        skill_id SERIAL PRIMARY KEY,
        title VARCHAR(50) NOT NULL,
        icon_class VARCHAR(50),
        icon_color VARCHAR(20),
        icon_background_color VARCHAR(20),
        image_id INT REFERENCES images(image_id) ON DELETE SET NULL
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
        image_id INT REFERENCES images(image_id) ON DELETE CASCADE
      );
      `)
    
    // Seed tables insert data

    const imagesQueryStr = format (`
      INSERT INTO images (alt_text, image_url) VALUES %L;`,
      imagesData.map(({alt_text, image_url}) =>
          [alt_text, image_url]
      )
    )
    await  db.query(imagesQueryStr)

    const skillsQueryStr = format (`
      INSERT INTO skills (title, icon_class, image_id, icon_color, icon_background_color) VALUES %L;`,
      skillsData.map(({title, icon_class, image_id, icon_color, icon_background_color}) =>
          [title, icon_class, image_id, icon_color, icon_background_color]
      )
    )
    await  db.query(skillsQueryStr)

    const projectsQueryStr = format (`
      INSERT INTO projects (title, description, github_url, live_project_url, image_id) VALUES %L;`,
      projectsData.map(({title, description, github_url, live_project_url, image_id}) =>
          [title, description, github_url, live_project_url, image_id]
      )
    )
    await  db.query(projectsQueryStr)

    const galleryQueryStr = format (`
      INSERT INTO gallery (title, description, image_id) VALUES %L;`,
      galleryData.map(({title, description, image_id}) =>
          [title, description, image_id]
      )
    )
    await  db.query(galleryQueryStr)


  } catch (error) {
    console.log('ERROR in seed.js: ', error)
  }
};

module.exports = seed;