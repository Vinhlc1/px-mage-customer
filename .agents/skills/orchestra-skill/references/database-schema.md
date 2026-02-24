# Database Schema

This document outlines the structure of the project's database tables.

---

### 1. `accounts` (User Accounts)
-   `customer_id` (PK, int, auto-increment): User's unique ID.
-   `role_id` (FK, int): Role ID, references `roles`.
-   `email` (varchar): Login email.
-   `password` (varchar): Hashed password.
-   `name` (varchar): User's name.
-   `phone_number` (varchar): Phone number.
-   `created_at` (datetime2): Timestamp of creation.
-   `updated_at` (datetime2): Timestamp of last update.

### 2. `roles` (User Roles)
-   `role_id` (PK, int, auto-increment): Role's unique ID.
-   `role_name` (varchar): Name of the role (e.g., `ROLE_ADMIN`, `ROLE_MANAGER`).

### 3. `products`
-   **Note:** This table is referenced by `inventory` and `warehouse_transactions` but its creation script was not provided. It should contain product details.

### 4. `inventory` (Stock Inventory)
-   `inventory_id` (PK, int, auto-increment): Inventory line ID.
-   `product_id` (int): Product ID.
-   `warehouse_id` (FK, int): Warehouse ID, references `warehouses`.
-   `quantity` (int): Stock quantity.
-   `last_checked` (datetime2): Last stock check timestamp.
-   `created_at` (datetime2).
-   `updated_at` (datetime2).

### 5. `warehouses` (Warehouses)
-   `warehouse_id` (PK, int, auto-increment): Warehouse's unique ID.
-   `name` (varchar): Warehouse name.
-   `address` (varchar): Detailed address.
-   `city` (varchar): City.
-   `state` (varchar): State/Province.
-   `zip_code` (varchar): Postal code.
-   `created_at` (datetime2).
-   `updated_at` (datetime2).

### 6. `suppliers` (Suppliers)
-   `supplier_id` (PK, int, auto-increment): Supplier's unique ID.
-   `name` (varchar): Supplier name.
-   `contact_person` (varchar): Contact person.
-   `email` (varchar): Contact email.
-   `phone` (varchar): Phone number.
-   `address` (varchar): Address.
-   `created_at` (datetime2).
-   `updated_at` (datetime2).

### 7. `purchase_orders` (Purchase Orders)
-   `po_id` (PK, int, auto-increment): Internal order ID.
-   `po_number` (varchar): Public order number (e.g., `PO-2023-001`).
-   `supplier_id` (FK, int): Supplier ID, references `suppliers`.
-   `warehouse_id` (int): Target warehouse for delivery.
-   `status` (varchar): Order status (e.g., `PENDING`, `COMPLETED`).
-   `order_date` (datetime2): Date the order was placed.
-   `expected_delivery` (datetime2): Expected delivery date.
-   `created_at` (datetime2).
-   `updated_at` (datetime2).

### 8. `purchase_order_lines` (Purchase Order Line Items)
-   `po_line_id` (PK, varchar): Unique ID for the line item.
-   `purchase_order_id` (FK, int): References `purchase_orders`.
-   `quantity_ordered` (int): Quantity ordered.
-   `quantity_received` (int): Quantity received.
-   `quantity_pending_received` (int): Quantity pending receipt.
-   `unit_price` (float): Price per unit.
-   `total_price` (float): Total price for the line.
-   `expected_date` (date): Expected date for this line item.
-   `note` (varchar): Notes.

### 9. `warehouse_transactions` (Warehouse Transaction History)
-   `transaction_id` (PK, int, auto-increment): Transaction's unique ID.
-   `warehouse_id` (FK, int): Warehouse where the transaction occurred.
-   `product_id` (int): Product involved in the transaction.
-   `quantity` (int): Quantity changed (positive for inbound, negative for outbound).
-   `transaction_type` (varchar): Type of transaction (e.g., `INBOUND`, `OUTBOUND`).
-   `reference_id` (int): Reference ID (e.g., a purchase order ID).
-   `transaction_date` (datetime2): Actual date of the transaction.
-   `created_at` (datetime2).
-   `updated_at` (datetime2).
