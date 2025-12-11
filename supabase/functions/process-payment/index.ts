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

    // Get auth token from header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify the user
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid authentication' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { orderId, amount, momoPhone, momoNetwork } = await req.json();

    // Validate required fields
    if (!orderId || !amount || !momoPhone || !momoNetwork) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate phone number format (Ghanaian)
    const phoneRegex = /^0[2-5][0-9]{8}$/;
    if (!phoneRegex.test(momoPhone)) {
      return new Response(JSON.stringify({ error: 'Invalid Ghanaian phone number' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate network
    const validNetworks = ['mtn', 'vodafone', 'airteltigo'];
    if (!validNetworks.includes(momoNetwork)) {
      return new Response(JSON.stringify({ error: 'Invalid mobile money network' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify order exists and belongs to user
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('consumer_id', user.id)
      .single();

    if (orderError || !order) {
      return new Response(JSON.stringify({ error: 'Order not found or access denied' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify amount matches order total
    if (Math.abs(order.total - amount) > 0.01) {
      return new Response(JSON.stringify({ error: 'Amount mismatch' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create payment record
    const { data: payment, error: paymentError } = await supabaseClient
      .from('payments')
      .insert({
        order_id: orderId,
        user_id: user.id,
        amount,
        payment_method: 'momo',
        momo_phone: momoPhone,
        momo_network: momoNetwork,
        status: 'processing',
      })
      .select()
      .single();

    if (paymentError) {
      return new Response(JSON.stringify({ error: 'Failed to create payment' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // MOCK: In production, call actual MoMo API here
    // For now, simulate processing and mark as completed
    const transactionId = `MOMO-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Update payment to completed
    const { error: updatePaymentError } = await supabaseClient
      .from('payments')
      .update({
        status: 'completed',
        transaction_id: transactionId,
      })
      .eq('id', payment.id);

    if (updatePaymentError) {
      return new Response(JSON.stringify({ error: 'Failed to update payment' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Update order status
    await supabaseClient
      .from('orders')
      .update({ status: 'completed' })
      .eq('id', orderId);

    return new Response(JSON.stringify({ 
      success: true, 
      payment: { ...payment, status: 'completed', transaction_id: transactionId },
      message: 'Payment processed successfully'
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
