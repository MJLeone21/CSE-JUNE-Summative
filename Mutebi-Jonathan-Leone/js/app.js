// API endpoint where form data will be sent
const API_URL = "/api/beneficiaries";

// Navigation between landing page and form 
const landingPage = document.getElementById("landingPage");
const formPage = document.getElementById("formPage");
const goToFormBtn = document.getElementById("goToFormBtn");

// When "Register" button is clicked, hide landing page and show form page
goToFormBtn.addEventListener("click", function () {
  landingPage.classList.add("hidden");
  formPage.classList.remove("hidden");
});

//  Grab all the elements we need 
const form = document.getElementById("beneficiaryForm");
const successAlert = document.getElementById("successAlert");
const closeAlertBtn = document.getElementById("closeAlertBtn");

// Store references to all form fields
const fields = {
  firstName: document.getElementById("firstName"),
  lastName: document.getElementById("lastName"),
  dateOfBirth: document.getElementById("dateOfBirth"),
  placeOfBirth: document.getElementById("placeOfBirth"),
  nationality: document.getElementById("nationality"),
  maritalStatus: document.getElementById("maritalStatus"),
  settlementCamp: document.getElementById("settlementCamp"),
  dateOfJoiningCamp: document.getElementById("dateOfJoiningCamp"),
};

// Flag to track if user has tried submitting yet
let hasAttemptedSubmit = false;

//Helper functions
function parseDateInput(value) {
  const regex = /^\s*(\d{4})\s*\/\s*(\d{1,2})\s*\/\s*(\d{1,2})\s*$/;
  const match = regex.exec(value);
  if (match === null) return null;

  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const day = parseInt(match[3], 10);

  const date = new Date(year, month - 1, day);

  // Ensure the date is real (e.g. Feb 31 should not roll over to March)
  if (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  ) {
    return date;
  }
  return null;
}

// Get today's date with time set to midnight
function getToday() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
}

// Update field styling and error message
function setFieldState(name, state, message) {
  const input = fields[name];
  const group = input.closest(".form-group");
  const messageEl = document.getElementById("msg-" + name);

  group.classList.remove("is-valid", "is-invalid");
  if (state === "valid") group.classList.add("is-valid");
  if (state === "invalid") group.classList.add("is-invalid");

  messageEl.textContent = message || "";
}

// Style dropdown when placeholder is selected
function updateSelectPlaceholderStyle(select) {
  if (select.value === "") {
    select.classList.add("placeholder-selected");
  } else {
    select.classList.remove("placeholder-selected");
  }
}

// Validation 
function validateField(name) {
  const value = fields[name].value.trim();

  // Text fields
  if (name === "firstName" || name === "lastName" || name === "placeOfBirth") {
    if (value === "") {
      setFieldState(name, "invalid", "This field is required");
      return false;
    }
    if (value.length < 2) {
      setFieldState(name, "invalid", "Invalid field");
      return false;
    }
    setFieldState(name, "valid", "");
    return true;
  }

  // Date of birth must be before today
  if (name === "dateOfBirth") {
    if (value === "") {
      setFieldState(name, "invalid", "This field is required");
      return false;
    }
    const dob = parseDateInput(value);
    if (dob === null || dob >= getToday()) {
      setFieldState(name, "invalid", "Invalid field");
      return false;
    }
    setFieldState(name, "valid", "");
    return true;
  }

  // Date of joining camp must be after today
  if (name === "dateOfJoiningCamp") {
    if (value === "") {
      setFieldState(name, "invalid", "This field is required");
      return false;
    }
    const joinDate = parseDateInput(value);
    if (joinDate === null || joinDate <= getToday()) {
      setFieldState(name, "invalid", "Invalid field");
      return false;
    }
    setFieldState(name, "valid", "");
    return true;
  }

  // Dropdowns must not be empty
  if (
    name === "nationality" ||
    name === "maritalStatus" ||
    name === "settlementCamp"
  ) {
    updateSelectPlaceholderStyle(fields[name]);
    if (value === "") {
      setFieldState(name, "invalid", "This field is required");
      return false;
    }
    setFieldState(name, "valid", "");
    return true;
  }

  return true;
}

// Validate all fields at once
function validateAll() {
  const names = Object.keys(fields);
  let allValid = true;

  for (let i = 0; i < names.length; i++) {
    const valid = validateField(names[i]);
    if (!valid) allValid = false;
  }
  return allValid;
}

// Clear all validation styles and messages
function clearValidationStyles() {
  for (const name in fields) {
    const group = fields[name].closest(".form-group");
    group.classList.remove("is-valid", "is-invalid");
    document.getElementById("msg-" + name).textContent = "";
  }
}

// Reset form and styles
function resetForm() {
  form.reset();
  clearValidationStyles();
  hasAttemptedSubmit = false;

  for (const name in fields) {
    const el = fields[name];
    if (el.tagName === "SELECT") {
      updateSelectPlaceholderStyle(el);
    }
  }
}

//Live validation
for (const fieldName in fields) {
  const el = fields[fieldName];
  const eventName = el.tagName === "SELECT" ? "change" : "input";

  el.addEventListener(eventName, function () {
    if (el.tagName === "SELECT") {
      updateSelectPlaceholderStyle(el);
    }
    if (hasAttemptedSubmit) {
      validateField(fieldName);
    }
  });
}

// Set dropdown placeholder style correctly on page load
for (const key in fields) {
  const element = fields[key];
  if (element.tagName === "SELECT") {
    updateSelectPlaceholderStyle(element);
  }
}

//  Form submit
form.addEventListener("submit", async function (event) {
  event.preventDefault();
  hasAttemptedSubmit = true;

  const isValid = validateAll();
  if (!isValid) return;

  const genderInput = form.querySelector('input[name="gender"]:checked');

  // Collect form data
  const payload = {
    firstName: fields.firstName.value.trim(),
    lastName: fields.lastName.value.trim(),
    dateOfBirth: parseDateInput(fields.dateOfBirth.value.trim()),
    placeOfBirth: fields.placeOfBirth.value.trim(),
    gender: genderInput ? genderInput.value : "female",
    nationality: fields.nationality.value,
    maritalStatus: fields.maritalStatus.value,
    settlementCamp: fields.settlementCamp.value,
    dateOfJoiningCamp: parseDateInput(fields.dateOfJoiningCamp.value.trim()),
  };

  const submitBtn = form.querySelector(".form-submit-btn");
  submitBtn.disabled = true;

  try {
    // Send data to backend
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      resetForm();
      successAlert.classList.remove("hidden");
    } else if (result.errors) {
      // Show server-side validation errors
      for (const errName in result.errors) {
        if (fields[errName]) {
          setFieldState(errName, "invalid", "Invalid field");
        }
      }
    } else {
      alert(result.message || "Something went wrong. Please try again.");
    }
  } catch (error) {
    alert("Could not reach the server. Please check your connection and try again.");
  } finally {
    submitBtn.disabled = false;
  }
});

// Close success alert
closeAlertBtn.addEventListener("click", function () {
  successAlert.classList.add("hidden");
  resetForm();
});
