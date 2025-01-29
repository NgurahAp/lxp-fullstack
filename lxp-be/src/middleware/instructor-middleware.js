const instruktorMiddleware = async (req, res, next) => {
  if (req.user && req.user.role === "instructor") {
    next();
  } else {
    res.status(403).json({
      errors: "Forbidden: Only instructors can access this resource",
    });
  }
};

export { instruktorMiddleware };
