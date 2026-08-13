import { injectable } from "inversify";
import { IMenuRepository } from "./interfaces";
import { MenuItem } from "../types";
import { menuData } from "../data/menuData";

// Default repository - zero setup required. Data resets on server restart.
@injectable()
export class InMemoryMenuRepository implements IMenuRepository {
  private items: MenuItem[] = menuData.map((m) => ({ ...m }));

  async findAll(): Promise<MenuItem[]> {
    return this.items;
  }

  async findById(id: string): Promise<MenuItem | null> {
    return this.items.find((m) => m.id === id) ?? null;
  }
}
