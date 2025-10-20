import { Router } from "express";
import tenantApplicationRoutes from "../tenantApplication.routes";
import authRoutes from "../auth.routes";
import memberRoutes from "../member.routes";
import dashboardRoutes from "../dashboard.routes";
import planRoutes from "../plan.routes";
import membershipRoutes from "../membership.routes";
import paymentRoutes from "../payment.routes";

const v1 = Router();

// Mount feature routers under /api/v1
v1.use("/tenant-applications", tenantApplicationRoutes);
v1.use("/auth", authRoutes);
v1.use("/members", memberRoutes);
v1.use("/dashboard", dashboardRoutes);
v1.use("/plans", planRoutes);
v1.use("/memberships", membershipRoutes);
v1.use("/payments", paymentRoutes);

// Version info route
v1.get("/version", (req, res) => {
  res.json({
    success: true,
    version: "v1",
    status: "current",
  });
});

export default v1;
