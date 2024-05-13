import { Router } from "express";
import { paramsWithIdSchema } from "../../interfaces/ParamsWithId";
import { requireUser, validateRequest } from "../../middlewares";
import * as ResourcesController from "./resources.controllers";
import { resourceSchema } from "./resources.schemas";

const router = Router();

router.get("/", requireUser, ResourcesController.findAll);
router.post(
  "/",
  [requireUser, validateRequest({ body: resourceSchema })],
  ResourcesController.createOne
);
/* router.post(
  "/xml-xsd",
  [requireUser, validateRequestWithXSD],
  ResourcesController.createOne
); */
router.get(
  "/:id",
  [requireUser, validateRequest({ params: paramsWithIdSchema })],
  ResourcesController.findOne
);
router.put(
  "/:id",
  [
    requireUser,
    validateRequest({ params: paramsWithIdSchema, body: resourceSchema }),
  ],
  ResourcesController.updateOne
);

export default router;
