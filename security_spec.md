# Security Specification: Fortress Rules

This specification establishes the data integrity constraints, access controls, and adversarial verification vectors for the StyleX Collective Firestore system.

## 1. Data Invariants

1. **System Config Locking**: Only authenticated admins are permitted to alter global setting fields, banners, app script endpoints, or active promo codes.
2. **Review Integrity**: Ratings must strictly fall between 1 and 5. Standard users cannot approve their own reviews; approvals are gated to administrators.
3. **Chat Separation**: Guests can read and write only their own message threads (`sender_id` or `receiver_id` matches their own UID). Admins can look up any chat history to act as a concierge.
4. **Immutable Transaction Ledgers**: Once an order has completed or been logged, fields like `userId`, `order_number`, or individual product item lists can never be mutated by a regular customer client.
5. **Role Integrity**: Users must be restricted from upgrading their own profile roles (e.g. settings `role: 'admin'`).

---

## 2. The "Dirty Dozen" Threat Payloads (Test Vectors)

Here are twelve vectors that the rules must actively terminate:

1. **The Spoofed Administrator Profile**: Setting own role to `'admin'` inside `/users/{uid}` profile creation.
2. **Gilded Settings Hijack**: Injecting customized high-yield lottery coins values to defraud the site payout.
3. **Ghost Collection Pollution**: Creating custom documents with gigantic 2MB strings in fields to exhaustion-attack the billing credit.
4. **Unapproved Review Injection**: Writing review payload with `approved: true` directly to bypass curator validation.
5. **Review Rating Poisoning**: Submitting a review with a rate score of `99`.
6. **Chat Wiretapping**: A regular authenticated guest attempts to read or search chats intended for a different user's session.
7. **Coupon Deactivation Fraud**: An unauthenticated or standard user issues a patch to set a coupon's status to `active` or updates the value from the client.
8. **Item Price Tampering**: Submitting a purchase order where the total price is altered (e.g., $10 down from $2000).
9. **Creation Timestamp Spoofing**: Supplying a historic `createdAt` string instead of binding to the server-assigned `request.time`.
10. **Order Document ID Character Poisoning**: Writing a document where the ID has illegal control symbols (`$$_EXPLOIT`).
11. **Historic Order Item Modification**: Attempting to alter items inside completed orders.
12. **Blind Collection Harvesting**: Running a blanket scroll query without explicit client-side where clauses to capture every users' private credentials.

---

## 3. Threat Rule Assessment & Validation Table

| Vector ID | Attack Strategy | Target Path | Rule Countermeasure |
| :--- | :--- | :--- | :--- |
| **V1** | Upgrade role | `/users/{userId}` | `incoming().role == 'customer'` / block self role-change |
| **V2** | Hack values | `/site_settings/settings_main` | Restrict all writes to Admin group lists |
| **V3** | Exhaust memory | `/products/{id}` | Enforce size-bound checks: `incoming().name.size() < 128` |
| **V4** | Self-approval | `/reviews/{id}` | `incoming().approved == false` on guest writes |
| **V5** | Corrupt rating | `/reviews/{id}` | `incoming().rating >= 1 && incoming().rating <= 5` |
| **V6** | Concierge snooping | `/chats/{id}` | `existing().sender_id == auth.uid || existing().receiver_id == auth.uid` |
| **V7** | Alter discount values | `/coupons/{id}` | Restrict Coupon writes entirely to Admins |
| **V8** | Price tampering | `/orders/{id}` | Standard users can create, but cannot modify keys post-submission |
| **V9** | Fake timestamp | `/orders/{id}` | Enforce `incoming().created_at == request.time` |
| **V10** | ID Injection | `/orders/{id}` | Path verification `isValidId()` limits characters |
| **V11** | Alter line items | `/orders/{id}` | Affected keys limit update scopes |
| **V12** | Scroll-scraping | `/*` | Mandatory `resource.data` ownership checks in list blocks |
