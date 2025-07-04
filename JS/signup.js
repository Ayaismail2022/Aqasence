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

const clearErrors = () => {
    document.getElementById("name-error").textContent = "";
    document.getElementById("email-error").textContent = "";
    document.getElementById("password-error").textContent = "";
    document.getElementById("confirm-error").textContent = "";
};

const signup = (event) => {
    event.preventDefault();
    clearErrors();

    const fullName = document.getElementById("fullname").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmpassword").value;
    const phone = document.getElementById("phone").value;
    const country = document.getElementById("country").value;

    let valid = true;

    if (fullName.length < 3) {
        document.getElementById("name-error").textContent = "Full name must be at least 3 characters.";
        valid = false;
    }

    if (!email.includes("@")) {
        document.getElementById("email-error").textContent = "Please enter a valid email.";
        valid = false;
    }

    if (password.length < 6 || !/\d/.test(password)) {
        document.getElementById("password-error").textContent = "Password must be at least 6 characters and contain a number.";
        valid = false;
    }

    if (password !== confirmPassword) {
        document.getElementById("confirm-error").textContent = "Passwords do not match.";
        valid = false;
    }

    if (!valid) return;

    auth.createUserWithEmailAndPassword(email, password)
        .then((res) => {
            const uid = res.user.uid;
            return db.collection("users").doc(uid).set({
                fullName,
                email,
                phone,
                country
            });
        })
        .then(() => {
            alert("Registration successful!");
            window.location.href = "loading.html";
        })
        .catch((err) => {
            if (err.code === "auth/email-already-in-use") {
                alert("Email already in use. Logging you in...");
                login(email, password);
            } else {
                alert("Signup failed: " + err.message);
            }
        });
};

const login = (email, password) => {
    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            alert("Login successful!");
            window.location.href = "loading.html";
        })
        .catch((err) => {
            alert("Login failed: " + err.message);
        });
};
