const quotesList = document.querySelector("#quotes-list");
const form = document.querySelector("#add-quotes-form");

//create element for name and quotes
function renderQuotes(doc) {
  let li = document.createElement("li");
  let name = document.createElement("span");
  let quotes = document.createElement("span");
  let cross = document.createElement("div");

  li.setAttribute("data-id", doc.id);
  name.textContent = doc.data().name;
  quotes.textContent = doc.data().quotes;
  cross.textContent = "x";

  li.appendChild(name);
  li.appendChild(quotes);
  li.appendChild(cross);

  quotesList.appendChild(li);

  //delete data
  cross.addEventListener("click", (e) => {
    e.stopPropagation();
    let id = e.target.parentElement.getAttribute("data-id");
    db.collection("quotes").doc(id).delete();
  });
}

//getting data from firestore
// db.collection("quotes")
//   .get()
//   .then((snapshot) => {
//     snapshot.docs.forEach((doc) => {
//       renderQuotes(doc);
//     });
//   });

//saving new data
form.addEventListener("submit", (e) => {
  e.preventDefault();
  db.collection("quotes").add({
    name: form.name.value,
    quotes: form.quotes.value,
  });
  form.name.value = "";
  form.quotes.value = "";
});

//realtime-message listner
db.collection("quotes")
  .orderBy("quotes")
  .onSnapshot((snapshot) => {
    let changes = snapshot.docChanges();
    changes.forEach((change) => {
      if (change.type == "added") {
        renderQuotes(change.doc);
      } else if (change.type == "removed") {
        let li = quotesList.querySelector("[data-id=" + change.doc.id + "]");
        quotesList.removeChild(li);
      }
    });
  });
