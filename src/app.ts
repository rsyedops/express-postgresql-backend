import { errorMiddleware } from "#middleware/errorHandler.js";
import { AuthRouter } from "#modules/auth/routes.js";
import cors from "cors";
import express, { json } from "express";
export const app = express();

app.use(json());
app.use(cors());

app.use("/api", AuthRouter);

app.use(errorMiddleware);
