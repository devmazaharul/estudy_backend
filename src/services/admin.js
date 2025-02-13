const adminModel = require('../model/admin');
const { anyError, serverError } = require('../responce/error');
const bcrypt = require('bcrypt');
const {
  hashSalt,
  adminTokenExpireTime,
} = require('../utils/default');
const { successRes } = require('../responce/retuen');
const jwt = require('jsonwebtoken');
const teacherModel = require('../model/teacher');
const registerAdmin = async ({
  name,
  email,  
  address,
  password,
  number,
  ins_name,
  ins_address,
}) => {
  try {
    //chek admin email
    const chekAdmin = await adminModel.findOne({
      $or: [{ email: email }, { number: number }],
    });
    if (chekAdmin) {
      return anyError({
        message: 'Admin account already exist',
      });
    }

    const hashPass = await bcrypt.hash(password, hashSalt);

    const newAdmin = new adminModel({
      name,
      email,
      password: hashPass,
      address,
      number,
      institute_name: ins_name,
      institute_address: ins_address,
    });
    await newAdmin.save();
    return successRes({
      message: 'successfully register',
      status: 200,
      data: {
        name,
        email,
        address,
        number,
        id: newAdmin._id,
      },
    });
  } catch (error) {
    return serverError(error);
  }
};

const loginAdmin = async ({ number, password }) => {
  try {
    const chekadmin = await adminModel.findOne({ number });
    if (!chekadmin) throw anyError({ message: 'Invalid cradentials' });

    const comparePassword = await bcrypt.compare(password, chekadmin.password);
    if (!comparePassword) throw anyError({ message: 'Invalid cradentials' });
    if (!chekadmin.staus)
      throw anyError({ message: 'Please verify your account' });

    //genatate json web token and others oparation
    const tokenObject = {
      id: chekadmin._id,
      email: chekadmin.email,
      role: 'admin',
    };

    const genToken = jwt.sign(tokenObject, process.env.secret, {
      expiresIn: adminTokenExpireTime,
    });

    return successRes({
      message: 'Successfully login',
      data: {
        name: chekadmin.name,
        email: chekadmin.email,
        token: `Bearer ${genToken}`,
      },
    });
  } catch (error) {
    return serverError(error);
  }
};

const isActivestatus = async (tokenInfo) => {
  try {
    if (tokenInfo.role == 'admin') {
      const checkAdmin = await adminModel.findById(tokenInfo.id);
      if (!checkAdmin) throw anyError({ message: 'Admin not found' });
      if (!checkAdmin.staus)
        throw anyError({ message: 'Please verify your account' });
      return successRes({ message: 'Your account is active', status: 200 });
    } else if (tokenInfo.role == 'teacher') {
      const checkTeacher = await teacherModel.findById(tokenInfo.teacherId);
      if (!checkTeacher) throw anyError({ message: 'Teacher not found' });
      if (!checkTeacher.status)
        throw anyError({ message: 'Please verify your account' });
      return successRes({ message: 'Your account is active', status: 200 });
    } else {
      throw anyError({ message: 'Invalid token' });
    }
  } catch (error) {
    return serverError(error);
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  isActivestatus,
};
