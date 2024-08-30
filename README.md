Portfolio API

This backend project is a relational database which allows me to easily create and update my skills, gallery and projects, which can then be rendered to my portfolio page.

Its built using Express and sql, and utilising the model-view-controller(MVC) design pattern and RESTful endpoints.

Endpoints

GET/api/skills
GET/api/images/:image_id
POST/api/images/:image_id
PATCH/api/images/:image_id
DELETE/api/images/:image_id

GET/api/skills
GET/api/skills/:skill_id
POST/api/skills/:skill_id
PATCH/api/skills/:skill_id
DELETE/api/skills/:skill_id

GET/api/gallery  
GET/api/gallery/:gallery_id
POST/api/gallery/:gallery_id
PATCH/api/gallery/:gallery_id
DELETE/api/gallery/:gallery_id

coming soon...

GET/api/projects  
GET/api/projects/:project_id
POST/api/projects/:project_id
PATCH/api/projects/:project_id
DELETE/api/projects/:project_id
