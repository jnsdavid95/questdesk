import {z} from 'zod';
export const scheduleSchema=z.object({date:z.iso.date(),time:z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).optional(),minutes:z.number().int().min(15).max(1440).default(60)});
export const calendarImportSchema=z.object({id:z.string().min(1).max(100),name:z.string().min(1).max(100),text:z.string().min(1).max(1000000)});
export const calendarSchema=z.object({imports:z.array(calendarImportSchema).max(5).default([]),google:z.object({calendarId:z.string().trim().min(1).max(300),apiKey:z.string().trim().min(1).max(250)}).optional()});
export type Schedule=z.infer<typeof scheduleSchema>;
