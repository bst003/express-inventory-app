const express = require("express");
const router = express.Router();

const brandController = require("../controllers/brandController");

// Express validator?

/* GET brands index page. */
router.get("/", brandController.brands_list);

/* GET Create Brand page */
router.get("/create", brandController.brands_create_get);

/* POST Create Brand page */
router.post("/create", brandController.brands_create_post);

/* GET Single  Brand page */
router.get("/:id", brandController.brands_detail);

/* GET Delete Single Brand page */
router.get("/:id/delete", brandController.brands_delete_get);

/* POST Delete Single Brand page */
router.post("/:id/delete", brandController.brands_delete_post);

/* GET Update Single Brand page */
router.get("/:id/update", brandController.brands_update_get);

/* POST Update Single Brand page */
router.post("/:id/update", brandController.brands_update_post);

module.exports = router;
