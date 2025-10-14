import { z } from "zod";

export const loginSchema = z.object({
  tenant_id: z.number().int().positive(),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z
  .object({
    tenant_id: z.number().int().positive(),
    full_name: z.string().min(2, "Name must be at least 2 characters").max(120),
    email: z.string().email("Invalid email address"),
    phone: z.string().max(32).optional().or(z.literal("")),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100),
    confirmPassword: z.string(),
    role_id: z.number().int().positive(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const memberSchema = z.object({
  full_name: z.string().min(2, "Name is required").max(120),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().max(32).optional().or(z.literal("")),
  dob: z.string().optional().or(z.literal("")),
  emergency_contact: z.string().max(120).optional().or(z.literal("")),
  medical_notes: z.string().max(255).optional().or(z.literal("")),
  photo_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  status: z.enum(["ACTIVE", "EXPIRED", "SUSPENDED"]),
});

export const planSchema = z.object({
  name: z.string().min(2, "Plan name is required").max(120),
  description: z.string().max(255).optional().or(z.literal("")),
  duration_months: z.number().int().positive("Duration must be positive"),
  price: z.number().positive("Price must be positive"),
});

export const membershipSchema = z
  .object({
    member_id: z.number().int().positive("Select a member"),
    plan_id: z.number().int().positive("Select a plan"),
    start_date: z.string().min(1, "Start date is required"),
    end_date: z.string().min(1, "End date is required"),
    status: z.enum(["ACTIVE", "EXPIRED", "SUSPENDED"]),
  })
  .refine((data) => new Date(data.end_date) > new Date(data.start_date), {
    message: "End date must be after start date",
    path: ["end_date"],
  });

export const paymentSchema = z.object({
  membership_id: z.number().int().positive("Select a membership"),
  amount_cents: z.number().positive("Amount must be positive"),
  payment_date: z.string().min(1, "Payment date is required"),
  payment_method: z.enum(["CASH", "CARD", "BANK_TRANSFER"]),
  notes: z.string().max(255).optional().or(z.literal("")),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type MemberFormData = z.infer<typeof memberSchema>;
export type PlanFormData = z.infer<typeof planSchema>;
export type MembershipFormData = z.infer<typeof membershipSchema>;
export type PaymentFormData = z.infer<typeof paymentSchema>;
