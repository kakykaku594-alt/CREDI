// Central error handler. Controllers should call next(err) rather than
// sending ad-hoc error responses, so messages stay consistent (see PRD sec. 35).
module.exports = function errorHandler(err, req, res, next) {
  console.error(err);

  const status = err.status || 500;
  const message = status === 500
    ? 'Something went wrong on our end. Please try again shortly.'
    : err.message;

  res.status(status).json({ error: message });
};
