const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const PlayStoreApps = require('../model/playstore_apps');
const User = require('../model/users');
const myFunctions = require('../func/app_status');


router.post('/getAllUsers',(req,res,next) => {
   
    User.find()
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
            message: "Faild to Fetch PlayStoreApps details",
            error:err
        });
    });

});


router.post('/register',async (req,res,next) => {
    
    if (req.body.gmail == undefined){
        return res.status(300).json({   status:false, message: 'gmail must be provided' });
    } 
    else if (req.body.password == undefined){
        return res.status(300).json({   status:false, message: 'password must be provided' });
    } 
    else if(typeof req.body.gmail !== 'string'){
        return res.status(300).json({   status:false, message: 'gmail must be string' });
    }
    else if(typeof req.body.password !== 'string'){
        return res.status(300).json({   status:false, message: 'password must be string' });
    }
    else if (req.body.firstName != undefined){
        if(typeof req.body.firstName !== 'string'){
            return res.status(300).json({   status:false, message: 'firstName must be string' });
        }
    } 
    else if (req.body.lastName != undefined){
        if(typeof req.body.lastName !== 'string'){
            return res.status(300).json({   status:false, message: 'lastName must be string' });
        }
    } 
    else if (req.body.userName != undefined){
        if(typeof req.body.userName !== 'string'){
            return res.status(300).json({   status:false, message: 'userName must be string' });
        }
    } 
    else if (req.body.phoneNo != undefined){
        if(typeof req.body.phoneNo !== 'string'){
            return res.status(300).json({   status:false, message: 'phoneNo must be string' });
        }
    } 
    else if (req.body.gender != undefined){
        if(typeof req.body.gender !== 'string'){
            return res.status(300).json({   status:false, message: 'gender must be string' });
        }
    } 
    else if (req.body.address != undefined){
        if(typeof req.body.address !== 'string'){
            return res.status(300).json({   status:false, message: 'address must be string' });
        }
    } 
    else if (req.body.city != undefined){
        if(typeof req.body.city !== 'string'){
            return res.status(300).json({   status:false, message: 'city must be string' });
        }
    } 
    else if (req.body.state != undefined){
        if(typeof req.body.state !== 'string'){
            return res.status(300).json({   status:false, message: 'state must be string' });
        }
    } 
    else if (req.body.country != undefined){
        if(typeof req.body.country !== 'string'){
            return res.status(300).json({   status:false, message: 'country must be string' });
        }
    } 
    else if (req.body.pin != undefined){
        if(typeof req.body.pin !== 'string'){
            return res.status(300).json({   status:false, message: 'pin must be string' });
        }
    } 
    else if (req.body.dob != undefined){
        if(typeof req.body.dob !== 'string'){
            return res.status(300).json({   status:false, message: 'dob must be string' });
        }
    } 

    const  expectedKeys = ["ip","appId","mark","gmail","password"];
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
        // console.log("---"+appStatus);
        if(appStatus.length === 0){

            const user = new User({
                gmail : req.body.gmail,
                firstName : req.body.firstName,
                lastName : req.body.lastName,
                userName : req.body.userName,
                password : req.body.password,
                phoneNo : req.body.phoneNo,
                gender : req.body.gender,
                address : req.body.address,
                city : req.body.city,
                state : req.body.state,
                country : req.body.country,
                pin : req.body.pin,
                dob : req.body.dob
          });
          
         const existingUser = await  User.findOne({gmail : req.body.gmail});

         if(existingUser){
            return res.status(400).json({
                status:false,
                message: 'User is already registerd.'
            });
         }
         else{
            user.save().then(
                result =>{
                return res.status(200).json({
                    status:true,
                    msg: result.gmail + " User Register Successfully",
                    data:[
                      {
                          id: result._id
                      }
                    ]
                })
                }
            ).catch(err => {
                return res.status(500).json({
                    status:false,
                    message: 'Failed to register', 
                    error: err 
                })
            });
  
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

router.post('/updatePlayStoreApp111',async(req,res,next) => {

    if (req.body.appId == undefined){
        return res.status(300).json({   status:false, message: 'appId must be provided' });
    }
    else if(!ObjectId.isValid(req.body.appId)){
        return res.status(300).json({   status:false, message: 'appId must be Object' });
    }
    else if (req.body.categoryType != undefined){
        if(typeof req.body.categoryType !== 'string'){
            return res.status(300).json({   status:false, message: 'categoryType must be string' });
        }
    } 
    else if (req.body.deviceType != undefined){
        if(typeof req.body.deviceType !== 'string'){
            return res.status(300).json({   status:false, message: 'deviceType must be string' });
        }
    } 
    else if (req.body.frontImage != undefined){
        if(typeof req.body.frontImage !== 'string'){
            return res.status(300).json({   status:false, message: 'frontImage must be string' });
        }
    } 
    else if (req.body.iconImage != undefined){
        if(typeof req.body.iconImage !== 'string'){
            return res.status(300).json({   status:false, message: 'iconImage must be string' });
        }
    } 
    else if (req.body.title != undefined){
        if(typeof req.body.title !== 'string'){
            return res.status(300).json({   status:false, message: 'title must be string' });
        }
    } 
    else if (req.body.category != undefined){
        if(typeof req.body.category !== 'string'){
            return res.status(300).json({   status:false, message: 'category must be string' });
        }
    } 

    
    try{
        
        const appToUpdate = await PlayStoreApps.findById(req.body.appId);

        if (!appToUpdate) {
            return res.status(300).json({
                status:false,
                msg: 'Invalid appId'
            });
        }

        

         // Update only the non-null fields provided in the request body
        for (const [key, value] of Object.entries(req.body)) {
            if (value !== null) {
                appToUpdate[key.replace(/:/g, '')] = value;
            
            }
        }

        appToUpdate.updatedData = new Date();

        // Save the updated document
        await appToUpdate.save().
        then(
            result =>{
            res.status(200).json({
                status:true,
                message: "App updated successfully"
            })
            }
        ).
        catch(err => {
            res.status(500).json({
                status:false,
                message: 'Failed to upade', 
                error: err 
            })
        });


    } catch (err) {
        res.status(500).json({
            status:false,
            message: 'Something went wrong', 
            error:err
        });
    }

});

router.post('/changeStatusPlayStoreApp1',async(req,res,next) => {

    if (req.body.appId == undefined){
        return res.status(300).json({   status:false, message: 'appId must be provided' });
    }
    if (req.body.status == undefined){
        return res.status(300).json({   status:false, message: 'status must be provided' });
    }
    else if(!ObjectId.isValid(req.body.appId)){
        return res.status(300).json({   status:false, message: 'appId must be Object' });
    }
    else if(typeof req.body.status !== 'number'){
        return res.status(300).json({   status:false, message: 'status must be number' });
    }


    const  expectedKeys = ["appId","status"];
    // Check for extra fields
    const extraFields = Object.keys(req.body).filter(key => !expectedKeys.includes(key));


    if (extraFields.length > 0) {
        return res.status(300).json({
            status:false,
            message: 'Invalid fields: ' + extraFields.join(', ') 
        });
    }
    
    try{
        const status = { status: req.body.status };

        PlayStoreApps.findOneAndUpdate({ _id: req.body.appId }, { $set: status }, { new: true })
        .then((result) => {

            if (!result) {
                // If the resource is not found, return a 200 status code with a message
                return res.status(400).json({
                    status: false,
                    message: 'App not found', 
                });
              }

              let activationMessage = "";

              if(req.body.status == -1){
                activationMessage = "App is deleted successfully";
              }
              else if(req.body.status == 0){
                activationMessage = "App is send into draft successfully";
              }
              else if(req.body.status == 1){
                activationMessage = "App is published successfully";
              }

             

              if(activationMessage == ""){
                
                res.status(400).json({
                    status:false,
                    message: "Invalid status",
                    data : {
                        "-1" : "App deleted",
                        "0" : "App in draft",
                        "1" : "App published"
                    } 
                });
              }

                res.status(200).json({
                    status:true,
                    message: activationMessage, 
                });

        
        })
        .catch((err) => {
          res.status(500).json({
            status:false,
            message: 'Failed to check app existence', 
            error:err
          });
        });

    } catch (err) {
        res.status(500).json({
            status:false,
            message: 'Something went wrong', 
            error:err
        });
    }

});


router.post('/deleteAllUsers',(req,res,next) => {
       
    try{

        User.deleteMany({})
        .then((result) => {

            if (result.deletedCount > 0) {
                res.status(200).json({
                    status:true,
                    message: "All Ips Deleted Successfully", 
                    records: result.deletedCount
                });
              }
              else{
                res.status(400).json({
                    status: false,
                    message: 'Ip not found',
                });
              }
        
        })
        .catch((err) => {
          res.status(500).json({
            status:false,
            message: 'Failed to check App existence', 
            error:err
          });
        });
        

    } catch (err) {
        res.status(500).json({
            status:false,
            message: 'Something went wrong', 
            error:err
        });
    }
    
});


module.exports = router;