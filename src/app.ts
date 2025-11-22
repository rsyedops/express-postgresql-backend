import { errorMiddleware } from "#middleware/errorHandler.js";
import { usersRouter } from "#modules/users/users.routes.js";
import cors from "cors";
import express, { json } from "express";
export const app = express();

app.use(json());
app.use(cors());

app.use("/api/users", usersRouter);

app.use(errorMiddleware);
