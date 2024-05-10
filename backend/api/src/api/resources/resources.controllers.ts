import { Resource } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { ParsedToken } from "../../../typings/token";
import { db } from "../../db";
import { ParamsWithId } from "../../interfaces/ParamsWithId";
import { ResourceInput } from "./resources.schemas";

export async function findAll(
  req: Request,
  res: Response<Resource[]>,
  next: NextFunction
) {
  try {
    const resources = await db.resource.findMany();
    res.json(resources);
  } catch (error) {
    next(error);
  }
}

export async function createOne(
  req: Request<{}, Resource, ResourceInput>,
  res: Response<Resource>,
  next: NextFunction
) {
  try {
    const user: ParsedToken = req.user;

    const resourceData = {
      ...req.body,
      userId: user.userId,
    };

    const resource = await db.resource.create({
      data: resourceData,
    });
    res.status(201).json(resource);
  } catch (error) {
    next(error);
  }
}

export async function findOne(
  req: Request<ParamsWithId, Resource, {}>,
  res: Response<Resource>,
  next: NextFunction
) {
  try {
    const user: ParsedToken = req.user;

    const resource = await db.resource.findUnique({
      where: {
        id: req.params.id,
      },
    });
    if (!resource || resource.userId !== user.userId) {
      res.status(404);
      throw new Error("Resource not found.");
    }

    res.json(resource);
  } catch (error) {
    next(error);
  }
}

export async function updateOne(
  req: Request<ParamsWithId, Resource, ResourceInput>,
  res: Response<Resource>,
  next: NextFunction
) {
  try {
    const user: ParsedToken = req.user;

    const resource = await db.resource.findUnique({
      where: {
        id: req.params.id,
      },
    });
    if (!resource || resource.userId !== user.userId) {
      res.status(404);
      throw new Error("Resource not found.");
    }

    const newResource = await db.resource.update({
      where: { id: req.params.id },
      data: { ...req.body, userId: user.userId },
    });

    res.json(newResource);
  } catch (error) {
    next(error);
  }
}
