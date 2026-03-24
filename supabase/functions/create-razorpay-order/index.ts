import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const {
      amount,
      booking_type,
      package_id,
      itinerary_data,
      travel_dates_start,
      travel_dates_end,
      num_travelers,
      pickup_city,
      contact_name,
      contact_email,
      contact_phone,
      payment_method,
    } = await req.json();

    // Validate required fields
    if (!amount || !booking_type || !contact_name || !contact_email) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID") || "rzp_test_SV3idNh2kPCvNE";
    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET") || "pSt7Uo2l7WrSlIvVFlquZv5r";

    // Generate booking reference
    const bookingReference = `TRV-${Date.now()}-${Math.random().toString(36).substring(2, 11).toUpperCase()}`;

    // Create Razorpay order
    const amountInPaise = Math.round(amount * 100);
    const razorpayResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa(`${razorpayKeyId}:${razorpayKeySecret}`)}`,
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: "INR",
        receipt: bookingReference,
        notes: {
          booking_type,
          contact_email,
        },
      }),
    });

    if (!razorpayResponse.ok) {
      const errorData = await razorpayResponse.json();
      console.error("Razorpay order creation failed:", errorData);
      return new Response(
        JSON.stringify({ error: "Failed to create payment order" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const razorpayOrder = await razorpayResponse.json();

    // Get user from auth header
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create pending booking in database
    const { error: bookingError } = await supabaseClient.from("bookings").insert({
      user_id: user.id,
      package_id: package_id || null,
      booking_type,
      itinerary_data: itinerary_data || null,
      travel_dates_start,
      travel_dates_end,
      num_travelers,
      pickup_city,
      contact_name,
      contact_email,
      contact_phone,
      total_price: amount,
      payment_method: payment_method || "razorpay",
      payment_status: "pending",
      booking_status: "pending",
      booking_reference: bookingReference,
      razorpay_order_id: razorpayOrder.id,
      payment_amount_paise: amountInPaise,
    });

    if (bookingError) {
      console.error("Booking creation error:", bookingError);
      return new Response(
        JSON.stringify({ error: "Failed to create booking" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        order_id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        booking_reference: bookingReference,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
