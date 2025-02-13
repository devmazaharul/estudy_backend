const adminModel = require("../model/admin");
const resultModel = require("../model/result");
const studentModel = require("../model/student");
const teacherModel = require("../model/teacher");
const { serverError, anyError } = require("../responce/error");
const { successRes } = require("../responce/retuen");

const addResultService = async ({
  studentId,
  exam_name,
  resultAddedBy,
  subjects,
  year,
  className
}) => {
  try {
    const findStudent = await studentModel.findById(studentId);
    if (!findStudent) {
      return {
        message:
          "Student not found plesae provide valid student id or register student first",
        status: 404,
      };
    }

    //remove duplicate student result by exam name
    const findResult = await resultModel.find({
      exam_name,
      student_id: studentId,
    });
    if (findResult.length > 0) {
      return {
        message: "Result already added for this exam name",
        status: 400,
      };
    }

    const addedBy =
      resultAddedBy.role == "admin"
        ? resultAddedBy.id
        : resultAddedBy.role == "teacher"
        ? resultAddedBy.teacherId
        : null;

    if (addedBy == null) {
      return {
        message: "Invalid token",
        status: 401,
      };
    }

    //add result
    const result = new resultModel({
      exam_name,
      student_id: studentId,
      subjects,
      resultAddedBy: addedBy,
      class_name:className,
      exam_year:year
    });

    //update student table with result array
    findStudent.resultId.push(result._id);

    //save result
    await result.save();
    await findStudent.save();

    return successRes({
      message: "Result added successfully",
      status: 200,
      data: {
        student_name: findStudent.name,
        father_name: findStudent.father_name,
        ...result._doc,
      },
    });
  } catch (error) {
    return serverError(error);
  }
};

//deptricated the function block
const getResultsService = async (authInfo) => {
  try {
    let adminID = "";
    let teacherID = "";
    if (authInfo.role == "admin") {
      const getTeacherinfo = await adminModel.findOne({ _id: authInfo.id });
      const teacherlen = getTeacherinfo.teachers.length;
      for (let i = 0; i < teacherlen; i++) {
        const teacherIdDb = getTeacherinfo.teachers[i];
        const getResultbyadminidandteacherid = await studentModel
          .find({
            $or: [{ applicatorId: authInfo.id }, { applicatorId: teacherIdDb }],
          })
          .populate({
            path: "resultId",
            select: "-password -__v",
          });
        if (getResultbyadminidandteacherid.length > 0) {
          return successRes({
            message: "All result here",
            data: getResultbyadminidandteacherid,
          });
        } else {
          return anyError({
            message: "No student and result found",
          });
        }
      }
    } else {
      const allResultswithStudents = await studentModel
        .find({
          $or: [
            { applicatorId: authInfo.adminId },
            { applicatorId: authInfo.teacherId },
          ],
        })
        .populate({
          path: "resultId",
          select: "-password -__v",
        });
      if (allResultswithStudents.length > 0) {
        return successRes({
          message: "All result here",
          data: allResultswithStudents,
        });
      } else {
        return anyError({
          message: "No student and result found",
        });
      }
    }
  } catch (error) {
    return serverError(error);
  }
};

const getStudentswithreusltbyAdminId = async (adminId) => {
  try {
    const data = await studentModel
      .findOne({ adminId: adminId })
      .populate({ path: "resultId", select: "-password -__v" });
    if (!data) {
      return anyError({
        message: "No student info found",
      });
    }

    return successRes({
      message: "Successfully get student info and result",
      data: data,
    });
  } catch (error) {
    return serverError(error);
  }
};

const getResultService = async ({ roll,examname,classname,year }) => {
  try {
    const result = await studentModel
      .findOne({ roll })
      .populate({ path: "resultId", select: "-__v" });
    if (!result) {
      return anyError({
        message: "Invalid cradentials",
      });
    }

    const res = result.resultId.find((item) => {
      if (item.exam_name==examname && item.exam_year==year && item.class_name==classname) {
        return item;
      }
    });

    if (!res) {
      return anyError({
        message: "No result found",
      });
    }

    
    if (res.isBan) {
      return anyError({
        message: "No result fount please contact your teachers",
      });
    }

    return successRes({
      message: "Succefully get result",
      data: {
        ...result._doc,
        resultId: res,
      },
    });
  } catch (error) {
    return serverError(error);
  }
};

const deleteResultservice = async ({ roll, exam_name, admin }) => {
  try {
    const findStudnetbyroll = await studentModel
      .findOne({ roll: roll })
      .populate("resultId");
    if (!findStudnetbyroll) {
      return anyError({
        message: "No student found",
      });
    }

    const findResult = await resultModel.findOne({
      student_id: findStudnetbyroll._id,
      exam_name: exam_name,
    });
    if (!findResult) {
      return anyError({
        message: "No result found this student",
      });
    }
    if (admin.role == "admin") {
      await resultModel.findByIdAndDelete(findResult._id);
      return successRes({
        message: "Successfully delete result",
        data: {
          name_student: findStudnetbyroll.name,
          exam_name: exam_name,
        },
      });
    } else {
      if (findResult.isBan) {
        return successRes({
          message: "Already have delete request this result",
          data: {
            name_student: findStudnetbyroll.name,
            exam_name: exam_name,
            roll: roll,
          },
        });
      }

      findResult.isBan = true;
      await findResult.save();
      return successRes({
        message: "Successfully accept delete request ",
        data: {
          name_student: findStudnetbyroll.name,
          exam_name: exam_name,
          roll,
        },
      });
    }
  } catch (error) {
    return serverError(error);
  }
};

module.exports = {
  addResultService,
  getStudentswithreusltbyAdminId,
  getResultService,
  deleteResultservice,
};
