const express = require("express");
const router = express.Router();

const shoeController = require("../controllers/shoeController");

/* GET Shoes index page. */
router.get("/", shoeController.shoes_list);

/* GET Create Shoe page */
router.get("/create", shoeController.shoes_create_get);

/* POST Create Shoe page */
router.post("/create", shoeController.shoes_create_post);

/* GET Single Shoe page */
router.get("/:id", shoeController.shoes_detail);

/* GET Delete Single Shoe page */
router.get("/:id/delete", shoeController.shoes_delete_get);

/* POST Delete Single Shoe page */
router.post("/:id/delete", shoeController.shoes_delete_post);

/* GET Update Single Shoe page */
router.get("/:id/update", shoeController.shoes_update_get);

/* POST Update Single Shoe page */
router.post("/:id/update", shoeController.shoes_update_post);

module.exports = router;
