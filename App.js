import Express from "express";
import BodyParser from "body-parser";
import ExpressFormData from "express-form-data";
import cors from "cors";
import mongoose from "mongoose";
import {
  MONGO_ATLAS_CONNECTION_STRING,
  MONGO_CONNECTION_STRING,
} from "./Config";
import UserRouter from "./Api/Modules/User/UserRouter";
import AuthRouter from "./Api/Modules/Auth/AuthRouter";
import StudySetRouter from "./Api/Modules/StudySet/StudySetRouter";
import CardRouter from "./Api/Modules/Card/CardRouter";
import TestResultRouter from "./Api/Modules/TestResult/TestResultRouter";
import ClassRouter from "./Api/Modules/Class/ClassRouter";
import FolderRouter from "./Api/Modules/Folder/FolderRouter";

export const PORT = process.env.PORT || 5000;
const mongoConnectionString =
  process.env.ENVIRONMENT === "local"
    ? MONGO_CONNECTION_STRING
    : MONGO_CONNECTION_STRING;
mongoose
  .connect(mongoConnectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("CONNECTED TO MONGODB");
  })
  .catch((error) => {
    console.log(error);
  });

const app = Express();
app.use(cors());
// app.use(BodyParser.urlencoded())
app.use(BodyParser.json());
app.use(ExpressFormData.parse());
app.use("/api/user", UserRouter);
app.use("/api/auth", AuthRouter);
app.use("/api/study-set", StudySetRouter);
app.use("/api/card", CardRouter);
app.use("/api/test-result", TestResultRouter);
app.use("/api/class", ClassRouter);
app.use("/api/folder", FolderRouter);

const server = app.listen(PORT, function () {
  console.log(`Server run at localhost:${PORT}`);
});

export default app;
