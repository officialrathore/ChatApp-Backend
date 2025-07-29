import express from "express";
const router = express.Router();

import { sendMessage,getMessages } from "../controllers/message.controller.js";
import secureRoute from "../middleware/secureRoute.js";

router.post("/send/:id",secureRoute,sendMessage);
router.get("/get/:id",secureRoute,getMessages);

export default router;