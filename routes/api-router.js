const apiRouter = require('express').Router()

const imagesRouter = require("./images-router.js")
// const galleryRouter = require("./gallery-router.js")
// const skillsRouter = require("./skills-router.js")
// const projectsRouter = require("./projects-router.js")
// const endpointsRouter = require("./endpoints-router.js")

apiRouter.use("/images", imagesRouter)
// apiRouter.use("/gallery", userRouter)
// apiRouter.use("/skills", userRouter)
// apiRouter.use("/projects", userRouter)
// apiRouter.use("/endpoints", userRouter)

module.exports = apiRouter