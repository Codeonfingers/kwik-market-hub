import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Define valid status transitions per role
const roleStatusTransitions: Record<string, Record<string, string[]>> = {
  consumer: {
    inspecting: ['approved', 'disputed'],
    approved: ['completed'],
  },
  vendor: {
    pending: ['accepted', 'cancelled'],
    accepted: ['preparing'],
    preparing: ['ready'],
  },
  shopper: {
    ready: ['picked_up'],
    picked_up: ['inspecting'],
  },
  admin: {
    // Admins can transition any status
    pending: ['accepted', 'cancelled', 'preparing', 'ready', 'picked_up', 'inspecting', 'approved', 'completed', 'disputed'],
    accepted: ['pending', 'cancelled', 'preparing', 'ready', 'picked_up', 'inspecting', 'approved', 'completed', 'disputed'],
    preparing: ['pending', 'accepted', 'cancelled', 'ready', 'picked_up', 'inspecting', 'approved', 'completed', 'disputed'],
    ready: ['pending', 'accepted', 'cancelled', 'preparing', 'picked_up', 'inspecting', 'approved', 'completed', 'disputed'],
    picked_up: ['pending', 'accepted', 'cancelled', 'preparing', 'ready', 'inspecting', 'approved', 'completed', 'disputed'],
    inspecting: ['pending', 'accepted', 'cancelled', 'preparing', 'ready', 'picked_up', 'approved', 'completed', 'disputed'],
    approved: ['pending', 'accepted', 'cancelled', 'preparing', 'ready', 'picked_up', 'inspecting', 'completed', 'disputed'],
    completed: ['disputed'],
    disputed: ['completed', 'cancelled'],
    cancelled: [],
  },
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

    const { orderId, newStatus } = await req.json();

    if (!orderId || !newStatus) {
      return new Response(JSON.stringify({ error: 'Missing orderId or newStatus' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get current order
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return new Response(JSON.stringify({ error: 'Order not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get user roles
    const { data: userRoles } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    const roles = userRoles?.map(r => r.role) || [];

    // Get vendor and shopper info for access check
    const { data: vendor } = await supabaseClient
      .from('vendors')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    const { data: shopper } = await supabaseClient
      .from('shoppers')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    // Check if user has access to this order
    const isConsumer = order.consumer_id === user.id;
    const isOrderVendor = vendor && order.vendor_id === vendor.id;
    const isOrderShopper = shopper && order.shopper_id === shopper.id;
    const isAdmin = roles.includes('admin');

    if (!isConsumer && !isOrderVendor && !isOrderShopper && !isAdmin) {
      return new Response(JSON.stringify({ error: 'Access denied to this order' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Determine user's effective role for this order
    let effectiveRole = 'consumer';
    if (isAdmin) effectiveRole = 'admin';
    else if (isOrderVendor) effectiveRole = 'vendor';
    else if (isOrderShopper) effectiveRole = 'shopper';

    // Check if transition is allowed
    const allowedTransitions = roleStatusTransitions[effectiveRole]?.[order.status] || [];
    if (!allowedTransitions.includes(newStatus)) {
      return new Response(JSON.stringify({ 
        error: `Status transition from '${order.status}' to '${newStatus}' not allowed for ${effectiveRole}` 
      }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Update order status
    const { error: updateError } = await supabaseClient
      .from('orders')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', orderId);

    if (updateError) {
      return new Response(JSON.stringify({ error: 'Failed to update order status' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      orderId,
      previousStatus: order.status,
      newStatus,
      message: `Order status updated to ${newStatus}`
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
