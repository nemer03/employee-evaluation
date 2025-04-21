// src/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rsufdvbpqgwcqmxpntti.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzdWZkdmJwcWd3Y3FteHBudHRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNTQzMTYsImV4cCI6MjA2MDgzMDMxNn0.JDpErYOViqpuSHmHfj7lmlv8O8_-HgwGxgiKsJx27Zk'

export const supabase = createClient(supabaseUrl, supabaseKey)
