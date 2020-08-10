const authSwitchLinks = document.querySelectorAll(".switch");
const authModals = document.querySelectorAll(".auth .modal");
const authWrapper = document.querySelector(".auth");
const registerForm = document.querySelector(".register");
const loginForm = document.querySelector(".login");
const signOut = document.querySelector(".sign-out");
const resetForm = document.querySelector(".resetForm");
const mailField = document.getElementById("mail");
const resetPassword = document.getElementById("resetPassword");
let state = 0;

// toggle auth modals
authSwitchLinks.forEach((link) => {
  link.addEventListener("click", () => {
    authModals.forEach((modal) => modal.classList.toggle("active"));
  });
});

// register form
registerForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = registerForm.email.value;
  const password = registerForm.password.value;

  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((user) => {
      console.log("registered", user);
      state = 1;
      sendVerificationEmail();
      registerForm.reset();
    })

    .catch((error) => {
      registerForm.querySelector(".error").textContent = error.message;
    });
});
//Function called right after the signUpWithEmailAndPassword to send verification emails
const sendVerificationEmail = () => {

  let userVerify = firebase.auth().currentUser;
  //Built in firebase function responsible for sending the verification email
  userVerify.sendEmailVerification().then(() => {
    console.log("email for verification has been sent. Please check your email")
  })
    .catch((error) => {
      console.error(error);
    });
};

// login form
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = loginForm.email.value;
  const password = loginForm.password.value;

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((user) => {
      console.log("logged in", user);
      loginForm.reset();
    })
    .catch((error) => {
      loginForm.querySelector(".error").textContent = error.message;
    });
});

// sign out
signOut.addEventListener("click", () => {
  firebase
    .auth()
    .signOut()
    .then(() => console.log("signed out"));
});

// auth listener
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    console.log("user logged in: ", user)
    authWrapper.classList.remove("open");
    authModals.forEach((modal) => modal.classList.remove("active"));
    setupUI(user);
  } else {
    authWrapper.classList.add("open");
    authModals[0].classList.add("active");
    setupUI();
  }
});

// reset password

const resetPasswordFunction = () => {
  const email = MailField.value;

  if (email != "") {
    auth
      .sendPasswordResetEmail(email)
      .then(() => {
        console.log("Password Reset Email Sent Successfully!");
      })
      .catch((error) => {
        console.error(error);
      });
  }
};

resetPassword.addEventListener("click", resetPasswordFunction);
