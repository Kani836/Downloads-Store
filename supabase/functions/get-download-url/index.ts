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

    const { user_id, book_id } = await req.json();

    // Verify user has purchased the book
    const { data: purchase, error: purchaseError } = await supabase
      .from('purchases')
      .select('items')
      .eq('user_id', user_id)
      .contains('items', [{ id: book_id }])
      .single();

    if (purchaseError || !purchase) {
      throw new Error('Book not purchased');
    }

    // Get the book's download URL
    const { data: book, error: bookError } = await supabase
      .from('books')
      .select('file_url')
      .eq('id', book_id)
      .single();

    if (bookError || !book) {
      throw new Error('Book not found');
    }

    // In a real application, you would generate a signed URL here
    // For this demo, we'll just return the stored URL
    return new Response(
      JSON.stringify({ url: book.file_url }),
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