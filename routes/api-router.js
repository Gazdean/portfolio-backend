const apiRouter = require('express').Router()

const imagesRouter = require("./images-router.js")
const skillsRouter = require("./skills-router.js")
const galleryRouter = require("./gallery-router.js")
// const projectsRouter = require("./projects-router.js")
// const endpointsRouter = require("./endpoints-router.js")

apiRouter.use("/images", imagesRouter)
apiRouter.use("/skills", skillsRouter)
apiRouter.use("/gallery", galleryRouter)
// apiRouter.use("/projects", projectsRouter)
// apiRouter.use("/endpoints", endPointsRouter)

module.exports = apiRouter