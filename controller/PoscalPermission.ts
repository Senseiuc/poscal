import { Request, Response } from "express";
import PoscalBaseController from "./PoscalBaseController";
import { db } from "../utils/db.server";

class PoscalPermission extends PoscalBaseController {
  constructor() {
    super();
  }

  async getAll(req: Request, res: Response) {
    try {
      const permissions = await db.permission.findMany();
      return res.status(200).json(permissions);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to fetch permissions" });
    }
  }
}

export default PoscalPermission;

