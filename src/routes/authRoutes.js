import { Router } from "express";

import { login, me, signup } from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { loginBodySchema, signupBodySchema } from "../validators/authValidators.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.post("/signup", validate({ body: signupBodySchema }), asyncHandler(signup));
router.post("/login", validate({ body: loginBodySchema }), asyncHandler(login));
router.get("/me", authenticate, asyncHandler(me));

export default router;
