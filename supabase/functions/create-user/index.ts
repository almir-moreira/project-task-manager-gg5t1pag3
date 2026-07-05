import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) throw new Error('Missing Authorization header')

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    if (!supabaseUrl) throw new Error('Missing SUPABASE_URL')

    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')
    if (!supabaseAnonKey) throw new Error('Missing SUPABASE_ANON_KEY')

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    })

    // Validate calling user session
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) throw new Error('Unauthorized')

    // Ensure the caller is an Administrator
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || profile?.role !== 'Administrator') {
      throw new Error('User not allowed. Must be an Administrator.')
    }

    const { email, name, role, department } = await req.json()

    if (!email || !name) {
      throw new Error('Email and name are required.')
    }

    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!supabaseServiceKey) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY')

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    // Create user in auth.users
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: 'Skip@Pass',
      email_confirm: true,
      user_metadata: { name },
    })

    if (authError) throw authError

    const newUserId = authData.user.id

    // Insert or update profile information
    const { error: profileUpdateError } = await supabaseAdmin.from('profiles').upsert({
      id: newUserId,
      email,
      name,
      role,
      department: department || null,
    })

    if (profileUpdateError) {
      // Rollback if profile creation failed
      await supabaseAdmin.auth.admin.deleteUser(newUserId)
      throw profileUpdateError
    }

    return new Response(JSON.stringify({ user: authData.user }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
