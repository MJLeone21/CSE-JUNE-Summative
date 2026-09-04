const Beneficiary = require("../models/Beneficiary");

// POST /api/beneficiaries
// this creates a new beneficiary in the database
async function createBeneficiary(req, res) {
  try {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const dateOfBirth = req.body.dateOfBirth;
    const placeOfBirth = req.body.placeOfBirth;
    const gender = req.body.gender;
    const nationality = req.body.nationality;
    const maritalStatus = req.body.maritalStatus;
    const settlementCamp = req.body.settlementCamp;
    const dateOfJoiningCamp = req.body.dateOfJoiningCamp;

    const beneficiary = new Beneficiary({
      firstName: firstName,
      lastName: lastName,
      dateOfBirth: dateOfBirth,
      placeOfBirth: placeOfBirth,
      gender: gender ? gender : "female",
      nationality: nationality,
      maritalStatus: maritalStatus,
      settlementCamp: settlementCamp,
      dateOfJoiningCamp: dateOfJoiningCamp,
    });

    const saved = await beneficiary.save();

    res.status(201).json({
      success: true,
      message: "Beneficiary registered successfully",
      data: saved,
    });
  } catch (error) {
    // if mongoose validation fails, send back the field errors
    if (error.name === "ValidationError") {
      const fieldErrors = {};
      for (const key in error.errors) {
        fieldErrors[key] = error.errors[key].message;
      }
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: fieldErrors,
      });
    }

    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while registering the beneficiary",
    });
  }
}

// GET /api/beneficiaries
// gets all the beneficiaries, newest first
async function getBeneficiaries(req, res) {
  try {
    const beneficiaries = await Beneficiary.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: beneficiaries });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching beneficiaries",
    });
  }
}

module.exports = {
  createBeneficiary: createBeneficiary,
  getBeneficiaries: getBeneficiaries,
};
