import jwt from "jsonwebtoken";

export default authMiddleware = function (req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader === null || authHeader === undefined) {
    return res.status(401).json({ status: 401, message: "UnAuthorized" });
  }

  console.log("The token is", authHeader);

  const token = authHeader.split(" ")[1];

  //Verify the JWT token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err)
      return res.status(401).json({ status: 401, message: "UnAuthorized" });
    req.user = user;
    next();
  });
};
