const jwt = require("jsonwebtoken");

const authMiddleware = {};

authMiddleware.loginRequired = async (req, res, next) => {
  try {
    // 1. Get the token from request
    const tokenString = req.headers.authorization;
    if (!tokenString) {
      throw new Error("Token not found");
    }
    const token = tokenString.replace("Bearer ", "");

    // 2. Check the token is exist
    jwt.verify(token, process.env.JWT_SECRET_KEY, (error, payload) => {
      if (error) {
        if (error.name === "TokenExpiredError") {
          throw new Error("Token expired");
        } else {
          throw new Error("Token is invalid");
        }
      }
      req.userId = payload._id;
    });

    // 3. Go to the next step
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

authMiddleware.adminRequired = async (req, res, next) => {
  try {
    const userId = req.userId;
    const currentUser = await User.findById(userId);
    const isAdmin = currentUser.role === "admin";

    if (!isAdmin) return next(new Error("401- Admin required"));
    req.isAdmin = isAdmin;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authMiddleware;
