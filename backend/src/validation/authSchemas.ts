import Joi from "joi";

export const registerSchema = Joi.object({
  tenant_id: Joi.number().integer().positive().required(),
  full_name: Joi.string().max(120).trim().required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .max(191)
    .lowercase()
    .required(),
  phone: Joi.string().max(32).allow(null, "").optional(),
  password: Joi.string().min(8).max(100).required(),
  role_id: Joi.number().integer().positive().required(),
});

export const loginSchema = Joi.object({
  tenant_id: Joi.number().integer().positive().required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .max(191)
    .lowercase()
    .required(),
  password: Joi.string().min(8).max(100).required(),
});
