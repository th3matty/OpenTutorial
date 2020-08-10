const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// auth trigger (new user signUp)

exports.newUserSignUp = functions.auth.user().onCreate((user) => {
  console.log("user created", user.email, user.uid);
  return admin.firestore().collection("users").doc(user.uid).set({
    email: user.email,
    name: user.displayName,
    id: user.uid,
    upvotedOn: [],
  });
});

exports.userDeleted = functions.auth.user().onDelete((user) => {
  console.log("user deleted", user.email, user.uid);

  const doc = admin.firestore().collection("users").doc(user.uid);
  return doc.delete();
});

//http callable function ( adding a request)
// data - Object = data we send to the functions ( comes from frontend)
// context - Object = includes authentication state of the user ( not logged in or verified)
// in case user inspect elements and get rid of the login Modal and try to add new "requests"

exports.addRequest = functions.https.onCall((data, context) => {
  if (!context.auth) {
    console.log("context auth:", context.auth);
    throw new functions.https.HttpsError(
      "unauthenticated",
      "only authenticated users can add requests"
    );
  }
  // check if the added request is not longer then 30 letters
  if (data.text.length > 30 && data.text >3) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "request must be no more than 30 characters long and at least 4 charactesers long"
    );
  }
  // adding request
  return admin.firestore().collection("requests").add({
    text: data.text,
    upvotes: 0,
  });
});

// upvote callable function
exports.upvote = functions.https.onCall((data, context) => {
  // check auth state of user
  if (!context.auth) {
    console.log("context auth:", context.auth);
    throw new functions.https.HttpsError(
      "unauthenticated",
      "only authenticated users can add requests"
    );
  }
  // get refs for user doc/collection and requests doc/collection
  const user = admin.firestore().collection("users").doc(context.auth.uid);
  const request = admin.firestore().collection("requests").doc(data.id);

  return user.get().then((doc) => {
    // check user has not already upvoted the request
    if (doc.data().upvotedOn.includes(data.id)) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "You can only upvote a tutorial once"
      );
    }

    // update user array
    return user
      .update({
        upvotedOn: [...doc.data().upvotedOn, data.id],
      })
      .then(() => {
        // update votes in the request collection
        return request.update({
          upvotes: admin.firestore.FieldValue.increment(1),
        });
      })
      .catch((err) => {
        console.log(err.message);
      });
  });
});
