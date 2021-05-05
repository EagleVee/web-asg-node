import Express from "express";
import ErrorHelper from "../../../Common/ErrorHelper";
import ResponseJSON from "../../../Config/ResponseJSON";
import Service from "./AuthService";

const Router = Express.Router();

Router.post("/register", async function (req, res) {
  try {
    const data = await Service.register(req.body);
    res.status(200).send(ResponseJSON.success(data));
  } catch (err) {
    ErrorHelper.handleError(res, err);
  }
});

Router.post("/login", async function (req, res) {
  try {
    const data = await Service.login(req.body);
    res.status(200).send(ResponseJSON.success(data));
  } catch (err) {
    ErrorHelper.handleError(res, err);
  }
});

Router.post("/token/refresh", async (req, res) => {
  try {
    const token = req.headers.authorization;
    const data = await Service.refreshToken(token);
    res.status(200).send(ResponseJSON.success(data));
  } catch (err) {
    ErrorHelper.handleError(res, err);
  }
});
