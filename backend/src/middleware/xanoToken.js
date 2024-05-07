// backend/src/middlewares/xanoToken.js

const xanoTokenMiddleware = (req, res, next) => {
  const xanoToken = process.env.XANO_TOKEN;
  if (xanoToken) {
    req.headers.authorization = `Bearer ${xanoToken}`;
  }
  next();
};

module.exports = xanoTokenMiddleware;
