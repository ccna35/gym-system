import Joi from "joi";

export const createPlanSchema = Joi.object({
  name: Joi.string().max(120).trim().required(),
  duration_days: Joi.number().integer().positive().required(),
  price_cents: Joi.number().integer().min(0).required(),
  visit_limit: Joi.number().integer().min(1).optional().allow(null),
  active: Joi.boolean().optional(),
});

export const updatePlanSchema = Joi.object({
  name: Joi.string().max(120).trim().optional(),
  duration_days: Joi.number().integer().positive().optional(),
  price_cents: Joi.number().integer().min(0).optional(),
  visit_limit: Joi.number().integer().min(1).optional().allow(null),
  active: Joi.boolean().optional(),
});

export const planIdSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});
