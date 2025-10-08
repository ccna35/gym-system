import Joi from "joi";
import { TenantApplicationStatus } from "../models/TenantApplication";

const statusValues: TenantApplicationStatus[] = [
  "PENDING_EMAIL",
  "PENDING_REVIEW",
  "APPROVED",
  "REJECTED",
];

export const tenantApplicationCreateSchema = Joi.object({
  gym_name: Joi.string().max(120).trim().required(),
  subdomain: Joi.string()
    .lowercase()
    .pattern(/^[a-z0-9-]+$/)
    .max(63)
    .required()
    .messages({
      "string.pattern.base":
        "subdomain may only contain lowercase letters, numbers and hyphens",
    }),
  owner_name: Joi.string().max(120).trim().required(),
  email: Joi.string().email().max(191).lowercase().required(),
  phone: Joi.string().max(32).allow(null, "").optional(),
});

export const tenantApplicationQuerySchema = Joi.object({
  status: Joi.string()
    .valid(...statusValues)
    .optional(),
});

export const idParamSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

export const tenantApplicationStatusUpdateSchema = Joi.object({
  status: Joi.string()
    .valid(...statusValues)
    .required(),
  review_notes: Joi.string().max(255).allow(null, "").optional(),
});
