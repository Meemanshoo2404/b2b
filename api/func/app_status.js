
const ValidateIP = require('../model/validate_ip');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const PlayStoreApps = require('../model/playstore_apps');

async function getAppStatus(req){

    if (req.body.appId == undefined){
        return 'appId must be provided';
    } 
    else if (req.body.ip == undefined){
        return 'ip must be provided';
    } 
    else if (req.body.mark == undefined){
        return 'mark must be provided';
    } 
    else if(!ObjectId.isValid(req.body.appId)){
        return 'appId must be object';
    }
    else if(typeof req.body.appId !== 'string'){
        return 'appId must be string';
    }
    else if(typeof req.body.mark !== 'string'){
        return 'mark must be string';
    }

    const result = await PlayStoreApps.findOne({_id:req.body.appId});
    if (result) {
     
        if(result.status == 1){
            // App is published and allow for users 
            
            const existingIP = await ValidateIP.findOne(
                {ip: req.body.ip,appId : req.body.appId}
            );
        
            const cappingLimit = result.ipCap;
            const totalIps = await ValidateIP.find( {appId : req.body.appId}).count();
            if(existingIP){
              
                if(existingIP.isActivated){
                    
                    let apiList = existingIP.apiIsActivated;
                    
                    for(let i = 0 ; i < apiList.length ; i++){
                        if(apiList[i].apiName == req.path){
                            req.body.lastCall = new Date().toISOString();
                            const update = {
                                $push: {
                                [`apiIsActivated.${i}.request`]: req.body
                                }
                            };
                       
                            await ValidateIP.findOneAndUpdate(
                                {ip: req.body.ip,appId : req.body.appId},
                                update,
                                { new: true }
                            );
                           
                            if(apiList[i].apiIsActivated == true){
                                return '';
                            }
                            else{
                                return 'This Service is not allowd to you. Please contact to support team for further details.';
                            }
                        
                        }
                    }

                    // if api not found
                    req.body.lastCall = new Date().toISOString();
                            const update = {
                                $push: {
                                apiIsActivated: {
                                 "apiName": req.path ,
                                 "apiIsActivated" : true,
                                 "request" : [req.body]
                            }
                                }
                            };
                          
                            await ValidateIP.findOneAndUpdate(
                                {ip: req.body.ip,appId : req.body.appId},
                                update,
                                { new: true }
                            );

                            return '';
                }
                else{
                    return existingIP.message;
                }
            }
            else{
                if(cappingLimit == 0 || totalIps < cappingLimit){

                    req.body.lastCall = new Date().toISOString();
                  

                    if(result.isIpAllowed){
                        const validateIP = new ValidateIP({
                            ip: req.body.ip,
                            appId: req.body.appId,
                            isActivated : true,
                            message: "new members are allowed",
                            apiIsActivated: [{
                                 "apiName": req.path ,
                                 "apiIsActivated" : true,
                                 "request" : [req.body]
                            }]
                        });
                        await validateIP.save();
                        return '';
                    }else{
                        const validateIP = new ValidateIP({
                            ip: req.body.ip,
                            appId: req.body.appId,
                            isActivated : false,
                            message: "new members are not allowed",
                            apiIsActivated: [{
                                 "apiName": req.path ,
                                 "apiIsActivated" : true,
                                 "request" : [req.body]
                            }]
                        });
                        
                        await validateIP.save();
                        return "New members are not directly allows to use this app. Please contact to support team for further details.";

                    }
                   
                }
                else{
                    return "Now, New members are not directly allows to use this app. Please contact to support team for further details.";
                }

            
            }          
        }
        else{
            return "App is Under Maintainance";
        }
     
      } else {
        return 'App not found.';
      }
   
}

module.exports = {
    getAppStatus: getAppStatus
  };