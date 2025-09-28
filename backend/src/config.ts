import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(3005),
  GEMINI_API_KEY: z.string().min(1, { message: "cant be empty" }),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("erro nas variáveis de ambiente", parsedEnv.error.message);
  throw new Error("variáveis de ambiente inválidas");
}

export const config = parsedEnv.data;
