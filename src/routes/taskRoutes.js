import { Router } from "express";

import {
  createTask,
  deleteTask,
  getTaskById,
  listTasks,
  updateTask
} from "../controllers/taskController.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  createTaskBodySchema,
  taskIdParamsSchema,
  taskQuerySchema,
  updateTaskBodySchema
} from "../validators/taskValidators.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.use(authenticate);
router.get("/", validate({ query: taskQuerySchema }), asyncHandler(listTasks));
router.get("/:taskId", validate({ params: taskIdParamsSchema }), asyncHandler(getTaskById));
router.post(
  "/",
  authorize("admin"),
  validate({ body: createTaskBodySchema }),
  asyncHandler(createTask)
);
router.patch(
  "/:taskId",
  validate({ params: taskIdParamsSchema, body: updateTaskBodySchema }),
  asyncHandler(updateTask)
);
router.delete(
  "/:taskId",
  authorize("admin"),
  validate({ params: taskIdParamsSchema }),
  asyncHandler(deleteTask)
);

export default router;
