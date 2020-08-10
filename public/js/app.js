const requestModal = document.querySelector(".new-request");
const requestLink = document.querySelector(".add-request");
const requestForm = document.querySelector(".new-request form");
const accountModal = document.querySelector(".account-modal");
const accountInfo = document.querySelector(".accountInfo");
const accountDetails = document.querySelector(".account-details");
const buttonVerify = document.querySelector(".buttonVerify");
// open request modal
requestLink.addEventListener("click", () => {
  requestModal.classList.add("open");
});

// close request modal
requestModal.addEventListener("click", (e) => {
  if (e.target.classList.contains("new-request")) {
    requestModal.classList.remove("open");
  }
});

// open account Info modal
accountInfo.addEventListener("click", () => {
  accountModal.classList.add("open");
});

//closing account Info modal
accountModal.addEventListener("click", (e) => {
  if (e.target.classList.contains("account-modal")) {
    accountModal.classList.remove("open");
  }
});
// adding a request frontend

requestForm.addEventListener("submit", (e) => {
  console.log(e)
  e.preventDefault();
  let requestInput = requestForm.request.value;

  const addRequest = firebase.functions().httpsCallable("addRequest");
  addRequest({
    text: requestInput,
    upvotes: 0,
  })
    .then(() => {
      requestForm.reset();
      requestModal.classList.remove("open");
      requestForm.querySelector(".error").textContent = "";
    })
    .catch((error) => {
      requestForm.querySelector(".error").textContent = error.message;
    });
});

// notificition
const notification = document.querySelector(".notification");
const showNotification = (message) => {
  notification.textContent = message;
  notification.classList.add("active");
  setTimeout(() => {
    notification.classList.remove("active");
    notification.textContent = "";
  }, 4000);
};

// showing account details

const setupUI = (user) => {
  if (user) {
    if (!user.emailVerified) {
      db.collection("users")
        .doc(user.uid)
        .get()
        .then((doc) => {
          const html = `
          <div> 
            <div> Logged in as: &nbsp <span> ${user.email}</span></div>
            <div> Account verified: &nbsp <button id="verify" class="buttonVerify">Please Verify</button></div>
            </div>
          `;
          accountDetails.innerHTML = html;
          const button = document.getElementById('verify');
          button.addEventListener('click', (e) => {
            console.log(e.target)
            sendVerificationEmail();
            window.alert("email for verification has been sent. Please check your email");
            setTimeout(() => {accountModal.classList.remove("open")}, 1000)
          })
        });
    } else {
      db.collection("users")
        .doc(user.uid)
        .get()
        .then((doc) => {
          const html = `
          <div>
            <div> <p>Logged in as: &nbsp <span> ${user.email}</span> </p></div>
            <div> <p>Your status: &nbsp <span class="verified">${user.emailVerified}  </span></p></div>
          </div>
          `;
          accountDetails.innerHTML = html;
        });
    }
  }
};

