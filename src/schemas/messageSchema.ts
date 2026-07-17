import * as z from 'zod';

export const messageSchema = z.object({
    contextText : z
    .string()
    .min(6,{message:'Content Must be at least 10 Character'})
    .max(300,{message:'Content must be no longer than 300 character'})
})