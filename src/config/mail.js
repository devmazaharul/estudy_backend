const {createTransport} =require("nodemailer")


const configureOption={
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: 'work.mazaharul@gmail.com',
      pass: 'kgrluniyojublldh',
    }
}

const mailService=createTransport(configureOption);


const htmlGen=(activationLink='',name="dear")=>`<div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
  <h2 style="color: #4CAF50;">Activate Your Account</h2>
  <p>Hi ${name},</p>
  <p>Thank you for signing up! Please click the button below to activate your account:</p>
  <a href="${activationLink}" style="display: inline-block; margin: 10px 0; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Activate Account</a>
  <p>If the button above doesn't work, copy and paste the following link into your browser:</p>
  <p><a href="${activationLink}" style="color: #4CAF50;">${activationLink}</a></p>
  <hr style="margin: 20px 0;">
  <p style="font-size: 12px; color: #777;">If you did not request this email, you can safely ignore it.</p>
</div>`


  const sendEmail=async({email,sub,name,activationLink})=>{

    const send= await mailService.sendMail({
    from: '"Result" <expertmazaharul@gmail.com>', // Sender address
    to: email, // Recipient address
    subject: sub || 'Successfully send email', // Subject line
    html: htmlGen(activationLink,name), 
    })
    console.log(send.response)
  
    return
   

  }

// mailService.verify((err,_succ)=>{
//     if(err){
//         console.error('Error connecting to email server:', err);
//     }else{
//         console.log('Email server is ready to send messages.');
//     }
// })



module.exports=sendEmail









