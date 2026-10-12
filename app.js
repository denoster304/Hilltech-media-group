import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCjFL4edy1fX9rprfCZ9-MYavdsk9hGJwc",
  authDomain: "hilltech.firebaseapp.com",
  databaseURL: "https://hilltech-default-rtdb.firebaseio.com",
  projectId: "hilltech",
  storageBucket: "hilltech.appspot.com",
  messagingSenderId: "406255325932",
  appId: "1:406255325932:web:20191ba3bb7aes64100bc9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Handle Booking Submission
async function handleBooking(e) {
  e.preventDefault();
  
  const form = e.currentTarget;
  const statusEl = document.getElementById("bookingStatus");
  const formData = new FormData(form);

  if (formData.get("website")) return; // Honeypot spam check

  if (statusEl) {
    statusEl.textContent = "Sending booking to admin...";
    statusEl.className = "status";
  }

  const bookingData = {
    name: formData.get("name") || "N/A",
    email: formData.get("email") || "N/A",
    phone: formData.get("phone") || "N/A",
    service: formData.get("service") || "N/A",
    event_date: formData.get("event_date") || "N/A",
    event_time: formData.get("event_time") || "N/A",
    location: formData.get("location") || "N/A",
    budget: formData.get("budget") || "N/A",
    details: formData.get("details") || "N/A",
    status: "Pending",
    created_at: new Date().toISOString()
  };

  try {
    // Save to Firebase Database under "bookings"
    const bookingsRef = ref(db, "bookings");
    const newBookingRef = push(bookingsRef);
    await set(newBookingRef, bookingData);

    if (statusEl) {
      statusEl.textContent = "Booking sent! Redirecting to WhatsApp...";
      statusEl.className = "status success";
    }

    // Format WhatsApp message for admin (+254 798 844 291)
    const adminPhone = "254798844291";
    const textMessage = 
`🚨 *NEW BOOKING REQUEST - HILLTECH MEDIA GROUP*

👤 *Client Name:* ${bookingData.name}
📧 *Email:* ${bookingData.email}
📞 *Phone:* ${bookingData.phone}
🎬 *Service:* ${bookingData.service}
📅 *Date & Time:* ${bookingData.event_date} at ${bookingData.event_time}
📍 *Location:* ${bookingData.location}
💰 *Budget:* ${bookingData.budget}

💬 *Project Details:*
${bookingData.details}`;

    const whatsappUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(textMessage)}`;
    
    // Redirect after a brief moment so the success message renders
    setTimeout(() => {
      window.location.href = whatsappUrl;
    }, 1000);

  } catch (err) {
    console.error("Firebase submission error:", err);
    if (statusEl) {
      statusEl.textContent = "Failed to send booking. Check console for details.";
      statusEl.className = "status error";
    }
  }
}

// Attach event listener when the DOM loads on index.html
document.addEventListener("DOMContentLoaded", () => {
  const bookingForm = document.getElementById("bookingForm");
  if (bookingForm) {
    bookingForm.addEventListener("submit", handleBooking);
    console.log("Booking form listener attached successfully.");
  } else {
    console.warn("bookingForm element not found on this page.");
  }
});