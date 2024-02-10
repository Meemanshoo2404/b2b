const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
const User = require('../model/users');
const Otp = require('../model/otp');
const PlayStoreApps = require('../model/playstore_apps');
const myFunctions = require('../func/app_status');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;


router.post('/getAllOtps',async(req,res,next) => {

  if (req.body.appId == undefined){
      return res.status(300).json({   status:false, message: 'appId must be provided' });
  } 
  else if(!ObjectId.isValid(req.body.appId)){
      return res.status(300).json({   status:false, message: 'appId must be ObjectId' });
  }

  
  const  expectedKeys = ["appId"];
  // Check for extra fields
  const extraFields = Object.keys(req.body).filter(key => !expectedKeys.includes(key));


  if (extraFields.length > 0) {
      return res.status(300).json({
          status:false,
          msg: 'Invalid fields: ' + extraFields.join(', ') 
      });
  }

  try{
      
      Otp.find({appId: req.body.appId})
      .select('-__v')
      .sort({createdData : -1})
      .then(result => {
          res.status(200).json({
              status:true,
              message: "Date get successfully",
              records: result.length,
              data:result
          });
      }).catch(err=>{
          res.status(500).json({
              status:false,
              message: "Faild to Fetch Otps details",
              error:err
          });
      });

  }catch(e){
      res.status(500).json({
          status:false,
          message: 'Something went wrong', 
          error:err
      });
  }
 

});


router.post('/sendOtp',async (req, res,next) => {

    if(req.body.gmail == undefined){
        return res.status(300).json({   status:false, message: 'gmail must be provided' }); 
    }

    else if(typeof req.body.gmail !== 'string'){
        return res.status(300).json({   status:false, message: 'gmail must be string' });
    }

    const  expectedKeys = ["ip","appId","gmail","mark"];
    // Check for extra fields
    const extraFields = Object.keys(req.body).filter(key => !expectedKeys.includes(key));


    if (extraFields.length > 0) {
        return res.status(300).json({
            status:false,
            msg: 'Invalid fields: ' + extraFields.join(', ') 
        });
    }

try{ 


  let appStatus = await myFunctions.getAppStatus(req);
  if(appStatus.length === 0){
    const existingUser = await User.findOne({appId: req.body.appId,ip: req.body.ip,gmail: req.body.gmail});
    if(existingUser){

      const existingOtp = await Otp.findOne({appId: req.body.appId,ip: req.body.ip,gmail: req.body.gmail});
    
     
      if(existingOtp){

        
        let totalAttepts = existingOtp.attepts;
        let dateTimeString  = existingOtp.dateTime.toString();

        // Convert the dateTimeString to a JavaScript Date object
        const dateTime = new Date(dateTimeString).toISOString().split('T')[0];
   
        // Get the current date as a string in the same format
        const currentDate = new Date().toISOString().split('T')[0];
        if(totalAttepts >= 5 && dateTime.startsWith(currentDate)){
            // to many attepts
              
            return res.status(400).json({ 
              status: false,
              message: 'Too many attepts try again later or tomorrow',

            });
        }
        else{
          let receiveOtp = await sendOtp(req);
        
          Otp.findOneAndUpdate({appId: req.body.appId,ip: req.body.ip,gmail: req.body.gmail},{
            $set:{
              otp: receiveOtp,
              dateTime:new Date(),
              attepts: totalAttepts+1
            }
        }).then(
            result =>{
          
              return res.status(200).json({ 
                status: true,
                message: 'OTP sent successfully. Note that otp is valid for 60 seconds only',
                data:[
                    {
                        otp: receiveOtp,
                        attepts:totalAttepts+1
                    }
                ]
            });

            }
        ).catch(err => {
          return res.status(500).json({
            status:false,
            message: "Faild to send otp.",
            error:err
        });
        });
        }

      }else{

        let receiveOtp = await sendOtp(req);
        const otp = new Otp({
          _id:new mongoose.Types.ObjectId,
            appId: req.body.appId,  
            ip: req.body.ip,  
            gmail: req.body.gmail,
            status: true,
            otp:receiveOtp,
            dateTime: new Date(),
            attepts:1
          });
    
      otp.save().then(
        result =>{
        
          res.status(200).json({ 
            status: true,
            message: 'OTP sent successfully. Note that otp is valid for 60 seconds only',
            data:[
                {
                    otp: receiveOtp,
                    attepts:1
                }
            ]
        });
        }).catch(err=>{
          res.status(500).json({
              status:false,
              message: "Faild to send otp.",
              error:err
          });
      });
      }


    }
    else{
      return res.status(300).json({   status:false, message: "User is not registered. Please register first." });
    }
  }
  else{
    return res.status(300).json({   status:false, message: appStatus });
  }
        

  } catch (err) {
    res.status(500).json({
        status:false,
        message: 'Something went wrong', 
        error:err
    });
}
    
  
  });


