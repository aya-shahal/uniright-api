let router = require("express").Router();

router.get("/", TestController.index);
router.get("/clearall", TestController.clearall);
router.get("/createmanager", TestController.createmanager);



router.get("/resetpassword/:token", UserController.resetpassword);
router.post("/resetnewpassword", UserController.resetnewpassword);


router.get("/terms", UserController.terms);
router.get("/privacy", UserController.privacy);
module.exports = router;
