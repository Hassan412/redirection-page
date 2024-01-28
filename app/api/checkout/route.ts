import Stripe from "stripe";
import { NextResponse } from "next/server";
import limitDecimalPlaces from "@/actions/limit-number-decimal";
import { stripe } from "@/lib/stripe";
import axios from "axios";
import { headers } from "next/headers";

const corsHeaders = {
  "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_MAIN_URL,
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key",
};

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: corsHeaders,
    }
  );
}

export async function POST(req: Request) {
  const body = await req.json();

  const { OrderTotal, API_KEY, OrderId, ServiceName, Email, OriginUrl } = body;

  if (!API_KEY) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
    {
      price_data: {
        currency: "USD",
        product_data: {
          name: ServiceName,
        },
        unit_amount_decimal: `${limitDecimalPlaces(OrderTotal * 100, 2)}`,
      },
      quantity: 1,
    },
  ];

  const Order = await axios.post(
    `${process.env.NEXT_PUBLIC_MAIN_URL}/api/checkout`,
    {
      API_KEY,
      OrderId,
      ServiceName,
      OrderTotal,
    }
  );
  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    success_url: `${
      process.env.FRONTEND_URL
    }/api/success?origin=${encodeURIComponent(OriginUrl)}`,
    cancel_url: `${
      process.env.FRONTEND_URL
    }/api/cancel?origin=${encodeURIComponent(OriginUrl)}`,
    customer_email: Email,
    metadata: {
      orderId: Order?.data?.order?.id,
    },
  });

  return NextResponse.json(
    { url: session.url, id: Order?.data?.order?.id },
    {
      headers: corsHeaders,
    }
  );
}
