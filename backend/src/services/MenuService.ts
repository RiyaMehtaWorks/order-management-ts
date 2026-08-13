import { inject, injectable } from "inversify";
import TYPES from "../container/types";
import { IMenuRepository } from "../repositories/interfaces";
import { MenuItem } from "../types";
import { ApiError } from "../utils/ApiError";

@injectable()
export class MenuService {
  constructor(
    @inject(TYPES.MenuRepository) private menuRepository: IMenuRepository
  ) {}

  async getMenu(): Promise<MenuItem[]> {
    return this.menuRepository.findAll();
  }

  async getMenuItem(id: string): Promise<MenuItem> {
    const item = await this.menuRepository.findById(id);
    if (!item) throw ApiError.notFound(`Menu item '${id}' not found.`);
    return item;
  }
}
