// Routes Access Control Function
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).json({
      statusCode: 401,
      msg: `You are not authorized! Please login...`,
    });
  }
};

module.exports = {
  ensureAuthenticated,
};
