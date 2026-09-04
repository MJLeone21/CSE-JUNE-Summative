const mongoose = require("mongoose");

// list of nationalities allowed in the dropdown
const NATIONALITIES = [
  "Ugandan",
  "Kenyan",
  "Tanzanian",
  "Burundian",
  "Rwandese",
  "Somali",
  "South Sudanese",
];

const MARITAL_STATUSES = [
  "Single",
  "Married",
  "Divorced",
  "Widowed",
  "Separated",
];

const SETTLEMENT_CAMPS = [
  "Gulu settlement camp",
  "Arua settlement camp",
  "Mbarara settlement camp",
  "Kasese settlement camp",
  "Busia settlement camp",
  "Mbale settlement camp",
  "Kigezi settlement camp",
];

const beneficiarySchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: [2, "First name must be at least 2 characters long"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minlength: [2, "Last name must be at least 2 characters long"],
    },
    // this is basically the date the record was created, we use it below
    // to check that dateOfBirth and dateOfJoiningCamp make sense
    dateOfRegistration: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
    dateOfBirth: {
      type: Date,
      required: [true, "Date of birth is required"],
      validate: {
        validator: function (value) {
          let registeredOn = this.dateOfRegistration;
          if (!registeredOn) {
            registeredOn = new Date();
          }
          return value < registeredOn;
        },
        message: "Date of birth must be before the date of registration",
      },
    },
    placeOfBirth: {
      type: String,
      required: [true, "Place of birth is required"],
      trim: true,
      minlength: [2, "Place of birth must be at least 2 characters long"],
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      default: "female",
    },
    nationality: {
      type: String,
      required: [true, "Nationality is required"],
      enum: { values: NATIONALITIES, message: "Select a valid nationality" },
    },
    maritalStatus: {
      type: String,
      required: [true, "Marital status is required"],
      enum: {
        values: MARITAL_STATUSES,
        message: "Select a valid marital status",
      },
    },
    settlementCamp: {
      type: String,
      required: [true, "Settlement camp is required"],
      enum: {
        values: SETTLEMENT_CAMPS,
        message: "Select a valid settlement camp",
      },
    },
    dateOfJoiningCamp: {
      type: Date,
      required: [true, "Date of joining settlement camp is required"],
      validate: {
        validator: function (value) {
          let registeredOn = this.dateOfRegistration;
          if (!registeredOn) {
            registeredOn = new Date();
          }
          return value > registeredOn;
        },
        message:
          "Date of joining settlement camp must be after the date of registration",
      },
    },
  },
  { timestamps: true },
);

const Beneficiary = mongoose.model("Beneficiary", beneficiarySchema);

module.exports = Beneficiary;
module.exports.NATIONALITIES = NATIONALITIES;
module.exports.MARITAL_STATUSES = MARITAL_STATUSES;
module.exports.SETTLEMENT_CAMPS = SETTLEMENT_CAMPS;
