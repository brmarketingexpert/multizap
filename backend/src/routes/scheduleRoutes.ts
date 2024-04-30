import express from "express";
import isAuth from "../middleware/isAuth";
import tokenAuth from "../middleware/tokenAuth"; // Importação do middleware tokenAuth
import * as ScheduleController from "../controllers/ScheduleController";

const scheduleRoutes = express.Router();

// Alteração da rota para utilizar tokenAuth em vez de isAuth
scheduleRoutes.post("/schedules", tokenAuth, ScheduleController.store); // Utiliza tokenAuth

// Mantendo as outras rotas como estavam, utilizando isAuth
scheduleRoutes.get("/schedules", isAuth, ScheduleController.index);
scheduleRoutes.put("/schedules/:scheduleId", isAuth, ScheduleController.update);
scheduleRoutes.get("/schedules/:scheduleId", isAuth, ScheduleController.show);
scheduleRoutes.delete("/schedules/:scheduleId", isAuth, ScheduleController.remove);
scheduleRoutes.post("/schedules/:id/media-upload", isAuth, ScheduleController.mediaUpload);
scheduleRoutes.delete("/schedules/:id/media-upload", isAuth, ScheduleController.deleteMedia);

export default scheduleRoutes;
