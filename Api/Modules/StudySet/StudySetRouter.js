import Express from "express";
  import Service from "./StudySetService";
  import ResponseJSON from "../../../Config/ResponseJSON";
  import ErrorHelper from "../../../Common/ErrorHelper";
  
  const Router = Express.Router();
  
  Router.get("/", async function(req, res) {
    try {
      const data = await Service.find(req.query);
      res.status(200).send(ResponseJSON.success(data));
    } catch (err) {
      ErrorHelper.handleError(res, err);
    }
  });
  
  Router.get("/:id", async function(req, res) {
    try {
      const data = await Service.findById(req.params.id);
      res.status(200).send(ResponseJSON.success(data));
    } catch (err) {
      ErrorHelper.handleError(res, err);
    }
  });
  
  Router.post("/", async function(req, res) {
    try {
      const data = await Service.create(req.body);
      res.status(200).send(ResponseJSON.success(data));
    } catch (err) {
      ErrorHelper.handleError(res, err);
    }
  });
  
  Router.put("/:id", async function(req, res) {
    try {
      const data = await Service.update(req.params.id, req.body);
      res.status(200).send(ResponseJSON.success(data));
    } catch (err) {
      ErrorHelper.handleError(res, err);
    }
  });
  
  Router.delete("/:id", async function(req, res) {
    try {
      const data = await Service.deleteByID(req.params.id);
      res.status(200).send(ResponseJSON.success(data));
    } catch (err) {
      ErrorHelper.handleError(res, err);
    }
  });
  
  export default Router;