exports.handleCustomErrors = (err, req, res, next) => {
  // console.log('im here in the custom error controller')
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handlePsqlErrors = (err, req, res, next) => {
  // console.log('im here in the PSQL error controller')
  // console.log(err)
  if (err.code === "22P02") {
    res.status(404).send({ msg: "Bad Request, invalid data type!" });
  } else next(err);
};

exports.handleInternalErrors = (err, req, res, next) => {
  // console.log('im here in the internal error controller')
  res.status(500).send({ msg: "Internal Server Error!" });
};