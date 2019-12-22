import Express from "express";
import BodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import {
  MONGO_ATLAS_CONNECTION_STRING,
  MONGO_CONNECTION_STRING
} from "./Config";
import UserRouter from "./Api/Modules/User/UserRouter";
import AuthRouter from "./Api/Modules/Auth/AuthRouter";
import RoomRouter from "./Api/Modules/ClassStudent/ClassStudentRouter";
import ClassRouter from "./Api/Modules/Class/ClassRouter";
import ShiftRouter from "./Api/Modules/Shift/ShiftRouter";
import ShiftRoomRouter from "./Api/Modules/ShiftRoom/ShiftRoomRouter";

export const PORT = process.env.PORT || 5000;
const mongoConnectionString =
  process.env.ENVIRONMENT === "local"
    ? MONGO_CONNECTION_STRING
    : MONGO_ATLAS_CONNECTION_STRING;
mongoose
  .connect(mongoConnectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("CONNECTED TO MONGODB");
  })
  .catch(error => {
    console.log(error);
  });

const app = Express();
app.use(cors());
// app.use(BodyParser.urlencoded())
app.use(BodyParser.json());
app.use("/api/user", UserRouter);
app.use("/api/auth", AuthRouter);
app.use("/api/room", RoomRouter);
app.use("/api/shift", ShiftRouter);
app.use("/api/shift-room", ShiftRoomRouter);
app.use("/api/class", ClassRouter);

const server = app.listen(PORT, function() {
  console.log(`Server run at localhost:${PORT}`);
});

export default app;
