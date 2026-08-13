import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import TYPES from "../container/types";
import { MenuService } from "../services/MenuService";

@injectable()
export class MenuController {
  constructor(@inject(TYPES.MenuService) private menuService: MenuService) {}

  getMenu = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const menu = await this.menuService.getMenu();
      res.json({ data: menu });
    } catch (err) {
      next(err);
    }
  };

  getMenuItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await this.menuService.getMenuItem(req.params.id);
      res.json({ data: item });
    } catch (err) {
      next(err);
    }
  };
}
