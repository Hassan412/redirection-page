import Stripe from "stripe";
import { NextResponse } from "next/server";
import limitDecimalPlaces from "@/actions/limit-number-decimal";
import { stripe } from "@/lib/stripe";
import axios from "axios";

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
      OrderTotal: parseInt(OrderTotal),
    }
  );
  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    success_url: `${process.env.FRONTEND_URL}/create-order?success=1`,
    cancel_url: `${process.env.FRONTEND_URL}/create-order?canceled=1`,
    customer_email: Email,
    metadata: {
      orderId: Order?.data?.order?.id,
    },
  });

  return NextResponse.json({ url: session.url, id: Order?.data?.order?.id });
}
