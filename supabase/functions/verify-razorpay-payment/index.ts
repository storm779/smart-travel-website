import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function verifySignature(
  orderId: string,
  paymentId: string,
  signature: string,
  secret: string,
): Promise<boolean> {
  const message = `${orderId}|${paymentId}`;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  const generatedSignature = Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return generatedSignature === signature;
}

function generateConfirmationEmail(booking: {
  booking_reference: string;
  contact_name: string;
  total_price: number;
  travel_dates_start?: string;
  travel_dates_end?: string;
  num_travelers?: number;
  booking_type?: string;
}): string {
  const totalPrice = `₹${Number(booking.total_price).toLocaleString("en-IN")}`;
  const travelDates =
    booking.travel_dates_start && booking.travel_dates_end
      ? `${booking.travel_dates_start} to ${booking.travel_dates_end}`
      : booking.travel_dates_start || "N/A";

  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f4f1f9;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f1f9;padding:40px 20px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(150,73,150,0.10);">
        <tr>
          <td style="background:linear-gradient(135deg,#964996,#7b3a7b);padding:36px 40px;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;letter-spacing:1px;">Travellah</h1>
            <p style="margin:8px 0 0;color:#e8cfe8;font-size:14px;">Your gateway to unforgettable journeys</p>
          </td>
        </tr>
        <tr>
          <td style="padding:40px;">
            <div style="text-align:center;margin-bottom:28px;">
              <div style="display:inline-block;background-color:#e8f5e9;border-radius:50%;width:64px;height:64px;line-height:64px;font-size:32px;margin-bottom:12px;">&#10003;</div>
              <h2 style="margin:12px 0 4px;color:#2e7d32;font-size:24px;">Your Booking is Confirmed!</h2>
              <p style="margin:0;color:#666;font-size:15px;">Thank you for choosing Travellah, ${booking.contact_name}.</p>
            </div>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#faf6fa;border-radius:8px;margin-bottom:28px;">
              <tr>
                <td style="padding:16px 20px;border-bottom:1px solid #ece3ec;">
                  <span style="color:#888;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Booking Reference</span><br/>
                  <span style="color:#964996;font-size:18px;font-weight:700;">${booking.booking_reference}</span>
                </td>
              </tr>
              <tr>
                <td style="padding:16px 20px;border-bottom:1px solid #ece3ec;">
                  <span style="color:#888;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Travel Dates</span><br/>
                  <span style="color:#333;font-size:16px;font-weight:600;">${travelDates}</span>
                </td>
              </tr>
              ${
                booking.num_travelers
                  ? `<tr>
                <td style="padding:16px 20px;border-bottom:1px solid #ece3ec;">
                  <span style="color:#888;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Travelers</span><br/>
                  <span style="color:#333;font-size:16px;font-weight:600;">${booking.num_travelers}</span>
                </td>
              </tr>`
                  : ""
              }
              <tr>
                <td style="padding:16px 20px;">
                  <span style="color:#888;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Total Amount</span><br/>
                  <span style="color:#333;font-size:20px;font-weight:700;">${totalPrice}</span>
                </td>
              </tr>
            </table>
            <div style="text-align:center;margin:32px 0;">
              <a href="https://travellah.com/bookings" style="display:inline-block;background:linear-gradient(135deg,#964996,#7b3a7b);color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:8px;font-size:16px;font-weight:600;letter-spacing:0.5px;">View My Bookings</a>
            </div>
          </td>
        </tr>
        <tr>
          <td style="background-color:#f9f5f9;padding:24px 40px;text-align:center;border-top:1px solid #ece3ec;">
            <p style="margin:0 0 8px;color:#888;font-size:13px;">Need help? Contact us at <a href="mailto:support@travellah.com" style="color:#964996;text-decoration:none;">support@travellah.com</a></p>
            <p style="margin:0;color:#aaa;font-size:12px;">&copy; ${new Date().getFullYear()} Travellah. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return new Response(JSON.stringify({ error: "Missing payment verification fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET") || "pSt7Uo2l7WrSlIvVFlquZv5r";

    // Verify HMAC signature
    const isValid = await verifySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      razorpayKeySecret,
    );

    if (!isValid) {
      console.error("Payment signature verification failed");
      return new Response(JSON.stringify({ error: "Payment verification failed" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use service role to update booking (bypasses RLS)
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Update booking status
    const { data: booking, error: updateError } = await supabaseAdmin
      .from("bookings")
      .update({
        payment_status: "completed",
        booking_status: "confirmed",
        razorpay_payment_id,
        razorpay_signature,
      })
      .eq("razorpay_order_id", razorpay_order_id)
      .select(
        "booking_reference, contact_email, contact_name, total_price, travel_dates_start, travel_dates_end, num_travelers, booking_type",
      )
      .single();

    if (updateError) {
      console.error("Booking update error:", updateError);
      return new Response(JSON.stringify({ error: "Failed to update booking" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Send confirmation email (non-blocking, failure won't affect payment response)
    const resendApiKey = Deno.env.get("RESEND_API_KEY") || "re_dEkDd3iQ_5wKYoknxjy15kraKuibtHVet";
    if (resendApiKey && booking.contact_email) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "Travellah <onboarding@resend.dev>",
            to: [booking.contact_email],
            subject: `Booking Confirmed! - ${booking.booking_reference}`,
            html: generateConfirmationEmail(booking),
          }),
        });
      } catch (emailError) {
        console.error("Email send failed:", emailError);
        // Don't fail the payment verification if email fails
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        booking_reference: booking.booking_reference,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
