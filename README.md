# VALÚ Baby - E-commerce Platform 🌸

**Modern baby clothing e-commerce for the Peruvian market**

Phase 3 complete: Full-stack shopping cart & checkout with Peru payment methods

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v16+)
- PostgreSQL database (Neon Cloud configured)
- npm or yarn

### 1. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in `/backend`:

```
DATABASE_URL="your_neon_connection_string"
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5500
```

Run migrations and seed:

```bash
npx prisma migrate deploy
npm run seed
```

Start backend:

```bash
npm run dev
```

Backend runs on: **<http://localhost:3001>**

### 2. Frontend Setup

Simply open `index.html` or `catalog.html` with Live Server (VSCode) or any local server.

Recommended: Use Live Server extension (port 5500)

---

## 📁 Project Structure

```
valu-baby/
├── backend/
│   ├── src/
│   │   ├── server.js          # Express server
│   │   └── routes/            # API endpoints
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── seed.js            # 20 products seed
│   └── package.json
├── css/
│   ├── styles.css            # Main styles
│   ├── cart.css              # Shopping cart
│   ├── quick-add.css         # Quick add modal
│   ├── checkout.css          # Checkout page
│   ├── confirmation.css      # Order confirmation
│   └── catalog.css           # Catalog page
├── js/
│   ├── api.js                # API service layer ⭐ NEW
│   ├── cart.js               # Cart logic
│   ├── quick-add.js          # Quick add
│   ├── checkout.js           # Checkout (integrates API)
│   ├── catalog.js            # Catalog page ⭐ NEW
│   └── order-confirmation.js # Confirmation page
├── index.html                # Homepage
├── catalog.html             # Products (from DB) ⭐ NEW
├── checkout.html            # Checkout form
└── order-confirmation.html  # Payment instructions
```

---

## ✨ Features

### Phase 1: Frontend Design ✅

- Responsive homepage
- Hero section with CTA
- Product cards
- FAQ accordion
- Mobile navigation

### Phase 2: Backend Setup ✅

- Express + Prisma + PostgreSQL
- RESTful API
- 20 products seeded
- Order management

### Phase 3: Shopping Cart & Checkout ✅

- **Shopping Cart**
  - localStorage persistence
  - Add/remove/update items
  - Slide-in sidebar
  - Badge counter
  
- **Quick Add**
  - Size selection modal
  - Auto-open cart

- **Checkout (Peru-adapted)**
  - Departamento/Distrito dropdowns
  - DNI field
  - 4 shipping options
  - 4 payment methods:
    - Yape (QR/número)
    - Plin (QR/número)
    - Transferencia (BCP, Interbank, BBVA)
    - Contraentrega

- **Order Confirmation**
  - Payment-specific instructions
  - WhatsApp integration
  - Order summary

- **API Integration** ⭐ NEW
  - Products loaded from database
  - Orders saved to database
  - Category filtering
  - Error handling

---

## 🎯 API Endpoints

### Products

- `GET /api/products` - Get all products
- `GET /api/products?category=Vestidos` - Filter by category
- `GET /api/products/:id` - Get single product

### Cart

- `POST /api/cart/validate` - Validate cart items

### Orders

- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order by ID
- `GET /api/orders/number/:orderNumber` - Get by order number
- `PUT /api/orders/:id/status` - Update status
- `PUT /api/orders/:id/payment` - Update payment status

---

## 🛠️ Technologies

**Frontend:**

- HTML5, CSS3, Vanilla JavaScript
- localStorage for cart persistence
- Fetch API for backend communication

**Backend:**

- Node.js + Express
- Prisma ORM
- PostgreSQL (Neon Cloud)
- CORS, Helmet (security)

**Database:**

- 20 products pre-seeded
- Orders with items
- Payment & shipping tracking

---

## 📦 Database Schema

```prisma
model Product {
  id          String   @id @default(uuid())
  name        String
  description String
  price       Decimal
  category    String
  sizes       String[]
  images      String[]
  stock       Int
  badge       String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Order {
  id              String        @id @default(uuid())
  orderNumber     String        @unique
  customerName    String
  customerEmail   String
  customerPhone   String
  customerDNI     String?
  shippingAddress Json
  subtotal        Decimal
  shipping        Decimal
  total           Decimal
  paymentMethod   String
  status          OrderStatus   @default(PENDING)
  paymentStatus   PaymentStatus @default(PENDING)
  items           OrderItem[]
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
}
```

---

## 🧪 Testing

### Backend

```bash
cd backend
npm run dev
```

Visit <http://localhost:3001/health>

### Frontend

1. Start backend first
2. Open `catalog.html` with Live Server
3. Products should load from database
4. Add items to cart
5. Proceed to checkout
6. Complete order (saved to database)

---

## 📝 Next Steps (Phase 4)

- [ ] Admin dashboard
- [ ] Email notifications (SendGrid)
- [ ] WhatsApp API integration
- [ ] Real payment gateway (Culqi/Niubiz)
- [ ] Order tracking
- [ ] User accounts

---

## 👨‍💻 Development

**Start Backend:**

```bash
cd backend && npm run dev
```

**Start Frontend:**
Open with Live Server or:

```bash
npx serve .
```

**Reset Database:**

```bash
cd backend
npx prisma migrate reset
npm run seed
```

---

## 📄 License

Private project - VALÚ Baby © 2024

---

**Built with ❤️ for Peruvian mamás and bebés**
