import { injectable } from "inversify";
import { IMenuRepository } from "./interfaces";
import { MenuItem } from "../types";
import { MenuItemModel } from "../models/MenuItemModel";

// Used automatically instead of InMemoryMenuRepository when MONGO_URI is set.
@injectable()
export class MongoMenuRepository implements IMenuRepository {
  async findAll(): Promise<MenuItem[]> {
    const docs = await MenuItemModel.find().lean();
    return docs.map(toDomain);
  }

  async findById(id: string): Promise<MenuItem | null> {
    const doc = await MenuItemModel.findOne({ id }).lean();
    return doc ? toDomain(doc) : null;
  }
}

function toDomain(doc: any): MenuItem {
  return {
    id: doc.id,
    name: doc.name,
    description: doc.description,
    price: doc.price,
    image: doc.image,
    category: doc.category,
    available: doc.available
  };
}
