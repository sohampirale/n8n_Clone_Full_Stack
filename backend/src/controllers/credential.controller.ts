import type { Request, Response } from "express";
import { Credential, CredentialForm } from "../models/credential.model.js";
import ApiResponse from "../lib/ApiResponse.js";
import mongoose from "mongoose";
import User from "../models/user.model.js";
import { resolveSoa } from "dns";

export async function getAllAvailaibleCredentials(req:Request,res:Response){
  try {
    const allCredentials=await CredentialForm.find()
    return res.status(200).json(
      new ApiResponse(true,`All credential forms fetched successfully`)
    )
  } catch (error) {
    return res.status(500).json(
      new ApiResponse(false,`Failed to fetch all the availaible credential forms`)
    )
  }
}

/**Get all credentials of user
 * 1.retrive userData from req.user
 * 2.check if user exists if not reject
 * 3.fetch all Credential where owner :req.user._id
 * 4.return all credentials of user
 */

export async function getAllCredentialsOfUser(req:Request,res:Response){
  try {
    const {_id}=req.user;
    const userId=new mongoose.Types.ObjectId(_id)
    if(!await User.exists({_id:userId})){
      return res.status(404).json(
        new ApiResponse(false,`User does not exists anymore`)
      )
    }
    const allCredentials=await Credential.find({
      owner:userId
    })
    return res.status(200).json(
      new ApiResponse(true,`All user credentials fetched sucessfully`)
    )
  } catch (error) {
    return res.status(500).json(
      new ApiResponse(false,`Failed to retrive all user credentials`)
    )
  }
}

/**Create credential
 * 1.retrive userData from req.user
 * 2.check if user exists
 * 3.retrive credentialFormId from req.body and check if that CredentialForm exists if not rejeect - CredentialForm not found
 * check if credentialForm.publicallyAvailaible==true if not reject
 * 4.retrive data  object from req.body.data
 * 5.check if credentialForm.requiredFields all fields are in the data given by frontend if not reject - all requiredFields are not given by frontend
 * 6.create the credential obj
 */
export async function createCredential(req:Request,res:Response){
  try {
    const {_id} = req.user
    const userId = new mongoose.Types.ObjectId(_id)

    if(! await User.exists({_id:userId})){
      return res.status(404).json(
        new ApiResponse(false,`User does not exist anymore in the database`)
      )
    }
    const {credentialFormId:receivedCredentialFormId,data}=req.body;
    const credentialFormId = new mongoose.Types.ObjectId(receivedCredentialFormId)

    const credentialForm = await CredentialForm.findById(credentialFormId)

    if(!credentialForm){
      return res.status(404).json(
        new ApiResponse(false,`Invalid credentialFormId,credential form not found`)
      )
    } else if(!credentialForm.publicallyAvailaible){
      return res.status(400).json(
        new ApiResponse(false,`Requested credential form currently unavailaible`)
      )
    }
    const requiredFields=credentialForm.requiredFields

    for(let i=0;i<requiredFields.length;i++){
      if(typeof data[requiredFields[i]]!=='string' || !data[requiredFields[i]]){
        return res.status(400).json(
          new ApiResponse(false,`Invalid/Insufficient data provided, ${requiredFields[i]} not found`)
        )
      }
    }
    const credential = await Credential.create({
      credentialFormId,
      owner:userId,
      data,
      authorizedUsers:[]
    })

    return res.status(201).json(
      new ApiResponse(true,`New credential added successfully`,credential)
    )

  } catch (error) {
    return res.status(500).json(
      new ApiResponse(false,`Failed to add the credential`)
    )
  }
}

/**Update credentials
 * 1.retrive credentialId from req.body
 * 2.retrive user from req.user
 * 3.check if user exists
 * 4.fetch the credential from db if not found reject
 * 5.check if req.user._id is the owner of fetched credential if not reject
 * 6.retrive data obj from req.body
 * 7.fetch the credentialForm from credential.credentialFormId 
 * 8.retrive requiredFields from credentialForm
 * 9.check if all the required fields are in the data
 * 10.update credential.data= with obj with only requiredFields given in data obj from frontend
 * 11.update the authorizedUsers if it is given in the req.body and also check all the _ids of users given in authorizedUsers exists in db if not reject
 * 12.await credential.save()
 * 13.return response
 */

export async function updateCredential(req:Request,res:Response){
  try {
    const {credentialId:receivedCredentialId,data,authorizedUsers}=req.body;
    const credentialId= new mongoose.Types.ObjectId(receivedCredentialId)
    const {_id}=req.user;
    const userId= new mongoose.Types.ObjectId(_id)
    
    if(!await User.exists({_id:userId})){
      return res.status(404).json(
        new ApiResponse(false,`User does not exist anymore`)
      )
    }
    const credential = await Credential.findById(credentialId)
    if(!credential){
      return res.status(404).json(
        new ApiResponse(false,`Credential not found with given credentialId`)
      )
    } else if(!credential.owner.equals(userId)){
      return res.status(400).json(
        new ApiResponse(false,`You dont have update access to this credential`)
      )
    }

    if(data){
      const credentialFormId=credential.credentialFormId
      const credentialForm = await CredentialForm.findById(credentialFormId)
      if(!credentialForm){
        return res.status(404).json(
          new ApiResponse(false,`Credential form not found for given credentialId`)
        )
      }
      const requiredFields=credentialForm.requiredFields
      const obj={

      }
      for(let i=0;i<requiredFields.length;i++){
        if(!data[requiredFields[i]] || typeof data[requiredFields[i]] !=='string'){
          return res.status(400).json(
            new ApiResponse(false,`Invalid/Insufficient data provided for the field :  ${requiredFields[i]}`)
          )
        } else {
          obj[requiredFields[i]]=data[requiredFields[i]]
        }
      }
      credential.data=obj
    }

    if(authorizedUsers){
      if(!Array.isArray(authorizedUsers)){
        return res.status(400).json(
          new ApiResponse(false,`Invalid data provided`)
        )
      }
      const authorizedUsersIds=authorizedUsers.map((_id)=>new mongoose.Types.ObjectId(_id))

      const count = await User.countDocuments({ _id: { $in: authorizedUsersIds } });

      if(count!=authorizedUsersIds.length){
        return res.status(404).json(
          new ApiResponse(false,`All requested authorizedUsers do not exist in db anymore`)
        )
      }
      credential.authorizedUsers=authorizedUsersIds
    }

    await credential.save()

    return res.status(201).json(
      new ApiResponse(true,`Credential updated successfully`,credential)
    )

  } catch (error) {
    return res.status(500).json(
      new ApiResponse(false,`Failed to add the credential`)
    )
  }
}