import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
const credentialsRouter = Router()

credentialsRouter.route("./")
  .get(authMiddleware,getAllCredentialsOfUser)
  .post(authMiddleware,createCredential)
  .put(authMiddleware,updateCredential)

credentialsRouter.route('./list')
  .get(getAllAvailaibleCredentials)

export default credentialsRouter;