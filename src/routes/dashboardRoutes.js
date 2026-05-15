import { Router } from "express";

import { getDashboardSummary } from "../controllers/dashboardController.js";
import { authenticate } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.use(authenticate);
router.get("/summary", asyncHandler(getDashboardSummary));

export default router;
