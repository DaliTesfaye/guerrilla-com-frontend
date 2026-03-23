import { z } from "zod";

// Login Schema
export const loginSchema = z.object({
  email: z.string().email("Valid email is required").trim().toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const createAdminSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(50, "Name must be 50 characters or less"),
  email: z.string().email("Valid email is required").trim().toLowerCase(),
  status: z.enum(["active", "inactive"]),
});

export type CreateAdminFormData = z.infer<typeof createAdminSchema>;

// Update User schema - all fields optional but at least one required
export const updateUserSchema = z.object({
  name: z.string().trim().min(1, 'Name must not be empty').max(50, 'Name must be 50 characters or less').optional(),
  email: z.string().email('Invalid email address').optional(),
  status: z.enum(['active', 'inactive']).optional(),
})
.refine(
  (data) => data.name || data.email || data.status,
  { message: 'At least one field must be provided' }
);

export type UpdateUserFormData = z.infer<typeof updateUserSchema>;