import Express from "express";
import Service from "./ClassService";
import ResponseJSON from "../../../Config/ResponseJSON";
import Upload from "../../Middleware/Multer";

const Router = Express.Router();
Router.get("/", async function(req, res) {
  try {
    const data = await Service.find(req.query);
    res.status(200).send(ResponseJSON.success(data));
  } catch (err) {
    res.status(200).send(ResponseJSON.failed(err.message));
  }
});

Router.get("/:id", async function(req, res) {
  try {
    const data = await Service.findById(req.params.id, req.query);
    res.status(200).send(ResponseJSON.success(data));
  } catch (err) {
    res.status(200).send(ResponseJSON.failed(err.message));
  }
});

Router.post("/", async function(req, res) {
  try {
    const data = await Service.create(req.body);
    res.status(200).send(ResponseJSON.success(data));
  } catch (err) {
    res.status(200).send(ResponseJSON.failed(err.message));
  }
});

Router.put("/:id", async function(req, res) {
  try {
    const data = await Service.update(req.params.id, req.body);
    res.status(200).send(ResponseJSON.success(data));
  } catch (err) {
    res.status(200).send(ResponseJSON.failed(err.message));
  }
});

Router.delete("/:id", async function(req, res) {
  try {
    const data = await Service.deleteByID(req.params.id);
    res.status(200).send(ResponseJSON.success(data));
  } catch (err) {
    res.status(200).send(ResponseJSON.failed(err.message));
  }
});

Router.post("/upload", Upload.single("file"), async function(req, res) {
  try {
    const data = await Service.upload(req);
    res.status(200).send(ResponseJSON.success(data));
  } catch (err) {
    res.status(200).send(ResponseJSON.failed(err.message));
  }
});

export default Router;
