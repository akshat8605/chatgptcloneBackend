const router = require("express").Router();
const { catchErrors } = require("../handler/errorHandlers");
const chatController = require("../controller/chats");
const auth = require("../handler/authHandlers");


router.post("/chat", catchErrors(chatController.add));
router.post("/getChat", catchErrors(chatController.getChat));
router.post("/allChats", catchErrors(chatController.allChats));
router.post("/share", catchErrors(chatController.enableShare));
router.post("/forkChat", catchErrors(chatController.addSharedChat));

module.exports = router;