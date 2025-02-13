const sendEmail = require("../config/mail");
const { anyError } = require("../responce/error");
const { registerAdmin, loginAdmin } = require("../services/admin");
const { backend_site_url } = require("../utils/default");
const {
  nameValidation,
  emailValidation,
  validatePhoneNumber,
} = require("../utils/validation");

const register = async (req, res, next) => {
  try {
    const name = req.body.name || "";
    const email = req.body.email || "";
    const address = req.body.address || "";
    const password = req.body.password || "";
    const number = req.body.number || "";
    const ins_name = req.body.institute_name || "";
    const ins_address = req.body.institute_address || "";

    if (
      name == "" ||
      email == "" ||
      password == "" ||
      address == "" ||
      number == "" ||
      ins_name == "" ||
      ins_address == ""
    ) {
      throw anyError({
        message: "All field are required name,email,address,number,password,institute_name,institute_address",
        status: 400,
      });
    }

    if (!nameValidation(name)) {
      throw anyError({
        message: "Name Allows only alphabetic characters",
      });
    }

    if (!emailValidation(email)) {
      throw anyError({
        message: "Please provide formatted email address",
      });
    }

    if (validatePhoneNumber(number) == false || number.length !== 11) {
      throw anyError({
        message: "Invalid BD phone number ",
      });
    }

    if (password.length > 5 == false) {
      throw anyError({
        message: "password minimum 6 character ",
      });
    }

    //regostration services
    const responce = await registerAdmin({
      name,
      email,
      address,
      password,
      number,
      ins_name,
      ins_address,
    });

    if (responce.status == 200) {
      res.status(responce.status).json({
        ...responce,
        emailstatus: true,
        activationMsg: "send acctivation link please verify your email",
      });

      //mail services

      // await sendEmail({
      //   email,
      //   sub: "Account activation",
      //   name,
      //   activationLink:
      //     backend_site_url + "/active-account/" + responce?.data.id,
      // });
    } else {
      res.status(responce.status).json(responce);
    }
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const number = req.body.number || "";
    const password = req.body.password || "";
   
    if (number == "" || password == "") {
      throw anyError({
        message: "Number and password are required ",
      });
    }

    if (validatePhoneNumber(number) == false || number.length !== 11) {
      throw anyError({
        message: "Invalid phone number ",
      });
    }

    const responce = await loginAdmin({ number, password });

 if(responce.status==200){
  res.cookie("token", responce.data.token, {
    httpOnly: true,   // JavaScript থেকে access করা যাবে না
    secure: true,     // HTTPS ছাড়া কাজ করবে না
    sameSite: "Strict", // CSRF Protection
    maxAge: 24 * 60 * 60 * 1000 // 1 দিন পর মুছে যাবে
})
 }

    res.status(responce.status).json(responce);
  } catch (error) {
    next(error);
  }
};

const activeaccount = (req, res, next) => {
  try {
    console.log("dkdk")
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  activeaccount,
};
