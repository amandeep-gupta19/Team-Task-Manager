import { Router } from "express";

import {
  createProject,
  deleteProject,
  getProjectById,
  listProjects,
  updateProject
} from "../controllers/projectController.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  createProjectBodySchema,
  projectIdParamsSchema,
  updateProjectBodySchema
} from "../validators/projectValidators.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.use(authenticate);
router.get("/", asyncHandler(listProjects));
router.get("/:projectId", validate({ params: projectIdParamsSchema }), asyncHandler(getProjectById));
router.post(
  "/",
  authorize("admin"),
  validate({ body: createProjectBodySchema }),
  asyncHandler(createProject)
);
router.patch(
  "/:projectId",
  authorize("admin"),
  validate({ params: projectIdParamsSchema, body: updateProjectBodySchema }),
  asyncHandler(updateProject)
);
router.delete(
  "/:projectId",
  authorize("admin"),
  validate({ params: projectIdParamsSchema }),
  asyncHandler(deleteProject)
);

export default router;
