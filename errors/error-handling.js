exports.handleInternalErrors = (err, req, res, next) => {
    
    (err, req, res, next) => {
        console.log('im here in the error controller')
      res.status(500).send({ msg: "ERROR Internal Server Error" });
    };
  };