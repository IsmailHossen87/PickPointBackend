import z from "zod";
import { IsActive, Role } from "./user.interface";

const RoleEnum = z.nativeEnum(Role);
const IsActiveEnum = z.nativeEnum(IsActive);
const AuthProviderSchema = z.object({
  provider: z.enum(["google", "credentials"]),
  providerId: z.string(),
});



export const createUserZodSchema = z.object({
  _id: z.any().optional(),

  name: z
    .string({ invalid_type_error: "Name must be a string" })
    .min(2, { message: "Name is too short. Minimum 2 characters required." })
    .max(50, { message: "Name is too long. Maximum 50 characters allowed." }),

  email: z.string().email({ message: "Invalid email address." }),

  password: z
    .string()
    .regex(/.{8,}/, {
      message: "Password must be at least 8 characters long.",
    })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[0-9]/, {
      message: "Password must contain at least one digit.",
    })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, {
      message: "Password must contain at least one special character.",
    })
    .optional(),

  phone: z
    .string({ invalid_type_error: "Phone number must be a string" })
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
      message:
        "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    })
    .optional(),

  address: z
    .string({ invalid_type_error: "Address must be a string" })
    .max(200, { message: "Address cannot exceed 200 characters." })
    .optional() 
});
export const updateUserZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name must be a string" })
    .min(2, { message: "Name is too short. Minimum 2 characters required." })
    .max(50, { message: "Name is too long. Maximum 50 characters allowed." })
    .optional(),

  password: z
    .string()
    .regex(/.{8,}/, {
      message: "Password must be at least 8 characters long.",
    })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[0-9]/, {
      message: "Password must contain at least one digit.",
    })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, {
      message: "Password must contain at least one special character.",
    })
    .optional(),

  phone: z
    .string({ invalid_type_error: "Phone number must be a string" })
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
      message:
        "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    })
    .optional(),

  address: z
    .string({ invalid_type_error: "Address must be a string" })
    .max(200, { message: "Address cannot exceed 200 characters." })
    .optional(),

  role: z
    .enum(Object.values(Role) as [string])
    .optional(),

  isDeleted: z
    .boolean({ invalid_type_error: "isDeleted must be true or false" })
    .optional(),

  isActive: z
    .enum(Object.values(IsActive) as [string])
    .optional(),

  isVerified: z
    .boolean({ invalid_type_error: "isVerified must be true or false" })
    .optional(),
});
