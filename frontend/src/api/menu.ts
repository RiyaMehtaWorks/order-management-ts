import { apiClient } from "./client";
import { MenuItem } from "../types";

export async function fetchMenu(): Promise<MenuItem[]> {
  const res = await apiClient.get<{ data: MenuItem[] }>("/api/menu");
  return res.data.data;
}
