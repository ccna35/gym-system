import Joi from "joi";
import { MemberStatus } from "../models/Member";

export const createMemberSchema = Joi.object({
  full_name: Joi.string().max(120).trim().required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .max(191)
    .lowercase()
    .allow(null, "")
    .optional(),
  phone: Joi.string().max(32).allow(null, "").optional(),
  dob: Joi.date().iso().allow(null).optional(),
  emergency_contact: Joi.string().max(120).allow(null, "").optional(),
  medical_notes: Joi.string().max(255).allow(null, "").optional(),
  photo_url: Joi.string().uri().max(255).allow(null, "").optional(),
  status: Joi.string()
    .valid(...(["ACTIVE", "EXPIRED", "SUSPENDED"] as MemberStatus[]))
    .default("ACTIVE"),
});

export const updateMemberSchema = Joi.object({
  full_name: Joi.string().max(120).trim().optional(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .max(191)
    .lowercase()
    .allow(null, "")
    .optional(),
  phone: Joi.string().max(32).allow(null, "").optional(),
  dob: Joi.date().iso().allow(null).optional(),
  emergency_contact: Joi.string().max(120).allow(null, "").optional(),
  medical_notes: Joi.string().max(255).allow(null, "").optional(),
  photo_url: Joi.string().uri().max(255).allow(null, "").optional(),
  status: Joi.string()
    .valid(...(["ACTIVE", "EXPIRED", "SUSPENDED"] as MemberStatus[]))
    .optional(),
});

export const memberIdSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});
