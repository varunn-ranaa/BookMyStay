# BookMyStay 

A full-stack rental listing platform where users can explore, add, and review stays from around the world.

## **[Live Demo](https://bookmystay-dsg9.onrender.com/listing)**

---

## Features

- **Browse Listings** — Explore rental stays with images, location, and pricing
- **User Authentication** — Secure signup/login with session management
- **Add & Manage Listings** — Authenticated users can create, edit, and delete their own listings
- **Reviews & Comments** — Leave reviews on listings; owners can manage them
- **Interactive Maps** — Each listing shows its location on an embedded map
- **Image Uploads** — Listing images stored via Cloudinary
- **Input Validation** — Server-side schema validation on all forms

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express.js |
| Templating | EJS |
| Database | MongoDB, Mongoose |
| Auth | Passport.js |
| Image Storage | Cloudinary |
| Deployment | Render |

---

## Project Structure

```
BookMyStay/
├── controllers/     # Route logic
├── models/          # Mongoose schemas
├── routes/          # Express routers
├── views/           # EJS templates
├── public/          # Static assets (CSS, JS)
├── utils/           # Helper functions
├── middleware.js    # Auth & error middleware
├── schemaValidation.js
└── app.js           # Entry point
```

---

## Getting Started

### Prerequisites
- Node.js
- MongoDB (local or Atlas)
- Cloudinary account

### Installation

```bash
# Clone the repo
git clone https://github.com/varunn-ranaa/BookMyStay.git
cd BookMyStay

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the root:

```env
ATLASDB_URL=your_mongodb_atlas_url
SECRET=your_session_secret
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
MAP_TOKEN=your_map_api_token
```

### Run Locally

```bash
node app.js
```

Visit `http://localhost:8080`

---

## Upcoming Features

- [ ] Search & filter listings
- [ ] Booking system
- [ ] Payment integration

---

## Author

**Varun Rana**

> Open to contributing to projects.

