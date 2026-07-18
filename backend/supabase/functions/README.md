# Edge Functions

## `razorpay` — production-grade online payments

Server-side Razorpay: creates the order, and **verifies the payment signature with
the secret key** before persisting the order as paid. The secret and service-role key
live only here (Supabase secrets), never in the browser.

### Deploy (Supabase CLI)

```bash
npm i -g supabase
supabase login
supabase link --project-ref <your-project-ref>

# Set the Razorpay TEST keys (Dashboard → Settings → API Keys → Generate Test Key)
supabase secrets set RAZORPAY_KEY_ID=rzp_test_xxx RAZORPAY_KEY_SECRET=xxxxxxxx

# Deploy. --no-verify-jwt lets anonymous customers call it.
supabase functions deploy razorpay --no-verify-jwt
```

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are injected automatically — don't set them.

> No CLI? The Supabase Dashboard → **Edge Functions** can also create/deploy a function
> from a pasted file, set its secrets, and disable "Verify JWT".

### Also required
- Run [`../migrations/20260713000007_place_order_unpaid.sql`](../migrations/20260713000007_place_order_unpaid.sql)
  so `place_order()` can't self-mark orders paid (only this function can, after verifying).
- Set `VITE_RAZORPAY_KEY_ID` (the **publishable** key id) in the frontend env.

### How the frontend uses it
`src/features/order/razorpay.ts` calls it via `supabase.functions.invoke("razorpay", …)`:
`create` → open Checkout with the returned `order_id` → `verify` → order saved as **paid**.
