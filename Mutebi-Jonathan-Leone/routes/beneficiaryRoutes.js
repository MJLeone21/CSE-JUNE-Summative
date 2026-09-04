const express = require("express");
const router = express.Router();
const beneficiaryController = require("../controllers/beneficiaryController");

router.get("/", beneficiaryController.getBeneficiaries);
router.post("/", beneficiaryController.createBeneficiary);


module.exports = router;
