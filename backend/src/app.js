import express from "express";
import cors from "cors";
import collectionRoutes from "./routes/collection.routes.js";
import apiRoutes from "./routes/api.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";



const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/request", apiRoutes);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1/collections", collectionRoutes);
// after all routes
app.use(errorHandler);

export default app;