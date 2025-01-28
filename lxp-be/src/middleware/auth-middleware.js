import { prismaClient } from "../application/database";

const authMiddleware = async (req, res, next) => {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    return res.status(401).json({ errors: "Unauthorized" }).end();
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ errors: "Unauthorized" }).end();
  }

  const user = await prismaClient.user.findFirst({
    where: {
      token: token,
    },
  });

  if (!user) {
    return res.status(401).json({ errors: "Unauthorized" }).end();
  } else {
    req.user = user;
    next();
  }
};

export default authMiddleware;
