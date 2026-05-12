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

export const createProjectSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  description: z.string().trim().optional(),
  status: z.enum(["active", "archived"]),
});

export type CreateProjectFormData = z.infer<typeof createProjectSchema>;

export const createEventSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  date: z.string().trim().min(1, "Date is required"),
  type: z.string().trim().optional(),
});

export type CreateEventFormData = z.infer<typeof createEventSchema>;

export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(50, "Name must be 50 characters or less"),
  email: z.string().email("Valid email is required").trim().toLowerCase(),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

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

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmNewPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email("Valid email is required").trim().toLowerCase(),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmNewPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
