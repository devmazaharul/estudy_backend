const adminModel = require("../model/admin");
const studentModel = require("../model/student");
const { serverError, anyError } = require("../responce/error");
const { successRes } = require("../responce/retuen");

const registerService = async ({
  applicatorInfo,
  studentname,
  studnetDoB,
  studentRoll,
  studentRegistration,
  studentFatherName,
  studentMotherName,
}) => {
  try {
    //find student by roll or registration
    const findStudentbyrollandreg = await studentModel.findOne({
      $or: [{ roll: studentRoll }, { registration: studentRegistration }],
    });

    const makeAdminid =
      applicatorInfo.role == "admin"
        ? applicatorInfo.id
        : applicatorInfo.adminId;

    const findAdminbyId = await adminModel.findOne({ _id: makeAdminid });

    if (!findAdminbyId) {
      return anyError({
        message: "Admin not found",
        status: 404,
      });
    }

    if (findStudentbyrollandreg) {
      return anyError({
        message:
          "Student already exist with this roll number or registration number",
        status: 404,
      });
    }
    //register student
    const registerStudent = new studentModel({
      name: studentname,
      date_birth: studnetDoB,
      roll: studentRoll,
      registration: studentRegistration,
      father_name: studentFatherName,
      mother_name: studentMotherName,
      applicatorId: makeAdminid,
      adminId: findAdminbyId._id,
      institureName: findAdminbyId.institute_name,
    });
    //save student
    const saveStudent = await registerStudent.save();
    if (saveStudent) {
      return successRes({
        message: "Student register successfully",
        status: 200,
        data: {
          name: saveStudent.name,
          date_birth: saveStudent.date_birth,
          roll: saveStudent.roll,
          registration: saveStudent.registration,
          id: saveStudent._id,
        },
      });
    }
  } catch (error) {
    throw serverError(error);
  }
};

module.exports = {
  registerService,
};
