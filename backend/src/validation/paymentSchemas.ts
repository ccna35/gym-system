import Joi from "joi";

export const createPaymentSchema = Joi.object({
  membership_id: Joi.number().integer().positive().required(),
  amount: Joi.number().integer().min(0).required(),
  method: Joi.string().valid("CASH").default("CASH"),
  status: Joi.string().valid("PAID", "VOID").default("PAID"),
  notes: Joi.string().max(255).allow(null, "").optional(),
});

export const paymentIdSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

export const paymentsByMembershipSchema = Joi.object({
  membership_id: Joi.number().integer().positive().required(),
});
