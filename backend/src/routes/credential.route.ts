import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { createCredential, getAllAvailaibleCredentialForms, getAllCredentialsOfUser, updateCredential } from "../controllers/credential.controller.js";
const credentialsRouter = Router()

credentialsRouter.route("/")
  .get(authMiddleware,getAllCredentialsOfUser)
  .post(authMiddleware,createCredential)
  .put(authMiddleware,updateCredential)

credentialsRouter.route('/list')
  .get(getAllAvailaibleCredentialForms)

export default credentialsRouter;