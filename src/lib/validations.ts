import { z } from 'zod';

export const phoneSchema = z.object({
  countryCode: z.string().min(1, 'Country code is required'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').max(15, 'Phone number too long'),
});

export const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits').regex(/^\d{6}$/, 'OTP must contain only numbers'),
});

export const nameSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name too long'),
});

export const chatroomSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
});

export const messageSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty').max(4000, 'Message too long'),
}); 