# Demo Script — closing a restaurant owner

A ~3-minute live demo you run on your phone. Goal: the prospect *sees* an order go
from a diner's phone straight to their WhatsApp **and** a live dashboard — with zero
commission.

## Before the meeting
- App **deployed** and open on your phone at the live URL.
- Set the demo cafe's **WhatsApp number** (in `restaurant.config.ts`) to **your own**
  number, so you can show the message actually arriving.
- Have **two things** ready: the customer site on one phone, the **dashboard** (`/dashboard`,
  logged in) on a second screen (tablet/laptop) — or two browser windows.
- Optional: reset the demo with [`backend/supabase/reset-demo.sql`](../backend/supabase/reset-demo.sql).

## The pitch (say this)
> "Right now Swiggy and Zomato take 18–30% of every order. This is *your own* ordering
> site — customers scan a QR at the table, order, and it comes straight to your WhatsApp.
> No commission, and you own it."

## The walkthrough (do this)
1. **Scan the QR** (or open `/menu?table=5`). "This is what your customer sees when they
   scan the code on the table." Scroll the menu — real photos, categories, prices.
2. **Add a couple of items** → tap **View order** → **Order on WhatsApp**.
3. **WhatsApp opens** with the itemized order pre-filled. Hit send. "That just landed on
   your phone — the order, the table, the total."
4. **Flip to the dashboard.** "And it's already here, live." Point out the new-order
   highlight + chime.
5. **Tap it through** Accept → Preparing → Ready. "Your kitchen sees exactly where every
   order is."
6. **Open the Menu tab** → toggle an item **sold out**, or change a price. "You run your
   own menu — no developer, no waiting."

## The close
> "It's your site, your customers, your WhatsApp — and every order is commission-free.
> I set it up for you, branded to your cafe, and print your table QR codes. Want yours?"

## Objection quick-answers
- *"Do customers need an app?"* No — they scan and order in the browser.
- *"What about payments?"* WhatsApp order now; online prepaid (Razorpay) is a simple add-on.
- *"Can I change the menu myself?"* Yes — from the dashboard, in seconds (show it).
