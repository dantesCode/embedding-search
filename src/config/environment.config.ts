export interface EnvironmentConfig {
  OPENAI_API_KEY: string;
  SUPABASE_URL: string;
  SUPABASE_KEY: string;
  NODE_ENV?: string;
  ALLOWED_ORIGINS?: string;
  PORT?: string;
}

export const validateEnvironment = (): EnvironmentConfig => {
  const requiredVars = ['OPENAI_API_KEY', 'SUPABASE_URL', 'SUPABASE_KEY'] as const;
  const missing: string[] = [];

  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  return {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY as string,
    SUPABASE_URL: process.env.SUPABASE_URL as string,
    SUPABASE_KEY: process.env.SUPABASE_KEY as string,
    NODE_ENV: process.env.NODE_ENV || 'development',
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
    PORT: process.env.PORT || '3000',
  };
};
