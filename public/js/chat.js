const socket = io();
const room_form = document.getElementById("room-form");
const room_input = document.getElementById("room-input");
const join_form = document.getElementById("join-form");
const join_input = document.getElementById("join-input");
const rooms = document.getElementById("rooms");
const invited = document.getElementById("invited");
const btn = document.getElementById("del");
const socketForm = document.getElementById("text");
const msg = document.getElementById("msg");
const chats = document.getElementById("chats");
const forms = document.querySelector(".forms")
const showForms = document.querySelector(".bar-one")

showForms.addEventListener("click", () => {
  if(forms.classList.contains("forms")) {
    forms.classList.remove("forms")
    forms.classList.add("show-forms")
  } else {
    forms.classList.remove("show-forms")
    forms.classList.add("forms")
  }
})


// Create a New Room
room_form.addEventListener("submit", (e) => {
  e.preventDefault();
  fetch("/chat/new-room", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ roomName: room_input.value }),
  })
    .then((res) => res.json())
    .then((data) => {
      const items = document.createElement("h1");
      const id = document.createElement("h4");
      const btn = document.createElement("button");
      items.textContent = data.room_name;
      id.textContent = data._id;
      btn.textContent = "Delete";
      rooms.appendChild(items);
      rooms.appendChild(id);
      rooms.append(btn);
      location.reload();
      btn.addEventListener("click", () => {
        fetch(`/chat/:${data._id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
        location.reload();
      });
    });
  room_input.value = "";
});

// Join an existing room
join_form.addEventListener("submit", (e) => {
  e.preventDefault();
  fetch("/chat/join-room", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ joinedRoom: join_input.value }),
  })
    .then((res) => res.json())
    .then((data) => {
      const items = document.createElement("h1");
      items.textContent = data.room_name;
      invited.appendChild(items);
      location.reload();
    });
  join_input.value = "";
});

window.addEventListener("load", () => {
  fetch("/chat/user-rooms")
    .then((res) => res.json())
    .then((data) => {
      const info = data.map((room) => {
        const container = document.createElement("div")
        const con = document.createElement("div")
        const tittle = document.createElement("div");
        const id = document.createElement("i");
        const btn = document.createElement("i");
        tittle.textContent = room.room_name;
        id.classList.add("bi", "bi-clipboard");
        btn.classList.add("bi", "bi-trash3");
        tittle.classList.add("title")
        container.appendChild(tittle);
        container.classList.add("container")
        con.appendChild(id);
        con.append(btn);
        con.classList.add("del-id")
        container.appendChild(con)
        rooms.appendChild(container)
        tittle.addEventListener("click", () => {
          socket.emit("join-room", room.room_name);
         });

        socketForm.addEventListener("submit", (e) => {
          e.preventDefault();
          if (msg.value) {
            socket.emit("message", msg.value);
            msg.value = "";
          }
        });

        console.log(rooms)
        socket.on("chat", (info) => {
          const h3 = document.createElement("h3")
          const sender = document.createElement("div")
          const img = document.createElement("img")
          const date = document.createElement("div")
          h3.textContent = info.msg
          sender.textContent = info.sender
          img.src = info.thumbnail
          date.textContent = info.date
          chats.appendChild(img)
          chats.appendChild(h3)
          chats.appendChild(sender)
          chats.appendChild(date)
          console.log(info)
        });

        id.addEventListener("click", () => {
          navigator.clipboard.writeText(room._id)
        })

        btn.addEventListener("click", () => {
          fetch(`/chat/:${room._id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          });
          location.reload();
        });
      });
    });

  fetch("/chat/joined-rooms")
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
    });
});

// iw00cZAKRgVdWGQ6dytkdDaxAyDqMb8bapwv5UOA1QBsnz2iq6j2IxaW9HagHDpz
