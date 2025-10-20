import Joi from "joi";

export const createMembershipSchema = Joi.object({
  member_id: Joi.number().integer().positive().required(),
  plan_id: Joi.number().integer().positive().allow(null).optional(),
  start_date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required(),
  price: Joi.number().integer().min(0).required(),
  status: Joi.string()
    .valid("ACTIVE", "EXPIRED", "CANCELLED")
    .default("ACTIVE"),
  notes: Joi.string().max(255).allow(null, "").optional(),
});

export const updateMembershipSchema = Joi.object({
  plan_id: Joi.number().integer().positive().allow(null).optional(),
  start_date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  end_date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  price_cents: Joi.number().integer().min(0).optional(),
  status: Joi.string().valid("ACTIVE", "EXPIRED", "CANCELLED").optional(),
  notes: Joi.string().max(255).allow(null, "").optional(),
});

export const membershipIdSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});
