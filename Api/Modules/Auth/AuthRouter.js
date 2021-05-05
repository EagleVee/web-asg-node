import Express from "express";
import Service from "./AuthService";

import ResponseJSON from "../../../Config/ResponseJSON";
import HTTPException from "../../../Common/HTTPException";
import ErrorHelper from "../../../Common/ErrorHelper";
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

Router.post("/logout", async (req, res) => {
  try {
    const token = req.headers.authorization;
    const data = await Service.logoutToken(token);
    res.status(200).send(ResponseJSON.success(data));
  } catch (err) {
    ErrorHelper.handleError(res, err);
  }
});

Router.get("/token/validate", async (req, res) => {
  try {
    const token = req.headers.authorization;
    const data = await Service.validateToken(token);
    res.status(200).send(ResponseJSON.success(data));
  } catch (err) {
    ErrorHelper.handleError(res, err);
  }
});

Router.get("/me", Service.authentication, async (req, res) => {
  try {
    const token = req.headers.authorization;
    const data = await Service.me(token);
    res.status(200).send(ResponseJSON.success(data));
  } catch (err) {
    ErrorHelper.handleError(res, err);
  }
});

export default Router;
