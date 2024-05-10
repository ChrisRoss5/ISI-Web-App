import express from "express";
import MessageResponse from "../interfaces/MessageResponse";
import authRoutes from "./auth/auth.routes";
import resourcesRoutes from "./resources/resources.routes";
import usersRoutes from "./users/users.routes";

const router = express.Router();

router.get<{}, MessageResponse>("/", (req, res) => {
  res.json({
    message: "Welcome to API v1!",
  });
});

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/resources", resourcesRoutes);

export default router;
