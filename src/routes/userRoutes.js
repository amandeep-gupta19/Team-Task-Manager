import { Router } from "express";

import { listUsers, updateUserRole } from "../controllers/userController.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { updateRoleBodySchema, userIdParamsSchema } from "../validators/userValidators.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.use(authenticate, authorize("admin"));
router.get("/", asyncHandler(listUsers));
router.patch(
  "/:userId/role",
  validate({ params: userIdParamsSchema, body: updateRoleBodySchema }),
  asyncHandler(updateUserRole)
);

export default router;
