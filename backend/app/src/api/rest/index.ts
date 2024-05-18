import express from "express";
import MessageResponse from "../../interfaces/MessageResponse";
import checkGeneratedXMLfileAgainstXSDusingJAXB from "../../xml-validators/xsd-jaxb/jaxb";
import authRoutes from "./auth/auth.routes";
import getCurrentTemperature from "./getCurrentTemperature";
import resourcesRoutes from "./resources/resources.routes";
import usersRoutes from "./users/users.routes";

const router = express.Router();

router.get<{}, MessageResponse>("/", (req, res) => {
  res.json({
    message: "Welcome to REST API!",
  });
});

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/resources", resourcesRoutes);

router.get("/check-task-3", checkGeneratedXMLfileAgainstXSDusingJAXB);
router.get("/get-current-temperature", getCurrentTemperature);

export default router;
