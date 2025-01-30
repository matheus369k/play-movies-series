// Verificar e validar as variaveis do ambiente
import { z } from "zod";


const schemaEnv = z.object({
  VITE_API_OMDBAPI: z.string().url(),
  VITE_API_OMDBAPI_KEY: z.string().min(4),
});

export const env = schemaEnv.parse(import.meta.env);
