const { Schema, model } = require('mongoose');

const resultSchema = new Schema(
  {
    exam_name: {
      type: String,
      required: true,
    },
    student_id: {
      type: Schema.ObjectId,
      ref: 'student',
    },
    exam_year:{
      type:String,
      required:true
    },
    class_name:{
      type:Number,
      required:true
    },
    subjects: [
      {
        name: {
          type: String,
          required: true,
        },
        mark: {
          required: true,
          type: Number,
        },
        code: {
          type: Number,
          required: true,
        },
      },
    ],
    resultAddedBy: {
      type: Schema.ObjectId,
      ref: 'teacher',
    },
    isBan:{
      type:Boolean,
      default:false
    }
  },
 
  { timestamps: true }
);

const resultModel = model('result', resultSchema);
module.exports = resultModel;
