const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type EmailType = "booking_confirmation" | "payment_receipt";

interface EmailRequest {
  type: EmailType;
  to: string;
  data: Record<string, unknown>;
}

function generateBookingConfirmationEmail(data: Record<string, unknown>): string {
  const bookingReference = data.booking_reference || "N/A";
  const contactName = data.contact_name || "Traveler";
  const totalPrice = data.total_price
    ? `₹${Number(data.total_price).toLocaleString("en-IN")}`
    : "N/A";
  const destination = data.destination || "";
  const travelDatesStart = data.travel_dates_start || "";
  const travelDatesEnd = data.travel_dates_end || "";
  const numTravelers = data.num_travelers || "";

  const travelDates =
    travelDatesStart && travelDatesEnd
      ? `${travelDatesStart} to ${travelDatesEnd}`
      : travelDatesStart || "N/A";

  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f4f1f9;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f1f9;padding:40px 20px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(150,73,150,0.10);">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#964996,#7b3a7b);padding:36px 40px;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;letter-spacing:1px;">Travellah</h1>
            <p style="margin:8px 0 0;color:#e8cfe8;font-size:14px;">Your gateway to unforgettable journeys</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:40px;">
            <div style="text-align:center;margin-bottom:28px;">
              <div style="display:inline-block;background-color:#e8f5e9;border-radius:50%;width:64px;height:64px;line-height:64px;font-size:32px;margin-bottom:12px;">✓</div>
              <h2 style="margin:12px 0 4px;color:#2e7d32;font-size:24px;">Your Booking is Confirmed!</h2>
              <p style="margin:0;color:#666;font-size:15px;">Thank you for choosing Travellah, ${contactName}.</p>
            </div>

            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#faf6fa;border-radius:8px;padding:4px;margin-bottom:28px;">
              <tr>
                <td style="padding:16px 20px;border-bottom:1px solid #ece3ec;">
                  <span style="color:#888;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Booking Reference</span><br/>
                  <span style="color:#964996;font-size:18px;font-weight:700;">${bookingReference}</span>
                </td>
              </tr>
              ${
                destination
                  ? `<tr>
                <td style="padding:16px 20px;border-bottom:1px solid #ece3ec;">
                  <span style="color:#888;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Destination</span><br/>
                  <span style="color:#333;font-size:16px;font-weight:600;">${destination}</span>
                </td>
              </tr>`
                  : ""
              }
              <tr>
                <td style="padding:16px 20px;border-bottom:1px solid #ece3ec;">
                  <span style="color:#888;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Travel Dates</span><br/>
                  <span style="color:#333;font-size:16px;font-weight:600;">${travelDates}</span>
                </td>
              </tr>
              ${
                numTravelers
                  ? `<tr>
                <td style="padding:16px 20px;border-bottom:1px solid #ece3ec;">
                  <span style="color:#888;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Travelers</span><br/>
                  <span style="color:#333;font-size:16px;font-weight:600;">${numTravelers}</span>
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
        <!-- Footer -->
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

function generatePaymentReceiptEmail(data: Record<string, unknown>): string {
  const bookingReference = data.booking_reference || "N/A";
  const contactName = data.contact_name || "Traveler";
  const totalPrice = data.total_price
    ? `₹${Number(data.total_price).toLocaleString("en-IN")}`
    : "N/A";
  const paymentMethod = data.payment_method || "Online Payment";
  const transactionId = data.transaction_id || data.razorpay_payment_id || "N/A";
  const paymentDate =
    data.payment_date ||
    new Date().toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f4f1f9;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f1f9;padding:40px 20px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(150,73,150,0.10);">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#964996,#7b3a7b);padding:36px 40px;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;letter-spacing:1px;">Travellah</h1>
            <p style="margin:8px 0 0;color:#e8cfe8;font-size:14px;">Payment Receipt</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:40px;">
            <h2 style="margin:0 0 8px;color:#333;font-size:22px;text-align:center;">Payment Received</h2>
            <p style="margin:0 0 28px;color:#666;font-size:15px;text-align:center;">Thank you for your payment, ${contactName}.</p>

            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#faf6fa;border-radius:8px;margin-bottom:28px;">
              <tr>
                <td style="padding:16px 20px;border-bottom:1px solid #ece3ec;">
                  <span style="color:#888;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Amount Paid</span><br/>
                  <span style="color:#2e7d32;font-size:22px;font-weight:700;">${totalPrice}</span>
                </td>
              </tr>
              <tr>
                <td style="padding:16px 20px;border-bottom:1px solid #ece3ec;">
                  <span style="color:#888;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Booking Reference</span><br/>
                  <span style="color:#964996;font-size:16px;font-weight:700;">${bookingReference}</span>
                </td>
              </tr>
              <tr>
                <td style="padding:16px 20px;border-bottom:1px solid #ece3ec;">
                  <span style="color:#888;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Transaction ID</span><br/>
                  <span style="color:#333;font-size:14px;font-weight:600;word-break:break-all;">${transactionId}</span>
                </td>
              </tr>
              <tr>
                <td style="padding:16px 20px;border-bottom:1px solid #ece3ec;">
                  <span style="color:#888;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Payment Method</span><br/>
                  <span style="color:#333;font-size:16px;font-weight:600;">${paymentMethod}</span>
                </td>
              </tr>
              <tr>
                <td style="padding:16px 20px;">
                  <span style="color:#888;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Date</span><br/>
                  <span style="color:#333;font-size:16px;font-weight:600;">${paymentDate}</span>
                </td>
              </tr>
            </table>

            <div style="text-align:center;margin:32px 0;">
              <a href="https://travellah.com/bookings" style="display:inline-block;background:linear-gradient(135deg,#964996,#7b3a7b);color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:8px;font-size:16px;font-weight:600;letter-spacing:0.5px;">View My Bookings</a>
            </div>
          </td>
        </tr>
        <!-- Footer -->
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
    const resendApiKey = Deno.env.get("RESEND_API_KEY") || "re_dEkDd3iQ_5wKYoknxjy15kraKuibtHVet";
    if (!resendApiKey) {
      return new Response(JSON.stringify({ error: "RESEND_API_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { type, to, data }: EmailRequest = await req.json();

    if (!type || !to || !data) {
      return new Response(JSON.stringify({ error: "Missing required fields: type, to, data" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let subject: string;
    let html: string;

    switch (type) {
      case "booking_confirmation":
        subject = `Booking Confirmed! - ${data.booking_reference || ""}`;
        html = generateBookingConfirmationEmail(data);
        break;
      case "payment_receipt":
        subject = `Payment Receipt - ${data.booking_reference || ""}`;
        html = generatePaymentReceiptEmail(data);
        break;
      default:
        return new Response(JSON.stringify({ error: `Unknown email type: ${type}` }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "Travellah <onboarding@resend.dev>",
        to: [to],
        subject,
        html,
      }),
    });

    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error("Resend API error:", resendData);
      return new Response(JSON.stringify({ error: "Failed to send email", details: resendData }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, email_id: resendData.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
