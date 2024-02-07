const express = require('express');
const router = express.Router();
const ValidateIP = require('../model/validate_ip');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const myFunctions = require('../func/app_status');

/**
 * @swagger
 * /api/master/getUsers:
 *   post:
 *     tags:
 *     - Master
 *     summary: get all Master Users
 *     description: https://long-boa-sombrero.cyclic.app/api/master/getUsers
 *     responses:
 *       '200': 
 *         description: get all Master Users successful
 */


router.post('/getAllIPs',(req,res,next) => {
    let query = {};

    if (req.body.appId != undefined){
        if(!ObjectId.isValid(req.body.appId)){
            return res.status(300).json({   status:false, message: 'appId must be ObjectId' });
        }
        query = {appId : req.body.appId};
    } 
    else if(req.body.isActivated == undefined && req.body.search == undefined){
        // both are not use
    }
    else if(req.body.isActivated != undefined && req.body.search == undefined){
        // isActivated use
        if(typeof req.body.isActivated !== 'boolean'){
            return res.status(300).json({   status:false, message: 'isActivated must be Boolean' });
        }
        else{
            if(req.body.appId == undefined){
                query = {
                    isActivated : req.body.isActivated};
            }
            else{
                query = {
                    appId : req.body.appId,
                    isActivated : req.body.isActivated};
            }
         
        }
    }
    else if(req.body.isActivated == undefined && req.body.search != undefined){
        // search use
        if(typeof req.body.search !== 'string'){
            return res.status(300).json({   status:false, message: 'search must be string' });
        }
        else{
            if(req.body.appId == undefined){
                query = {
                    ip: { $regex: new RegExp(`^${req.body.search}`, 'i') } };
            }
            else{
                query = {
                    appId : req.body.appId,
                    ip: { $regex: new RegExp(`^${req.body.search}`, 'i') } };
            }
        
        }
        
    }
    else if(req.body.isActivated != undefined && req.body.search != undefined){
        //both are use
        if(typeof req.body.isActivated !== 'boolean'){
            return res.status(300).json({   status:false, message: 'isActivated must be Boolean' });
        }
        else if(typeof req.body.search !== 'string'){
            return res.status(300).json({   status:false, message: 'search must be string' });
        }
        else{
            if(req.body.appId == undefined){
                query = { 
                    isActivated : req.body.isActivated,
                    ip: { $regex: new RegExp(`^${req.body.search}`, 'i') } 
                };
            }
            else{
                query = { 
                    appId : req.body.appId,
                    isActivated : req.body.isActivated,
                    ip: { $regex: new RegExp(`^${req.body.search}`, 'i') } 
                };
            }
           
        }
        
    }

  
    ValidateIP.find(query)
    .select('-__v')
    .sort({uploadDate : -1})
    .then(result => {
        res.status(200).json({
            status:true,
            message: "Date get successfully",
            records: result.length,
            data:result
        });
    }).catch(err=>{
        res.status(500).json({
            status:true,
            message: "Faild to Fetch IPs details",
            error:err
        });
    });
});

router.post('/validate',async(req,res,next) => {
    try{
        let appStatus = await myFunctions.getAppStatus(req);
        if(appStatus.length === 0){
            return res.status(300).json({   status:true, message: "Verified" });
        }
        else{
            return res.status(300).json({   status:false, message: appStatus });
        }
    }catch (err) {
        res.status(500).json({
            status:false,
            message: 'Something went wrong', 
            error:err
        });
    }
   
});



router.post('/changeIPStatus',(req,res,next) => {

    if(req.body.ipId == undefined){
        return res.status(300).json({   status:false, message: 'ipId must be provided'}); 
    }
    else if(req.body.appId == undefined){
        return res.status(300).json({   status:false, message: 'appId must be provided'}); 
    }
    else if(req.body.isActivated  == undefined){
        return res.status(300).json({   status:false, message: 'isActivated must be provided' }); 
    }


    else if(!ObjectId.isValid(req.body.ipId)){
        return res.status(300).json({   status:false, message: 'ipId must be Object' });
    }
    else if(!ObjectId.isValid(req.body.appId)){
        return res.status(300).json({   status:false, message: 'appId must be Object' });
    }
    else if(typeof req.body.isActivated !== 'boolean'){
        return res.status(300).json({   status:false, message: 'isActivated must be Boolean' });
    }
    else if(req.body.message != undefined){
        // isActivated use
        if(typeof req.body.message !== 'string'){
            return res.status(300).json({   status:false, message: 'message must be string' });
        }
    }

    const  expectedKeys = ["ipId","isActivated","appId","message"];
    // Check for extra fields
    const extraFields = Object.keys(req.body).filter(key => !expectedKeys.includes(key));


    if (extraFields.length > 0) {
        return res.status(300).json({
            status:false,
            message: 'Invalid fields: ' + extraFields.join(', ') 
        });
    }
   
  
       
    try{
 
        const message = req.body.message == undefined ? req.body.isActivated ? "Validate Ip Successfully" : "You are Blocked. Please contact to support team for further details" : req.body.message;

        const updateObject = {
            $set: {
              isActivated: req.body.isActivated,
              message: message,
              updateDate: Date.now()
            }
          };
        

        ValidateIP.findOneAndUpdate({ _id: req.body.ipId,appId: req.body.appId }, updateObject , {new: true, })
        .then((result) => {

            if (!result) {
                // If the resource is not found, return a 200 status code with a message
                return res.status(400).json({
                    status: false,
                    message: 'Invalid ipId', 
                });
              }

              const activationMessage = req.body.isActivated ? 'IP is Activated' : 'IP is De-Activated';

                return res.status(200).json({
                    status:true,
                    message: activationMessage
                });

        
        })
        .catch((err) => {
          res.status(500).json({
            status:false,
            message: 'Failed to check IP existence', 
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

router.post('/deleteAllIps',(req,res,next) => {
    let query = {};

    if (req.body.appId != undefined){
        if(!ObjectId.isValid(req.body.appId)){
            return res.status(300).json({   status:false, message: 'appId must be ObjectId' });
        }
        query = {appId : req.body.appId};
    } 
       
    try{

        ValidateIP.deleteMany(query)
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
                    message: 'appId not found'
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