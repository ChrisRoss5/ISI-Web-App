import express from "express";
import MessageResponse from "../interfaces/MessageResponse";
import authRoutes from "./auth/auth.routes";
import tasksRoutes from "./tasks/tasks.routes";
import usersRoutes from "./users/users.routes";

const router = express.Router();

router.get<{}, MessageResponse>("/", (req, res) => {
  res.json({
    message: "Welcome to the API v1!",
  });
});

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/tasks", tasksRoutes);

export default router;
