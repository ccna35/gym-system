import { Router } from "express";
import tenantApplicationRoutes from "../tenantApplicationRoutes";

const v1 = Router();

// Mount feature routers under /api/v1
v1.use("/tenant-applications", tenantApplicationRoutes);

// Version info route
v1.get("/version", (req, res) => {
  res.json({
    success: true,
    version: "v1",
    status: "current",
  });
});

export default v1;
