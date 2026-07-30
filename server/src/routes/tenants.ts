import { Router } from "express";

import { listTenants } from "../lib/tenant/meta.js";

export const tenantsRouter = Router();

tenantsRouter.get("/tenants", (_req, res) => {
  res.json({ tenants: listTenants() });
});
