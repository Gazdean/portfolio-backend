exports.handleCustomErrors = (err, req, res, next) => {
  // console.log('im here in the custom error controller')
  // console.log(err)
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
    res.status(400).send({ msg: "400 Bad Request, invalid data type!" });
  } else if (err.code === "23502") {
    res.status(400).send({ msg: "409 conflict, violates not-null constraint!" });
  } else next(err);
};

exports.handleInternalErrors = (err, req, res, next) => {
  // console.log('im here in the internal error controller')
  console.log(err)
  res.status(500).send({ msg: "500 Internal Server Error!" });
};