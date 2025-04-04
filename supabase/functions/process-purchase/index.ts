import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { user_id, items } = await req.json();

    // Verify user exists
    const { data: user, error: userError } = await supabase
      .from('auth.users')
      .select('id')
      .eq('id', user_id)
      .single();

    if (userError || !user) {
      throw new Error('User not found');
    }

    // Process the purchase
    // In a real application, you would integrate with a payment processor here
    // For this demo, we'll just create a purchase record

    const { data: purchase, error: purchaseError } = await supabase
      .from('purchases')
      .insert({
        user_id,
        items,
        total_amount: items.reduce((sum: number, item: any) => sum + item.price, 0),
        status: 'completed'
      })
      .select()
      .single();

    if (purchaseError) {
      throw purchaseError;
    }

    // Clear the user's cart
    const { error: cartError } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user_id);

    if (cartError) {
      throw cartError;
    }

    return new Response(
      JSON.stringify({ success: true, purchase }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});