const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const PlayStoreApps = require('../model/playstore_apps');


router.post('/getAllPlayStoreApps',(req,res,next) => {

    let query = {};
 
    if (req.body.search != undefined){
        query.packageName = new RegExp(`^${req.body.search}`, 'i');
        if(typeof req.body.search !== 'string'){
            return res.status(300).json({   status:false, message: 'search must be string' });
        }
    } 
    if (req.body.status != undefined){
        query.status = req.body.status;
        if(typeof req.body.status !== 'number'){
            return res.status(300).json({   status:false, message: 'status must be number' });
        }
    } 
    
    const  expectedKeys = ["search","status"];
    // Check for extra fields
    const extraFields = Object.keys(req.body).filter(key => !expectedKeys.includes(key));


    if (extraFields.length > 0) {
        return res.status(300).json({
            status:false,
            msg: 'Invalid fields: ' + extraFields.join(', ') 
        });
    }


    PlayStoreApps.find(query)
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


router.post('/addPlayStoreApp',(req,res,next) => {

    if (req.body.packageName == undefined){
        return res.status(300).json({   status:false, message: 'packageName must be provided' });
    } 
    else if(typeof req.body.packageName !== 'string'){
        return res.status(300).json({   status:false, message: 'packageName must be string' });
    }

    const  expectedKeys = ["packageName"];
    // Check for extra fields
    const extraFields = Object.keys(req.body).filter(key => !expectedKeys.includes(key));


    if (extraFields.length > 0) {
        return res.status(300).json({
            status:false,
            msg: 'Invalid fields: ' + extraFields.join(', ') 
        });
    }

    
    try{

        const d = new Date(0);
        console.log(d);

        const playStoreApps = new PlayStoreApps({
            packageName: req.body.packageName
      });
      
      playStoreApps.save().then(
          result =>{
          res.status(200).json({
              status:true,
              msg: result.packageName + " App Successfully Saved",
              data:[
                  {
                      id: result._id
                  }
              ]
          })
          }
      ).catch(err => {
          res.status(500).json({
              status:false,
              message: 'Failed to add app due to ' + Object.keys(err.keyPattern)[0] + ' is already exist', 
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

router.post('/updatePlayStoreApp',async(req,res,next) => {

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

router.post('/changeStatusPlayStoreApp',async(req,res,next) => {

    if (req.body.appId == undefined){
        return res.status(300).json({   status:false, message: 'appId must be provided' });
    }
    else if (req.body.status == undefined){
        return res.status(300).json({   status:false, message: 'status must be provided' });
    }
    else if (req.body.isIpAllowed == undefined){
        return res.status(300).json({   status:false, message: 'isIpAllowed must be provided' });
    }
    else if (req.body.ipCap == undefined){
        return res.status(300).json({   status:false, message: 'ipCap must be provided' });
    }
    else if(!ObjectId.isValid(req.body.appId)){
        return res.status(300).json({   status:false, message: 'appId must be Object' });
    }
    else if(typeof req.body.status !== 'number'){
        return res.status(300).json({   status:false, message: 'status must be number' });
    }
    else if(typeof req.body.isIpAllowed !== 'boolean'){
        return res.status(300).json({   status:false, message: 'isIpAllowed must be boolean' });
    }
    else if(typeof req.body.ipCap !== 'number'){
        return res.status(300).json({   status:false, message: 'ipCap must be number' });
    }


    const  expectedKeys = ["appId","status","isIpAllowed","ipCap"];
    // Check for extra fields
    const extraFields = Object.keys(req.body).filter(key => !expectedKeys.includes(key));


    if (extraFields.length > 0) {
        return res.status(300).json({
            status:false,
            message: 'Invalid fields: ' + extraFields.join(', ') 
        });
    }
    
    try{
        const status = { status: req.body.status , isIpAllowed : req.body.isIpAllowed  , ipCap : req.body.ipCap , updatedData : Date.now()};

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
        else if(req.body.status == -2){
            activationMessage = "App is permanently deleted successfully";
        }

       

        if(activationMessage == ""){
          
            return res.status(400).json({
              status:false,
              message: "Invalid status",
              data : {
                  "-1" : "App deleted",
                  "0" : "App in draft (or Under Maintainance)",
                  "1" : "App published",
                  "-2" : "App permanently deleted"
              } 
          });
        }

        PlayStoreApps.findOneAndUpdate({ _id: req.body.appId }, { $set: status }, { new: true })
        .then((result) => {

            if (!result) {
                // If the resource is not found, return a 200 status code with a message
                return res.status(400).json({
                    status: false,
                    message: 'App not found', 
                });
              }

              return res.status(200).json({
                    status:true,
                    message: activationMessage, 
                });

        
        })
        .catch((err) => {
            return res.status(500).json({
            status:false,
            message: 'Failed to check app existence', 
            error:err
          });
        });

    } catch (err) {
        return res.status(500).json({
            status:false,
            message: 'Something went wrong', 
            error:err
        });
    }

});



module.exports = router;