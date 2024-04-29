import express from "express";
import isAuth from "../middleware/isAuth";
import tokenAuth from "../middleware/tokenAuth"; // Adicionamos a importação do tokenAuth

import * as TagController from "../controllers/TagController";

const tagRoutes = express.Router();

// Rotas liberadas para acesso sem autenticação
tagRoutes.post("/tags", tokenAuth, TagController.store);
tagRoutes.post("/tags/sync", tokenAuth, TagController.syncTags);

// Rotas protegidas pelo isAuth
tagRoutes.get("/tags/list", isAuth, TagController.list);
tagRoutes.get("/tags", isAuth, TagController.index);
tagRoutes.get("/tags/kanban", isAuth, TagController.kanban);
tagRoutes.put("/tags/:tagId", isAuth, TagController.update);
tagRoutes.get("/tags/:tagId", isAuth, TagController.show);
tagRoutes.delete("/tags/:tagId", isAuth, TagController.remove);

export default tagRoutes;
