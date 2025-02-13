const { anyError } = require("../responce/error");
const { registerService } = require("../services/student");
const { nameValidation } = require("../utils/validation");

const registerStudent = async (req, res, next) => {
  try {
    const applicatorInfo = req.user;
    const studentname = req.body.name || "";
    const studnetDoB = req.body.dob || "";
    const studentRoll = req.body.roll || "";
    const studentRegistration = req.body.registration || "";
    const studentFatherName = req.body.father_name || "";
    const studentMotherName = req.body.mother_name || "";

    //chek condition for student registration
    //if student registration is valid then register student

    if (
      studentname == "" ||
      studnetDoB == "" ||
      studentRoll == "" ||
      studentRegistration == "" ||
      studentFatherName == "" ||
      studentMotherName == ""
    ) {
      throw anyError({
        message: "Please provide all the required fields like name,dob,roll,registration,father_name,mother_name", 
        status: 400,
      });
    }

    //check student name is valid or not
    if (nameValidation(studentname) == false) {
      throw anyError({
        message: "Please provide valid name only alphabets are allowed",
        status: 400,
      });
    }
    //check student roll or registration is valid or not
    if (isNaN(studentRoll) || isNaN(studentRegistration)) {
      throw anyError({
        message: "Please provide valid roll and registration number",
        status: 400,
      });
    }

    //check student father name or mother name is valid or not
    if (nameValidation(studentFatherName) == false || nameValidation(studentMotherName) == false) {
      throw anyError({
        message: "Please provide valid father name and mother name only alphabets are allowed",
        status: 400,
      });
    }

    //register student

    const responce=await registerService({applicatorInfo,studentname,studnetDoB,studentRoll,studentRegistration,studentFatherName,studentMotherName})
    res.status(responce.status).json(responce)



  } catch (error) {
    next(error);
  }
};



const getStudentbyId = async (req, res, next) => {
  try {

    const studentId = req.params.id;
    console.log(studentId)
    res.status(200).json(studentId)
  } catch (error) {
    next(error);
  }
};
const updateStudentbyId = async (req, res, next) => {
  try {
    console.log(req.user);
  } catch (error) {
    next(error);
  }
};
const deleteStudentbyId = async (req, res, next) => {
  try {
    console.log(req.user);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerStudent,
  getStudentbyId,
  updateStudentbyId,
  deleteStudentbyId,
};
