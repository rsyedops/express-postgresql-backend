import { errorMiddleware } from "#middleware/errorHandler.js";
import { getTagsHandler } from "#modules/articles/controllers.js";
import { articlesRouter } from "#modules/articles/routes.js";
import { AuthRouter } from "#modules/auth/routes.js";
import { profileRouter } from "#modules/profile/routes.js";
import cors from "cors";
import express from "express";
export const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(cors());

app.use("/api/profiles", profileRouter);
app.use("/api/articles", articlesRouter);
app.get("/api/tags", getTagsHandler);
app.use("/api", AuthRouter);

app.use(errorMiddleware);
