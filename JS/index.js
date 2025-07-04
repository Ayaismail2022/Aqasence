const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDOj0eiBK-KvlWJb_lfozescN6-Wvs_1xI",
    authDomain: "graduation-project-5069a.firebaseapp.com",
    projectId: "graduation-project-5069a",
    storageBucket: "graduation-project-5069a.firebasestorage.app",
    messagingSenderId: "57072172670",
    appId: "1:57072172670:web:f2d2aca0be1c0794e2222f",
    measurementId: "G-9XXRB6RL71"
});

const db = firebaseApp.firestore();
const auth = firebaseApp.auth();

// login
const handleLogin = (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    auth.signInWithEmailAndPassword(email, password)
        .then((res) => {
            return db.collection("users").doc(res.user.uid).get();
        })
        .then((doc) => {
            if (doc.exists) {
                alert("Login successful ✅");
                window.location.href = "Water testing.html";
            } else {
                alert("Login failed: user not found");
                auth.signOut();
            }
        })
        .catch((err) => {
            alert("Login failed: " + err.message);
        });
};

// contact form
document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.getElementById("contact-form");

    if (!contactForm) return;

    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = contactForm.name.value.trim();
        const email = contactForm.email.value.trim();
        const message = contactForm.message.value.trim();
        const submitButton = contactForm.querySelector('button[type="submit"]');

        if (!name || !email || !message) {
            alert("Please fill in all fields.");
            return;
        }

        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';

        try {
            // 🔁 Get count for next ID
            const snapshot = await db.collection("Contact us").get();
            const count = snapshot.size + 1;
            const newDocId = `contact_${count}`;

            await db.collection("Contact us").doc(newDocId).set({
                name: name,
                email: email,
                message: message,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });

            alert(`✅ Message saved as '${newDocId}'!`);
            contactForm.reset();
        } catch (error) {
            console.error("❌ Error sending message:", error);
            alert("❌ Something went wrong. Please try again.");
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Send Message';
        }
    });
});