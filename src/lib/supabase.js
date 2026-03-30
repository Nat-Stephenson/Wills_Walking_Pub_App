import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://emabvcqbsuijmohrrhmi.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtYWJ2Y3Fic3Vpam1vaHJyaG1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3MDEwMDIsImV4cCI6MjA5MDI3NzAwMn0.kkl9iKfdSesVVAA3Q_IjurAwJcoWDViNH5trm4cJlbo'

export const supabase = createClient(supabaseUrl, supabaseKey)