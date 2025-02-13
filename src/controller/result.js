const { anyError } = require('../responce/error');
const { addResultService, getStudentswithreusltbyAdminId, getResultService, deleteResultservice } = require('../services/result');

const addResult = async (req, res, next) => {
  try {
    const studentId = req.body.studentid || '';
    const className = req.body.classname || '';
    const year = req.body.year || '';
    const exName = req.body.exam_name || '';
    const resultAddedBy = req.user || '';
    const subjects = req.body.subjects || [];
    const exam_name = exName.toLowerCase();
    

    if (studentId == '' || exam_name == '' || subjects.length == 0 || className=="" || year=="") {
      throw anyError({
        message:
          'Please provide all the required fields like studentId,exam_name,subjects,year,classname',
        status: 400,
      });
    }

    //validation subjects all fields are required

    subjects.map((subject) => {
      if (
        !Object.keys(subject).includes('name') ||
        !Object.keys(subject).includes('mark') ||
        !Object.keys(subject).includes('code')
      ) {
        throw anyError({
          message:
            'Please provide all the required fields like name,mark,code' +
            ` empty filed [${subject.name}]`,
          status: 400,
        });
      }
    });
    //validation name mark and code should be required
    subjects.map((subject) => {
      if (subject.name == '' || subject.mark == '' || subject.code == '') {
        throw anyError({
          message: `Please provide all the required fields like name,mark,code.`,
          status: 400,
        });
      }
    });

    //validation  mark and code should be number
    subjects.map((subject) => {
      if (isNaN(subject.mark) || isNaN(subject.code)) {
        throw anyError({
          message: 'Please provide valid mark and code',
          status: 400,
        });
      }
    });

    //add result service
    const responce = await addResultService({
      studentId,
      exam_name,
      resultAddedBy,
      subjects,
      year,
      className
    });
    res.status(responce.status).json(responce);
  } catch (error) {
    console.log(error)
    next(error);
  }
};


const getResults=async(req,res,next)=>{
  try {
    const authorizerInfo=req.user;
    const distractureAdminId=authorizerInfo.role=="admin"?authorizerInfo.id:authorizerInfo.adminId;
    const responce=await getStudentswithreusltbyAdminId(distractureAdminId)
    res.status(responce.status).json(responce)
  } catch (error) {
    next(error)
  }
}




const getResult=async(req,res,next)=>{
  try {
    const roll=req.params.roll || ""
   const examname=req.body.name || ""
   const classname=req.body.classname || ""
   const year=req.body.year || ""


    if(roll =="" || examname=="" || classname=="" || year==""){
      throw anyError({
        message:"Please provide exam name ,roll, year and class name."
      })
    }

    const responce=await getResultService({roll,examname,classname,year})
    res.status(responce.status).json(responce)

  } catch (error) {
    next(error)
  }
}


const deleteResultbyroll=async(req,res,next)=>{
  try {
    const roll=req.params.roll || ""
    const admin=req.user;
    const exam_name=req.body.exam_name || ""
    if(!roll || exam_name==""){
      throw anyError({
        message:"Roll and exam name are required"
      })
    }

const responce=await deleteResultservice({roll,exam_name,admin})
res.status(responce.status).json(responce)

  } catch (error) {
    next(error)
  }
}


module.exports = {
  addResult,
  getResults,
  getResult,
  deleteResultbyroll
};
