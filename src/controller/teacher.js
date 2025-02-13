const { anyError } = require('../responce/error');
const { successRes } = require('../responce/retuen');
const {
  registerTeacherService,
  loginTeacherService,
  getTeacherservice,
  getTeacherbyidService,
  updateTeacherinfoService,
  deleteTeacherbyIdService,
  activeTeacherService,
} = require('../services/teacher');
const { nameValidation, validatePhoneNumber } = require('../utils/validation');

const registerTeacher = async (req, res, next) => {
  try {
    const name = req.body.name || '';
    const number = req.body.number || '';
    const password = req.body.password || '';
    const address = req.body.address || '';
    const admin_id = req.user.id || '';

    if (
      name == '' ||
      number == '' ||
      password == '' ||
      address == '' ||
      admin_id == ''
    ) {
      throw anyError({
        message: 'All field are required name,number,password,address',
        status: 400,
      });
    }
    if (!nameValidation(name)) {
      throw anyError({
        message: 'Name Allows only alphabetic characters',
      });
    }
    if (validatePhoneNumber(number) == false || number.length !== 11) {
      throw anyError({
        message: 'Invalid BD phone number ',
      });
    }
    if (password.length > 5 == false) {
      throw anyError({
        message: 'password minimum 6 character ',
      });
    }
    //registration services
    const responce = await registerTeacherService({
      name,
      number,
      password,
      address,
      admin_id,
    });
    res.status(responce.status).json(responce);
  } catch (error) {
    next(error);
  }
};

const loginTeacher = async (req, res, next) => {
  try {
    const number = req.body.number || '';
    const password = req.body.password || '';
    if (number == '' || password == '') {
      throw anyError({
        message: 'All field are required number,password',
        status: 400,
      });
    }
    if (validatePhoneNumber(number) == false || number.length !== 11) {
      throw anyError({
        message: 'Invalid BD phone number ',
      });
    }

    //login services
    const responce = await loginTeacherService({
      number,
      password,
    });
    res.status(responce.status).json(responce);
  } catch (error) {
    next(error);
  }
};

const getTeachers = async (req, res, next) => {
  try {
    const adminInfo = req.user;
    const responce = await getTeacherservice(adminInfo);
    

    res.status(responce.status).json(responce);

  } catch (error) {
    next(error);
  }
};

const getTeacherbyId = async (req, res, next) => {
  try {
    console.log("Hitted")
    const adminInfo = req.user;
    const teacherId = req.params.id;
    if (teacherId == '') {
      throw anyError({
        message: 'Teacher id required',
        status: 400,
      });
    }

    const responce = await getTeacherbyidService({ adminInfo, teacherId });
    res.status(responce.status).json(responce);
  } catch (error) {
    next(error);
  }
};

const updateTeacherinfo = async (req, res, next) => {
  try {
    const adminInfo = req.user;
    const teacherId = req.params.id;
    //teacher can update name,address,
    const updatedNmae = req.body.name || '';
    const updatedAddress = req.body.address || '';

    if (teacherId == '') {
      throw anyError({
        message: 'Teacher id required',
        status: 400,
      });
    }

    if (updatedNmae == '' || updatedAddress == '') {
      throw anyError({
        message: 'All field are required name,address',
        status: 400,
      });
    }

    //check name validation
    if (!nameValidation(updatedNmae)) {
      throw anyError({
        message: 'Name Allows only alphabetic characters',
      });
    }
    //check address validation
    if (updatedAddress.length < 3) {
      throw anyError({
        message: 'Address minimum 3 character',
      });
    }

    const responce = await updateTeacherinfoService({
      updatedNmae,
      updatedAddress,
      adminInfo,
      teacherId,
    });
    res.status(responce.status).json(responce);
  } catch (error) {
    next(error);
  }
};

const deleteTeacherbyId = async (req, res, next) => {
  try {
    const adminInfo = req.user;
    const teacherId = req.params.id;
    if (teacherId == '') {
      throw anyError({
        message: 'Teacher id required',
        status: 400,
      });
    }
    const responce = await deleteTeacherbyIdService({ adminInfo, teacherId });
    res.status(responce.status).json(responce);
  } catch (error) {
    next(error);
  }
};

const activeTeacher = async (req, res, next) => {
  try {
    const adminInfo = req.user;
    const teacherId = req.params.id;
    if (teacherId == '') {
      throw anyError({
        message: 'Teacher id required',
        status: 400,
      });
    }
    const responce = await activeTeacherService({ adminInfo, teacherId });
    res.status(responce.status).json(responce);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerTeacher,
  loginTeacher,
  getTeachers,
  getTeacherbyId,
  updateTeacherinfo,
  deleteTeacherbyId,
  activeTeacher,
};
