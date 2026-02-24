import { apiPost, apiGet, apiDelete } from "../api-client";

export interface ClientSecretResponse {
  clientSecret: string;
  paymentIntentId: string | null;
  setupIntentId: string | null;
  publicKey: string;
}

export interface BePaymentResponse {
  paymentId: number;
  orderId: number;
  stripePaymentIntentId: string;
  paymentStatus: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  processingFee: number | null;
  netAmount: number | null;
  failureReason: string | null;
  createdAt: string;
  processedAt: string | null;
}

export interface SavedPaymentMethod {
  paymentMethodId: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

export async function createPaymentIntent(
  orderId: number,
  amount: number,
  currency = "USD"
): Promise<ClientSecretResponse> {
  return apiPost<ClientSecretResponse>("/api/payments/create-payment-intent", {
    orderId,
    amount,
    currency,
    paymentMethod: "CARD",
    savePaymentMethod: false,
  });
}

export async function confirmPayment(
  paymentIntentId: string
): Promise<BePaymentResponse> {
  return apiPost<BePaymentResponse>(
    `/api/payments/confirm-payment/${paymentIntentId}`,
    {}
  );
}

export async function createSetupIntent(
  customerId: number
): Promise<ClientSecretResponse> {
  return apiPost<ClientSecretResponse>(
    `/api/payments/create-setup-intent?customerId=${customerId}`,
    {}
  );
}

export async function getSavedPaymentMethods(
  customerId: number
): Promise<SavedPaymentMethod[]> {
  return apiGet<SavedPaymentMethod[]>(
    `/api/payments/saved-payment-methods/${customerId}`
  );
}

export async function getPaymentHistory(
  customerId: number
): Promise<BePaymentResponse[]> {
  return apiGet<BePaymentResponse[]>(`/api/payments/history/${customerId}`);
}

export async function detachPaymentMethod(
  paymentMethodId: string
): Promise<void> {
  return apiDelete(`/api/payments/detach-payment-method/${paymentMethodId}`);
}
