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
  description: z.string().trim().min(1, "Description is required"),
  clientName: z.string().trim().min(1, "Client name is required"),
  status: z.enum(["planned", "active", "completed"]),
  startDate: z.string().trim().min(1, "Start date is required"),
  endDate: z.string().trim().min(1, "End date is required"),
  budget: z
    .number()
    .finite("Budget must be a number")
    .nonnegative("Budget must be positive")
    .optional(),
  image: z.string().url("Image must be a valid URL").optional(),
})
.refine(
  (data) => new Date(data.endDate).getTime() >= new Date(data.startDate).getTime(),
  {
    message: "End date must be after or equal to start date",
    path: ["endDate"],
  }
);

export type CreateProjectFormData = z.infer<typeof createProjectSchema>;

export const updateProjectSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").optional(),
    description: z.string().trim().min(1, "Description is required").optional(),
    clientName: z.string().trim().min(1, "Client name is required").optional(),
    status: z.enum(["planned", "active", "completed"]).optional(),
    startDate: z.string().trim().min(1, "Start date is required").optional(),
    endDate: z.string().trim().min(1, "End date is required").optional(),
    budget: z
      .number()
      .finite("Budget must be a number")
      .nonnegative("Budget must be positive")
      .optional(),
    image: z.string().url("Image must be a valid URL").optional(),
  })
  .refine(
    (data) => {
      if (!data.startDate || !data.endDate) {
        return true;
      }
      return new Date(data.endDate).getTime() >= new Date(data.startDate).getTime();
    },
    {
      message: "End date must be after or equal to start date",
      path: ["endDate"],
    }
  )
  .refine(
    (data) =>
      data.name !== undefined ||
      data.description !== undefined ||
      data.clientName !== undefined ||
      data.status !== undefined ||
      data.startDate !== undefined ||
      data.endDate !== undefined ||
      data.budget !== undefined ||
      data.image !== undefined,
    {
      message: "At least one field must be provided",
      path: ["name"],
    }
  );

export type UpdateProjectFormData = z.infer<typeof updateProjectSchema>;

export const createEventSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  date: z.string().trim().min(1, "Date is required"),
  type: z.string().trim().optional(),
});

export type CreateEventFormData = z.infer<typeof createEventSchema>;

export const eventStatusSchema = z.enum(["draft", "planned", "ongoing", "completed"]);

export const createEventV2Schema = z
  .object({
    title: z.string().trim().min(1, "Title is required"),
    description: z.string().trim().optional(),
    service: z.string().trim().min(1, "Service is required"),
    projectId: z.string().trim().min(1, "Project is required"),
    status: eventStatusSchema,
    date: z.string().trim().min(1, "Date is required"),
    city: z.string().trim().min(1, "City is required"),
    location: z.string().trim().min(1, "Location is required"),
    image: z.string().url("Image must be a valid URL").optional(),
    maxParticipants: z
      .number()
      .int("Max participants must be an integer")
      .min(0, "Max participants must be greater than or equal to 0")
      .optional(),
    hasGame: z.boolean(),
    gameName: z.string().trim().optional(),
  })
  .refine((data) => !data.hasGame || Boolean(data.gameName?.trim()), {
    message: "Game name is required when game mode is enabled",
    path: ["gameName"],
  });

export type CreateEventV2FormData = z.infer<typeof createEventV2Schema>;

export const updateEventV2Schema = z
  .object({
    title: z.string().trim().min(1, "Title is required").optional(),
    description: z.string().trim().optional(),
    service: z.string().trim().min(1, "Service is required").optional(),
    projectId: z.string().trim().min(1, "Project is required").optional(),
    status: eventStatusSchema.optional(),
    date: z.string().trim().min(1, "Date is required").optional(),
    city: z.string().trim().min(1, "City is required").optional(),
    location: z.string().trim().min(1, "Location is required").optional(),
    image: z.string().url("Image must be a valid URL").optional(),
    maxParticipants: z
      .number()
      .int("Max participants must be an integer")
      .min(0, "Max participants must be greater than or equal to 0")
      .optional(),
    hasGame: z.boolean().optional(),
    gameName: z.string().trim().optional(),
  })
  .refine(
    (data) =>
      data.title !== undefined ||
      data.description !== undefined ||
      data.service !== undefined ||
      data.projectId !== undefined ||
      data.status !== undefined ||
      data.date !== undefined ||
      data.city !== undefined ||
      data.location !== undefined ||
      data.image !== undefined ||
      data.maxParticipants !== undefined ||
      data.hasGame !== undefined ||
      data.gameName !== undefined,
    {
      message: "At least one field must be provided",
      path: ["title"],
    }
  )
  .refine(
    (data) => data.hasGame !== true || Boolean(data.gameName?.trim()),
    {
      message: "Game name is required when game mode is enabled",
      path: ["gameName"],
    }
  );

export type UpdateEventV2FormData = z.infer<typeof updateEventV2Schema>;

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
