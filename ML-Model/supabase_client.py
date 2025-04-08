from supabase import create_client, Client

# Replace with your actual Supabase URL and Key
SUPABASE_URL = "https://ygawifernahncaaxketu.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlnYXdpZmVybmFobmNhYXhrZXR1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Mzg2MjQzNCwiZXhwIjoyMDU5NDM4NDM0fQ.sXKUNoK4aKDlya7cxkjVxYMj24bi0onReIH4XyhudBY"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def get_employees_by_project(project_name):
    response = supabase.table("non-shift").select("*").eq("project_title", project_name).execute()
    return response.data if response.data else []
