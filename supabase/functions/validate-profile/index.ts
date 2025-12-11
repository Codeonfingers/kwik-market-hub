import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid authentication' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { fullName, phone, ghanaCardNumber, avatarUrl } = await req.json();

    const errors: Record<string, string> = {};

    // Validate full name
    if (fullName && (fullName.length < 2 || fullName.length > 100)) {
      errors.fullName = 'Full name must be between 2 and 100 characters';
    }

    // Validate phone number (Ghanaian format)
    if (phone) {
      const phoneRegex = /^0[2-5][0-9]{8}$/;
      if (!phoneRegex.test(phone)) {
        errors.phone = 'Invalid Ghanaian phone number format';
      }
    }

    // Validate Ghana Card number
    if (ghanaCardNumber) {
      const ghanaCardRegex = /^GHA-[0-9]{9}-[0-9]$/;
      if (!ghanaCardRegex.test(ghanaCardNumber)) {
        errors.ghanaCardNumber = 'Invalid Ghana Card format (GHA-XXXXXXXXX-X)';
      }

      // Check if Ghana Card is already used by another user
      const { data: existingProfile } = await supabaseClient
        .from('profiles')
        .select('user_id')
        .eq('ghana_card_number', ghanaCardNumber)
        .neq('user_id', user.id)
        .maybeSingle();

      if (existingProfile) {
        errors.ghanaCardNumber = 'This Ghana Card is already registered to another account';
      }
    }

    // Validate avatar URL
    if (avatarUrl && avatarUrl.length > 0) {
      try {
        new URL(avatarUrl);
      } catch {
        errors.avatarUrl = 'Invalid avatar URL';
      }
    }

    if (Object.keys(errors).length > 0) {
      return new Response(JSON.stringify({ valid: false, errors }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Update the profile
    const updateData: Record<string, any> = {};
    if (fullName !== undefined) updateData.full_name = fullName;
    if (phone !== undefined) updateData.phone = phone;
    if (ghanaCardNumber !== undefined) updateData.ghana_card_number = ghanaCardNumber;
    if (avatarUrl !== undefined) updateData.avatar_url = avatarUrl;

    const { error: updateError } = await supabaseClient
      .from('profiles')
      .update(updateData)
      .eq('user_id', user.id);

    if (updateError) {
      return new Response(JSON.stringify({ error: 'Failed to update profile' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ 
      valid: true, 
      message: 'Profile updated successfully' 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
