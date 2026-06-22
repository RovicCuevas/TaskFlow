import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ltayspbflzkjwtsakeeb.supabase.co';

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0YXlzcGJmbHprand0c2FrZWViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxMDk2MzAsImV4cCI6MjA5NzY4NTYzMH0.KkOq-iktu23SEz_jPyS9uwcRmkwYe_AtrJMNbppQN9I';

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);