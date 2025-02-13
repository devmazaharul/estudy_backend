const { register, activeaccount, login } = require("./controller/admin");
const { addResult, getResults, getResult,deleteResultbyroll } = require("./controller/result");
const {
  registerStudent,
  getStudentbyId,
  updateStudentbyId,
  deleteStudentbyId,
} = require("./controller/student");
const {
  registerTeacher,
  loginTeacher,
  getTeachers,
  getTeacherbyId,
  updateTeacherinfo,
  deleteTeacherbyId,
  activeTeacher,
} = require("./controller/teacher");
const { authentication, authorization } = require("./middleware/auth");
const router = require("express").Router();

//admin route
router.post("/admin/register", register);
router.post("/admin/login", login);

//router.post("/admin/active-account/:id",activeaccount)
router
  .route("/admin/:id") //get,update,delete admin
  .get()
  .patch()
  .delete();

//teacher route
router.post("/teachers", authentication, registerTeacher); //register teacher only admin can register teacher

//verify teacher account by admin
router.patch("/teachers/active-account/:id", authentication, activeTeacher);

router.post("/teachers/login", loginTeacher); //login teacher

router.get("/teachers", authentication, getTeachers); //get all teachers

router
  .route("/teachers/:id") //get,update,delete teacher

  .get(authentication, getTeacherbyId) //get teacher by id

  .patch(authentication, updateTeacherinfo) //update teacher

  .delete(authentication, deleteTeacherbyId); //delete teacher

//student router

router.post(
  "/students",
  authentication,
  authorization(["admin", "teacher"]),
  registerStudent
); //register student
router
  .route("/students/:id") //get,update,delete student
  .get(authentication, authorization(["admin", "teacher"]), getStudentbyId) //get student by id
  .patch(authentication, authorization(["admin", "teacher"]), updateStudentbyId) //update student by id
  .delete(
    authentication,
    authorization(["admin", "teacher"]),
    deleteStudentbyId
  ); //delete student

  
//result router
router.post(
  "/results",
  authentication,
  authorization(["admin", "teacher"]),
  addResult
); //add result

router.get(
  "/results",
  authentication,
  authorization(["admin", "teacher"]),
  getResults
); //get all resuls

router.route("/results/:roll")
  .post(getResult)
  .patch(authentication, authorization(["admin", "teacher"])) //only admin can decite final dicitn
  .delete(authentication, authorization(["admin", "teacher"]),deleteResultbyroll); ///only admin can decite final dicitn

module.exports = {
  router,
};
