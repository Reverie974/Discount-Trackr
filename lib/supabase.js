//Imports the createClient function from the Supabase JavaScript library - creates a connection to your Supabase project.
import { createClient } from '@supabase/supabase-js'

//process is a global object provided by Node.js - contains information about the program that's currently running, including environment variables, command-line arguments, and more
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

//Creates a Supabase client using the URL and API key. Exports it so any file in your project can use it.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
