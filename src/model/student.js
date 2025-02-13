const { Schema, model } = require('mongoose');

const studentSchema = new Schema(
  {
    name: {
      required: true,
      type: String,
    },
    date_birth: {
      required: true,
      type: String,
    },
    roll: {
      required: true,
      type: String,
      minlength: 5,
      maxlength: [5,"Roll 5 digit only allowed"],
    },
    registration: {
      required: true,
      type: String,
      minlength: [8,"Registration min 8 digit"],
      maxlength: [8,"Registration max 8 digit"],
    },
    father_name: {
      required: true,
      type: String,
    },
    mother_name: {
      required: true,
      type: String,
    },
    institureName: {
      required: true,
      type: String,
    },
    applicatorId: {
      type: String,
      required: true,
    },
    isBan:{
      type:Boolean,
      default:false
    },
    adminId:{
      type:Schema.ObjectId,
      ref:"admin"
    },
    resultId: [
      {
        //array of result id which is added by teacher or admin
        type: Schema.ObjectId,
        ref: 'result',
      },
    ],
  },
  { timestamps: true }
);

studentSchema.methods.parents=function(val){
  console.log(val)
   return `Your father name ${this.father_name} and mother name is ${this.mother_name} and your name is ${val}`
}

const studentModel = model('student', studentSchema);
module.exports = studentModel;