router.post('/validateOtp',async (req, res,next) =>{
  
if(req.body.gmail == undefined){
    return res.status(300).json({   status:false, message: 'gmail must be provided' }); 
}
else if(req.body.otp == undefined){
  return res.status(300).json({   status:false, message: 'otp must be provided' }); 
}
else if(typeof req.body.gmail !== 'string'){
    return res.status(300).json({   status:false, message: 'gmail must be string' });
}
else if(typeof req.body.otp !== 'string'){
  return res.status(300).json({   status:false, message: 'otp must be string' });
}

const  expectedKeys = ["ip","appId","gmail","mark","otp"];
// Check for extra fields
const extraFields = Object.keys(req.body).filter(key => !expectedKeys.includes(key));


if (extraFields.length > 0) {
    return res.status(300).json({
        status:false,
        msg: 'Invalid fields: ' + extraFields.join(', ') 
    });
}

try{ 


let appStatus = await myFunctions.getAppStatus(req);
if(appStatus.length === 0){
const existingUser = await User.findOne({appId: req.body.appId,ip: req.body.ip,gmail: req.body.gmail});
if(existingUser){

  const existingOtp = await Otp.findOne({appId: req.body.appId,ip: req.body.ip,gmail: req.body.gmail});

 
  if(existingOtp){

    
    let totalAttepts = existingOtp.attepts;
    let dateTimeString  = existingOtp.dateTime.toString();

    // Convert the dateTimeString to a JavaScript Date object
    const dateTime = new Date(dateTimeString).toISOString().split('T')[0];

    // Get the current date as a string in the same format
    const currentDate = new Date().toISOString().split('T')[0];

    if(isDatetimeGreaterThan2MinutesFromCurrent(dateTimeString)){
      return res.status(400).json({ 
        status: false,
        message: 'OTP expire',
      });
    }
    else{
    
      if(totalAttepts >= 5 && dateTime.startsWith(currentDate)){
        // to many attepts
          
        return res.status(400).json({ 
          status: false,
          message: 'OTP expire',
        });
    }
    else{
    
      if(req.body.otp == existingOtp.otp){
        return res.status(200).json({
          status:true,
          message: 'User Verified Successfully.'
      });
      }
      else{
        return res.status(500).json({
          status:false,
          message: 'Invalid OTP.'
      });
      }
    }
    }

   

  }else{
    return res.status(500).json({
      status:false,
      message: 'OTP not send please resend.'
  });
  }


}
else{
  return res.status(300).json({   status:false, message: "User is not registered. Please register first." });
}
}
else{
return res.status(300).json({   status:false, message: appStatus });
}
    

} catch (err) {
res.status(500).json({
    status:false,
    message: 'Something went wrong', 
    error:err
});
}

});


function isDatetimeGreaterThan2MinutesFromCurrent(datetimeString) {
  // Parse the given datetime string into a Date object
  const parsedDatetime = new Date(datetimeString);

  // Get the current date and time
  const currentDatetime = new Date();

  // Calculate the difference in milliseconds
  const differenceInMilliseconds = currentDatetime - parsedDatetime;


  // Convert milliseconds to minutes
  const differenceInMinutes = differenceInMilliseconds / (1000 * 60);
  // Check if the difference is greater than 2 minutes
  return differenceInMinutes > 2;
}

//   Generate and store OTPs (in-memory for this example)
const otps = new Map();

  async function sendOtp(req){

    let existingApp = await PlayStoreApps.findOne({_id : req.body.appId});

  // Generate a new OTP
  const otp = generateOTP();

  const appName = existingApp.packageName.toUpperCase();
  const companyMail = `${existingApp.packageName}@gmail.com`;
  const companyIcon = existingApp.iconImage;
  const gmail = req.body.gmail;
  
  // Store OTP in memory (you should use a database for a production app)
  otps.set(gmail, otp);

  // Configure email data
  const mailOptions = {
    from: 'boss.meemanshoo.cool@gmail.com',
    to: gmail,
    subject: `${otp} is your ${appName} OTP`,
    html: `
    <div style="background-color: #f0f0f0; padding: 10px; border-radius: 5px; color: black; text-align: center;">
    <div style="display: inline-block; vertical-align: top;">
    <img src="${companyIcon}" alt="Image" style="display: block; width: 100px; height: auto;">
    </div>
    </div>
    <h3>Hi there, please find the one-time password you just requested below:</h3>
    <h1>${otp}</h1><hr style="border-top: 1px solid #ccc; color: #ccc;">
    <h5 style="color: #555;">Note: ${appName} representatives will never ask you for OTP, PIN or any sensitive information.
    Pleaswe do not share this information with anyone outside the ${appName} ecosystem</h5>
    <div style="background-color: #F4CE14; padding: 15px; border-radius: 5px;color: black;">If you
    did not make this request safely ignore this email or reach out us<br>${companyMail}</div>`,
  };

  // Send the email
  await transporter.sendMail(mailOptions, (error) => {
    if (error) {
      return res.status(400).json({ 
          status: true,
          message: 'Error sending OTP',
          });
    }
  });

    return otp;
  }


// Configure nodemailer to send emails (replace with your email provider settings)
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'boss.meemanshoo.cool@gmail.com',
      pass: 'azqx tybk gjqp npzv',
    },
  });

// Generate a new OTP
function generateOTP() {
  return otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
}


module.exports = router;