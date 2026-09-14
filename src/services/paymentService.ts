import { supabase } from "@/lib/supabase";

interface CreateOrderParams {
  amount: number;
  booking_type: "package" | "custom";
  package_id?: string;
  itinerary_data?: Record<string, unknown>;
  travel_dates_start: string;
  travel_dates_end: string;
  num_travelers: number;
  pickup_city: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  payment_method?: string;
}

interface CreateOrderResponse {
  order_id: string;
  amount: number;
  currency: string;
  booking_reference: string;
}

interface VerifyPaymentParams {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface VerifyPaymentResponse {
  success: boolean;
  booking_reference: string;
}

export async function createRazorpayOrder(
  params: CreateOrderParams
): Promise<CreateOrderResponse> {
  const { data, error } = await supabase.functions.invoke(
    "create-razorpay-order",
    { body: params }
  );

  if (error) {
    throw new Error(error.message || "Failed to create payment order");
  }

  if (data.error) {
    throw new Error(data.error);
  }

  return data as CreateOrderResponse;
}

export async function verifyRazorpayPayment(
  params: VerifyPaymentParams
): Promise<VerifyPaymentResponse> {
  const { data, error } = await supabase.functions.invoke(
    "verify-razorpay-payment",
    { body: params }
  );

  if (error) {
    throw new Error(error.message || "Payment verification failed");
  }

  if (data.error) {
    throw new Error(data.error);
  }

  return data as VerifyPaymentResponse;
}
