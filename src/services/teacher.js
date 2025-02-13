const jwt = require('jsonwebtoken');
const teacherModel = require('../model/teacher');
const { serverError, anyError } = require('../responce/error');
const { successRes } = require('../responce/retuen');
const { hashSalt, teacherTokenExpireTime } = require('../utils/default');
const bcrypt = require('bcrypt');
const adminModel = require('../model/admin');
const { generateEtag } = require('../utils/Etag');

const registerTeacherService = async ({
  name,
  number,
  password,
  address,
  admin_id,
}) => {
  try {
    //check if teacher already exist
    const checkteacher = await teacherModel.findOne({ number });
    //check if the number is already registered in the admin table
    const checkAdminInfo = await adminModel.findById(admin_id);

    if (checkAdminInfo == null) {
      throw anyError({
        message: 'You are not authorized to register teacher',
        status: 404,
      });
    }

    if (checkAdminInfo && checkAdminInfo.number == number) {
      throw anyError({ message: 'Plese use another number.', status: 400 });
    }
    //if exist then throw error
    if (checkteacher) {
      throw anyError({
        message: 'Teacher already exist',
        status: 400,
      });
    }

    //hash password
    const hashpassword = await bcrypt.hash(password, hashSalt);
    //if not exist then create teacher
    const newTeacher = new teacherModel({
      name,
      number,
      password: hashpassword,
      admin_id: checkAdminInfo._id,
      address,
    });
    //add teacher to admin teacher array
    checkAdminInfo.teachers.push(newTeacher._id);

    //save teacher
    await newTeacher.save();
    await checkAdminInfo.save();

    return successRes({
      message: 'Teacher registration success',
      status: 200,
      data: {
        name: newTeacher.name,
        number: newTeacher.number,
        teacher_id: newTeacher._id,
        address: newTeacher.address,
      },
    });
  } catch (error) {
    return serverError(error);
  }
};

const loginTeacherService = async ({ number, password }) => {
  try {
    const teacher = await teacherModel.findOne({ number });
    if (!teacher)
      throw serverError({ message: 'Teacher not found', status: 404 });
    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch)
      throw serverError({ message: 'Invalid password', status: 400 });
    //if teacher are verified then return the teacher data
    if (!teacher.status)
      throw serverError({ message: 'Teacher not verified', status: 400 });
    //make json web token and return the token
    const tokenObj = {
      teacherId: teacher._id,
      adminId: teacher.admin_id,
      role: 'teacher',
    };

    const token = jwt.sign(tokenObj, process.env.secret_teacher, {
      expiresIn: teacherTokenExpireTime,
    });

    return successRes({
      message: 'Teacher Login success',
      status: 200,
      data: {
        name: teacher.name,
        number: teacher.number,
        address: teacher.address,
        id: teacher._id,
        token: `Bearer ${token}`,
      },
    });
  } catch (error) {
    return serverError(error);
  }
};

const getTeacherservice = async (admininfo) => {
  try {
    const findAdmin = await adminModel
      .findById(admininfo.id)
      .populate({ path: 'teachers', select: '-password' });
    if (!findAdmin) {
      throw anyError({
        message: 'Invalid cradentials',
        status: 404,
      });
    }

    return successRes({
      message:"Successfully get all teacher",
      status:200,
      data:findAdmin.teachers
    })


  } catch (error) {
    return serverError(error);
  }
};

const getTeacherbyidService = async ({ adminInfo, teacherId }) => {
  try {
    const findTeacher = await teacherModel
      .findOne({ _id: teacherId })
      .select('-password');
    if (!findTeacher) {
      throw anyError({
        message: 'Teacher not found',
        status: 404,
      });
    }
    if (findTeacher.admin_id != adminInfo.id) {
      throw anyError({
        message: 'Access denied',
        status: 401,
      });
    }
    return successRes({
      message: 'Teacher found',
      status: 200,
      data: findTeacher,
    });
  } catch (error) {
    return serverError(error);
  }
};

const updateTeacherinfoService = async ({
  updatedNmae,
  updatedAddress,
  adminInfo,
  teacherId,
}) => {
  try {
    //check teacher exist
    const findTeacher = await teacherModel
      .findOne({ _id: teacherId })
      .select('-password');
    //if not exist then throw error
    if (!findTeacher) {
      throw anyError({
        message: 'Teacher not found',
        status: 404,
      });
    }

    //if teacher exist then check the admin id
    if (findTeacher.admin_id != adminInfo.id) {
      throw anyError({
        message: 'Access denied',
        status: 401,
      });
    }

    //if teacher exist then check the update count
    if (findTeacher.updateCount >= findTeacher.maxUpdate) {
      throw anyError({
        message: 'You have reached the maximum update limit',
        status: 400,
      });
    }

    //update teacher data
    findTeacher.name = updatedNmae;
    findTeacher.address = updatedAddress;
    findTeacher.updateCount += 1;
    //save the updated data
    await findTeacher.save();
    return successRes({
      message: 'Teacher info updated',
      status: 200,
      data: findTeacher,
    });
  } catch (error) {
    return serverError(error);
  }
};

const deleteTeacherbyIdService = async ({ adminInfo, teacherId }) => {
  try {
    //check teacher exist
    const findTeacher = await teacherModel
      .findOne({ _id: teacherId })
      .select('-password');
    //if not exist then throw error
    if (!findTeacher) {
      throw anyError({
        message: 'Teacher not found',
        status: 404,
      });
    }

    //if teacher exist then check the admin id
    if (findTeacher.admin_id != adminInfo.id) {
      throw anyError({
        message: 'Access denied',
        status: 401,
      });
    }

    //delete the teacher
    await findTeacher.deleteOne();
    return successRes({
      message: 'Teacher deleted',
      status: 200,
    });
  } catch (error) {
    return serverError(error);
  }
};

const activeTeacherService = async ({ adminInfo, teacherId }) => {
  try {
    //check teacher exist
    const findTeacher = await teacherModel
      .findOne({ _id: teacherId })
      .select('-password');
    //if not exist then throw error
    if (!findTeacher) {
      throw anyError({
        message: 'Teacher not found',
        status: 404,
      });
    }

    //if teacher exist then check the admin id
    if (findTeacher.admin_id != adminInfo.id) {
      throw anyError({
        message: 'Access denied',
        status: 401,
      });
    }

    //if teacher exist then check the teacher status
    if (findTeacher.status) {
      throw anyError({
        message: 'Teacher already active',
        status: 400,
      });
    }

    //active the teacher
    findTeacher.status = true;
    await findTeacher.save();
    return successRes({
      message: 'Teacher active',
      status: 200,
    });
  } catch (error) {
    return serverError(error);
  }
};

module.exports = {
  registerTeacherService,
  loginTeacherService,
  getTeacherservice,
  getTeacherbyidService,
  updateTeacherinfoService,
  deleteTeacherbyIdService,
  activeTeacherService,
};
