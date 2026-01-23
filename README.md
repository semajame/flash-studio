# 📸 Digital Photobooth

A frontend-only digital photobooth application that allows users to capture up to four photos using their device camera, automatically arrange them into customizable photostrips, and download the final output directly to their local machine.

---

## 📌 Project Overview

The **Digital Photobooth Web Application** provides a fun and interactive photo-taking experience directly in the browser. Users can take multiple photos in a single session, apply photostrip layouts, and export the final image without requiring any backend services.

All image processing is handled on the client side, ensuring fast performance and complete user privacy.

---

## ✨ Key Features

### User Features
- **Camera Capture**
  - Access device camera via the browser
  - Capture up to **four photos per session**
  - Live camera preview before each shot

- **Photostrip Generation**
  - Automatically arranges captured photos into photostrip layouts
  - Real-time preview of the final photostrip

- **Download Functionality**
  - Export the photostrip as an image file
  - Download directly to the user’s local machine
  - No server upload or storage required

- **Privacy-Focused**
  - No backend or database
  - Photos never leave the user’s device

---

## ⚙️ Application Behavior
- All image capture and processing are handled client-side
- Photos are stored temporarily in browser memory
- Downloaded images are generated dynamically using canvas-based rendering

---

## 🧱 Tech Stack

- **Framework:** Next.js
- **Styling:** Tailwind CSS
- **Language:** TypeScript / JavaScript
- **Image Processing:** HTML Canvas / Web APIs
- **Backend:** None (Client-side only)

---

## 🔧 Installation & Setup

```bash
# Clone the repository
git clone https://github.com/your-username/digital-photobooth.git

# Install dependencies
npm install

# Run the development server
npm run dev
