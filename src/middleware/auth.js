const { anyError } = require("../responce/error");
const jwt = require("jsonwebtoken");
const { isActivestatus } = require("../services/admin");
const authentication = async (req, _res, next) => {
  try {
    let authenticationHeader = req.headers.authorization || "";
    if (authenticationHeader == "") {
      throw anyError({
        message: "Authentication token not found",
      });
    }
    if (!authenticationHeader.startsWith("Bearer")) {
      throw anyError({
        message: "Authentication token are not mainten convention",
      });
    }
    authenticationHeader = authenticationHeader.split(" ")[1];
    const decodeTokenvalue = jwt.decode(authenticationHeader);

    if (decodeTokenvalue == null) {
      throw anyError({
        message: "Invalid token",
      });
    }

    //verify token with role
    const verifyKey =
      decodeTokenvalue.role == "admin"
        ? process.env.secret
        : decodeTokenvalue.role == "teacher"
        ? process.env.secret_teacher
        : null;
    if (verifyKey == null) {
      throw anyError({
        message: "Invalid token",
      });
    }
    const decodetoken = jwt.verify(authenticationHeader, verifyKey);

    if (Object.keys(decodetoken).length > 0) {
      const checkStatus = await isActivestatus(decodeTokenvalue);
      if (checkStatus.status !== 200) {
        throw anyError({
          message: "Your are not authorized to access this route",
        });
      }

      req.user = decodetoken;
      next();
    } else {
      throw anyError({
        message: "Invalid token",
      });
    }
  } catch (error) {
    if (error.name == "TokenExpiredError") {
      error.message = "Token expires please login again";
    }

    next(error);
  }
};

const authorization =
  (role = []) =>
  (req, res, next) => {
    try {
      const userRole = req.user.role;
      if (!role.includes(userRole)) {
        throw anyError({
          message: "Access denied",
          status: 401,
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };

module.exports = {
  authentication,
  authorization,
};
