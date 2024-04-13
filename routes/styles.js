const express = require("express");
const router = express.Router();

const styleController = require("../controllers/styleController");

// Express validator?

/* GET styles index page. */
router.get("/", styleController.styles_list);

/* GET Create Style page */
router.get("/create", styleController.styles_create_get);

/* POST Create Style page */
router.post("/create", styleController.styles_create_post);

/* GET Single Style page */
router.get("/:id", styleController.styles_detail);

/* GET Delete Single Style page */
router.get("/:id/delete", styleController.styles_delete_get);

/* POST Delete Single Style page */
router.post("/:id/delete", styleController.styles_delete_post);

/* GET Update Single Style page */
router.get("/:id/update", styleController.styles_update_get);

/* POST Update Single Style page */
router.post("/:id/update", styleController.styles_update_post);

module.exports = router;
