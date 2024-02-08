const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const PlayStoreApps = require('../model/playstore_apps');
const User = require('../model/users');
const myFunctions = require('../func/app_status');


router.post('/getAllUsers',async(req,res,next) => {

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
        
        User.find({appId: req.body.appId})
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

    }catch(e){
        res.status(500).json({
            status:false,
            message: 'Something went wrong', 
            error:err
        });
    }
   

});

router.post('/getProfile',async(req,res,next) => {

    if (req.body.appId == undefined){
        return res.status(300).json({   status:false, message: 'appId must be provided' });
    }
    else if (req.body.ip == undefined){
        return res.status(300).json({   status:false, message: 'ip must be provided' });
    }
    else if (req.body.registedId == undefined){
        return res.status(300).json({   status:false, message: 'registedId must be provided' });
    }
    else if(!ObjectId.isValid(req.body.appId)){
        return res.status(300).json({   status:false, message: 'appId must be ObjectId' });
    } 
    else if(typeof req.body.ip !== 'string'){
        return res.status(300).json({   status:false, message: 'ip must be string' });
    }
    else if(!ObjectId.isValid(req.body.registedId)){
        return res.status(300).json({   status:false, message: 'registedId must be ObjectId' });
    }

    
    const  expectedKeys = ["ip","appId","registedId","mark"];
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
            User.findOne({appId: req.body.appId,ip: req.body.ip,_id: req.body.registedId})
            .select('-__v -appId -ip -updatedData -createdData -_id -password')
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
        }
        else{
            return res.status(300).json({   status:false, message: appStatus });
        }
       

    }catch(e){
        res.status(500).json({
            status:false,
            message: 'Something went wrong', 
            error:err
        });
    }
   

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
        if(appStatus.length === 0){

            const user = new User({
                appId : req.body.appId,
                ip : req.body.ip,
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
          
         const existingUser = await  User.findOne({appId: req.body.appId,gmail : req.body.gmail});

         if(existingUser){
            return res.status(400).json({
                status:false,
                message: existingUser.gmail + ' is already registerd.'
            });
         }
         else{
            user.save().then(
                result =>{
                return res.status(200).json({
                    status:true,
                    msg: result.gmail + " Register Successfully",
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

router.post('/updateUser',async(req,res,next) => {

    if (req.body.appId == undefined){
        return res.status(300).json({   status:false, message: 'appId must be provided' });
    }
    else if (req.body.ip == undefined){
        return res.status(300).json({   status:false, message: 'ip must be provided' });
    }
    else if (req.body.gmail == undefined){
        return res.status(300).json({   status:false, message: 'gmail must be provided' });
    }
    else if(!ObjectId.isValid(req.body.appId)){
        return res.status(300).json({   status:false, message: 'appId must be ObjectId' });
    } 
    else if(typeof req.body.ip !== 'string'){
        return res.status(300).json({   status:false, message: 'ip must be string' });
    }
    else if(typeof req.body.gmail !== 'string'){
        return res.status(300).json({   status:false, message: 'gmail must be string' });
    }
    if (req.body.firstName != undefined){
        if(typeof req.body.firstName !== 'string'){
            return res.status(300).json({   status:false, message: 'firstName must be string' });
        }
    } 
    if (req.body.lastName != undefined){
        if(typeof req.body.lastName !== 'string'){
            return res.status(300).json({   status:false, message: 'lastName must be string' });
        }
    } 
    if (req.body.userName != undefined){
        if(typeof req.body.userName !== 'string'){
            return res.status(300).json({   status:false, message: 'userName must be string' });
        }
    } 
    if (req.body.phoneNo != undefined){
        if(typeof req.body.phoneNo !== 'string'){
            return res.status(300).json({   status:false, message: 'phoneNo must be string' });
        }
    } 
    if (req.body.gender != undefined){
        if(typeof req.body.gender !== 'string'){
            return res.status(300).json({   status:false, message: 'gender must be string' });
        }
    } 
    if (req.body.address != undefined){
        if(typeof req.body.address !== 'string'){
            return res.status(300).json({   status:false, message: 'address must be string' });
        }
    } 
    if (req.body.city != undefined){
        if(typeof req.body.city !== 'string'){
            return res.status(300).json({   status:false, message: 'city must be string' });
        }
    } 
    if (req.body.state != undefined){
        if(typeof req.body.state !== 'string'){
            return res.status(300).json({   status:false, message: 'state must be string' });
        }
    } 
    if (req.body.country != undefined){
        if(typeof req.body.country !== 'string'){
            return res.status(300).json({   status:false, message: 'country must be string' });
        }
    } 
    if (req.body.pin != undefined){
        if(typeof req.body.pin !== 'string'){
            return res.status(300).json({   status:false, message: 'pin must be string' });
        }
    } 
    if (req.body.dob != undefined){
        const dob = new Date(req.body.dob);
        if (isNaN(dob.getTime())) {
            return res.status(300).json({ status:false, message: 'dob must be a date' });
        }    
    } 
    
    const  expectedKeys = ["ip","appId","gmail","firstName", "lastName", "userName", "phoneNo", "gender", "address", "city",
     "state", "country", "pin", "dob","mark"];
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

            const user = await User.findOne({
                $and: [
                  { appId: req.body.appId },
                  { ip: req.body.ip },
                  { gmail: req.body.gmail },
                  // Add more conditions as needed
                ]
              });
         
            if (!user) {
                return res.status(300).json({
                    status:false,
                    msg: 'Invalid user'
                });
            }        
    
             // Update only the non-null fields provided in the request body
            for (const [key, value] of Object.entries(req.body)) {
                if (value !== null) {
                    user[key.replace(/:/g, '')] = value;
                
                }
            }
    
            // Save the updated document
            await user.save().
            then(
                result =>{
                res.status(200).json({
                    status:true,
                    message: "user updated successfully"
                })
                }
            ).
            catch(err => {
                res.status(500).json({
                    status:false,
                    message: 'Failed to upade user', 
                    error: err 
                })
            });
    
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

router.post('/deleteAllUsers',(req,res,next) => {

    
    if (req.body.appId == undefined){
        return res.status(300).json({   status:false, message: 'appId must be provided' });
    } 
    else if(!ObjectId.isValid(req.body.appId)){
        return res.status(300).json({   status:false, message: 'appId must be ObjectId' });
    }

    
    const expectedKeys = ["appId"];
    // Check for extra fields
    const extraFields = Object.keys(req.body).filter(key => !expectedKeys.includes(key));

       
    try{

        User.deleteMany({appId: req.body.appId})
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
                    message: 'Delete unsuccessfully',
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

router.post('/login',async(req,res,next) => {

    if (req.body.appId == undefined){
        return res.status(300).json({   status:false, message: 'appId must be provided' });
    }
    else if (req.body.ip == undefined){
        return res.status(300).json({   status:false, message: 'ip must be provided' });
    }
    else if (req.body.gmail == undefined){
        return res.status(300).json({   status:false, message: 'gmail must be provided' });
    }
    else if (req.body.password == undefined){
        return res.status(300).json({   status:false, message: 'password must be provided' });
    }
    else if(!ObjectId.isValid(req.body.appId)){
        return res.status(300).json({   status:false, message: 'appId must be ObjectId' });
    } 
    else if(typeof req.body.ip !== 'string'){
        return res.status(300).json({   status:false, message: 'ip must be string' });
    }
    else if(typeof req.body.gmail !== 'string'){
        return res.status(300).json({   status:false, message: 'gmail must be string' });
    }
    else if(typeof req.body.password !== 'string'){
        return res.status(300).json({   status:false, message: 'password must be string' });
    }

    
    const  expectedKeys = ["ip","appId","gmail","mark","password"];
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
            User.findOne({appId: req.body.appId,ip: req.body.ip,gmail: req.body.gmail})
            .select('password')
            .then(result => {
                if(result.password === req.body.password){
                    //password match
                    res.status(200).json({
                        status:true,
                        message: "Login Successfully",
                        data: [
                            {
                                "id": result._id
                            }
                        ]
                    });
                }
                else{
                    // password not match
                    res.status(200).json({
                        status:true,
                        message: "Login failed due to incorrect password. Please verify password again."
                    });
                }
               
            }).catch(err=>{
                res.status(500).json({
                    status:false,
                    message: "Faild to Fetch PlayStoreApps details",
                    error:err
                });
            });
        }
        else{
            return res.status(300).json({   status:false, message: appStatus });
        }
       

    }catch(e){
        res.status(500).json({
            status:false,
            message: 'Something went wrong', 
            error:err
        });
    }
   

});



module.exports = router;