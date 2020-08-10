var app = new Vue({
  el: "#app",
  data: {
    req: [],
  },
  methods: {
    upvotedRequest(id) {
      console.log(id);
      const upvote = firebase.functions().httpsCallable("upvote");
      upvote({ id: id }).catch((error) => {
        showNotification(error.message);
      });
    },
  },
  mounted() {
    const reference = firebase.firestore().collection("requests").orderBy('upvotes', 'desc');
    reference.onSnapshot((snapshot) => {
      console.log("snapshot: ", snapshot);
      let req = [];
      snapshot.forEach((doc) => {
        req.push({ ...doc.data(), id: doc.id });
      });
      this.req = req;
    });
  },
});
