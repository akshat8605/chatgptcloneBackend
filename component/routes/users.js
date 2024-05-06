const router = require("express").Router();
const { catchErrors } = require("../handler/errorHandlers");
const userController = require("../controller/users");
const auth = require("../handler/authHandlers");


router.post("/login", catchErrors(userController.login));
router.post("/register", catchErrors(userController.register));
router.post("/loginWIthToken", catchErrors(userController.loginWithToken));

module.exports = router;