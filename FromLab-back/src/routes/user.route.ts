import { Router } from "express";
import { prisma } from "../../lib/prisma";
import { UserController } from "../controllers/user.controller";

const userRouter = Router();

userRouter.post("/", UserController.createUser);

export default userRouter;