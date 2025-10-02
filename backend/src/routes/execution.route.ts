import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { executeManualTrigger, executeWebhookTrigger, telegramWebhook } from "../controllers/execution.controller.js";
const executionInstanceRouter = Router()

executionInstanceRouter.route("/:username/:slug/manual")
    .post(authMiddleware,executeManualTrigger)

executionInstanceRouter.route("/:username/:slug/webhook")
    .post(authMiddleware,executeWebhookTrigger)

executionInstanceRouter.route("/telegram_webhook")
    .post(telegramWebhook)

export default executionInstanceRouter;