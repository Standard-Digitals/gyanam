declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

let scriptLoadingPromise: Promise<void> | null = null;

function loadRazorpayScript(): Promise<void> {
  if (typeof window !== 'undefined' && window.Razorpay) return Promise.resolve();
  if (scriptLoadingPromise) return scriptLoadingPromise;

  scriptLoadingPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay checkout script'));
    document.body.appendChild(script);
  });
  return scriptLoadingPromise;
}

interface OpenCheckoutParams {
  razorpayOrderId: string;
  amount: number;
  currency: string;
  keyId: string;
  name?: string;
  description?: string;
  prefillName?: string;
  prefillContact?: string;
  onSuccess: (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => void;
  onDismiss?: () => void;
}

export async function openRazorpayCheckout(params: OpenCheckoutParams) {
  await loadRazorpayScript();

  const razorpay = new window.Razorpay({
    key: params.keyId,
    amount: params.amount,
    currency: params.currency,
    order_id: params.razorpayOrderId,
    name: params.name ?? 'GYANM Academy',
    description: params.description ?? '',
    prefill: {
      name: params.prefillName ?? '',
      contact: params.prefillContact ?? '',
    },
    theme: { color: '#C12223' },
    handler: (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
      params.onSuccess(response);
    },
    modal: {
      ondismiss: () => {
        params.onDismiss?.();
      },
    },
  });

  razorpay.open();
}
