import Joi from "joi";

export const tenantCreateSchema = Joi.object({
  name: Joi.string().max(120).trim().required(),
  subdomain: Joi.string()
    .lowercase()
    .pattern(/^[a-z0-9-]+$/)
    .max(63)
    .optional()
    .messages({
      "string.pattern.base":
        "subdomain may only contain lowercase letters, numbers and hyphens",
    }),
  timezone: Joi.string().max(64).trim().optional(),
  currency: Joi.string().max(8).trim().optional(),
  is_active: Joi.boolean().optional(),
});

export const tenantUpdateSchema = Joi.object({
  name: Joi.string().max(120).trim().optional(),
  subdomain: Joi.string()
    .lowercase()
    .pattern(/^[a-z0-9-]+$/)
    .max(63)
    .optional()
    .allow(null)
    .messages({
      "string.pattern.base":
        "subdomain may only contain lowercase letters, numbers and hyphens",
    }),
  timezone: Joi.string().max(64).trim().optional(),
  currency: Joi.string().max(8).trim().optional(),
  is_active: Joi.boolean().optional(),
});
