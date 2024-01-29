import getStripeUrl from "@/actions/getStripeUrl";
import axios from "axios";
import { redirect } from "next/navigation";
import Payment from "./components/payment";

export default async function CreaterOrderPage({
  searchParams,
}: {
  searchParams: {
    OrderId: string;
    OrderTotal: string;
    API_KEY: string;
    ServiceName: string;
    Email: string;
    OriginUrl: string;
  };
}) {
  if (!searchParams.OrderId) {
    return (
      <div className="flex h-screen items-center justify-center">
        <h1 className="text-4xl font-semibold">Page Not Found</h1>
      </div>
    );
  }
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-8">
      <h1 className="text-3xl font-semibold">
        Thank you! We are redirecting you to the payment page...
      </h1>
      <p className="text-lg text-neutral-300">
        If you are not redirected, please click the button below to proceed to
        the checkout page.
      </p>
      <Payment params={searchParams} />
    </div>
  );
}
