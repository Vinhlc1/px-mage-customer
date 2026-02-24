# PixelMageEcommerceProject API Overview

*   **Chú thích**:
    *   `ResponseBase`: Tất cả các response từ API đều được bọc trong một đối tượng `ResponseBase` có cấu trúc: `{ "code": <HTTP_STATUS_CODE>, "message": "<MESSAGE>", "data": <RESPONSE_DATA> }`.
    *   Các tham số trong cột `Request` có dấu `*` là bắt buộc.
    *   Dữ liệu trong `[]` (ví dụ: `[accountId, ...]`) biểu thị một mảng các đối tượng.

---

### Account API (`/api/accounts`)
| Endpoint | Request | Response (data fields) |
|---|---|---|
| POST /registration | email*, password*, name*, phoneNumber, roleId* | accountId, email, name, phoneNumber, roleId, createdAt |
| POST /login | email*, password* | token, accountId, email, name, roleId |
| GET / | | [accountId, email, name, phoneNumber, roleId, createdAt] |
| GET /{id} | id* | accountId, email, name, phoneNumber, roleId, createdAt |
| GET /email/{email} | email* | accountId, email, name, phoneNumber, roleId, createdAt |
| PUT /{id} | id*, body | accountId, email, name, phoneNumber, roleId, updatedAt |
| DELETE /{id} | id* | null |
| GET /exists/{email} | email* | exists (boolean) |

### Inventory API (`/api/inventory`)
| Endpoint | Request | Response (data fields) |
|---|---|---|
| POST / | productId*, warehouseId*, quantity*, lastChecked | inventoryId, productId, warehouseId, quantity, lastChecked |
| GET / | | [inventoryId, productId, warehouseId, quantity, lastChecked] |
| GET /{id} | id* | inventoryId, productId, warehouseId, quantity, lastChecked |
| GET /warehouse/{warehouseId} | warehouseId* | [inventoryId, productId, warehouseId, quantity, lastChecked] |
| PUT /{id} | id*, body | inventoryId, productId, warehouseId, quantity, lastChecked |
| DELETE /{id} | id* | null |

### Warehouse API (`/api/warehouses`)
| Endpoint | Request | Response (data fields) |
|---|---|---|
| POST / | name*, address*, city*, state*, zipCode* | warehouseId, name, address, city, state, zipCode, createdAt |
| GET / | | [warehouseId, name, address, city, state, zipCode, createdAt] |
| GET /{id} | id* | warehouseId, name, address, city, state, zipCode, createdAt |
| PUT /{id} | id*, body | warehouseId, name, address, city, state, zipCode, updatedAt |
| DELETE /{id} | id* | null |

### Role API (`/api/roles`)
| Endpoint | Request | Response (data fields) |
|---|---|---|
| POST / | roleName* | roleId, roleName |
| GET / | | [roleId, roleName] |
| GET /{id} | id* | roleId, roleName |
| GET /name/{roleName} | roleName* | roleId, roleName |
| PUT /{id} | id*, body | roleId, roleName |
| DELETE /{id} | id* | null |
| GET /exists/{roleName} | roleName* | exists (boolean) |

### Supplier API (`/api/suppliers`)
| Endpoint | Request | Response (data fields) |
|---|---|---|
| POST / | name*, contactPerson*, email*, phone*, address* | supplierId, name, contactPerson, email, phone, address, createdAt |
| GET / | | [supplierId, name, contactPerson, email, phone, address, createdAt] |
| GET /{id} | id* | supplierId, name, contactPerson, email, phone, address, createdAt |
| GET /email/{email} | email* | supplierId, name, contactPerson, email, phone, address, createdAt |
| GET /name/{name} | name* | supplierId, name, contactPerson, email, phone, address, createdAt |
| PUT /{id} | id*, body | supplierId, name, contactPerson, email, phone, address, updatedAt |
| DELETE /{id} | id* | null |
| GET /exists/{email} | email* | exists (boolean) |

### Purchase Order API (`/api/purchase-orders`)
| Endpoint | Request | Response (data fields) |
|---|---|---|
| POST / | warehouseId*, supplierId*, poNumber*, status*, orderDate*, expectedDelivery* | purchaseOrderId, warehouseId, supplierId, poNumber, status, orderDate, expectedDelivery, createdAt |
| GET / | | [purchaseOrderId, warehouseId, supplierId, poNumber, status, orderDate, expectedDelivery, createdAt] |
| GET /{id} | id* | purchaseOrderId, warehouseId, supplierId, poNumber, status, orderDate, expectedDelivery, createdAt |
| GET /po-number/{poNumber} | poNumber* | purchaseOrderId, warehouseId, supplierId, poNumber, status, orderDate, expectedDelivery, createdAt |
| GET /status/{status} | status* | [purchaseOrderId, warehouseId, supplierId, poNumber, status, orderDate, expectedDelivery, createdAt] |
| GET /supplier/{supplierId} | supplierId* | [purchaseOrderId, warehouseId, supplierId, poNumber, status, orderDate, expectedDelivery, createdAt] |
| PUT /{id} | id*, body | purchaseOrderId, warehouseId, supplierId, poNumber, status, orderDate, expectedDelivery, updatedAt |
| DELETE /{id} | id* | null |
| GET /exists/{poNumber} | poNumber* | exists (boolean) |
| POST /{poId}/lines | poId*, body | lineId, purchaseOrderId, quantityOrdered, quantityReceived, quantityPendingReceived, unitPrice, totalPrice, expectedDate, note |
| PUT /{poId}/lines/{lineId} | poId*, lineId* | lineId, purchaseOrderId, quantityOrdered, quantityReceived, quantityPendingReceived, unitPrice, totalPrice, expectedDate, note |
