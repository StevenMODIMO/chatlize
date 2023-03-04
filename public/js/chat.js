const socket = io();
const room_form = document.getElementById("room-form");
const room_input = document.getElementById("room-input");
const join_form = document.getElementById("join-form");
const join_input = document.getElementById("join-input");
const user_rooms = document.getElementById("retrieve");
const rooms = document.getElementById("rooms");
const invited = document.getElementById("invited");
const btn = document.getElementById("del");
const socketForm = document.getElementById("text")
const msg = document.getElementById("msg")
const chats = document.getElementById("chats")

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
        location.reload()
        btn.addEventListener("click", () => {
          fetch(`/chat/:${data._id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }) 
          location.reload()
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
    .then(data => {
      const items = document.createElement("h1");
        items.textContent = data.room_name;
        invited.appendChild(items);
    });
  join_input.value = "";
}); 

window.addEventListener("load", () => {
  fetch("/chat/user-rooms")
    .then((res) => res.json())
    .then((data) => {
      const info = data.map((room) => {
        const items = document.createElement("h1");
        const id = document.createElement("h4");
        const btn = document.createElement("button");
        items.textContent = room.room_name;
        id.textContent = room._id;
        btn.textContent = "Delete";
        rooms.appendChild(items);
        rooms.appendChild(id);
        rooms.append(btn);
        items.addEventListener("click", () => {
          socket.emit("join-room", items.innerText)
        })

        socketForm.addEventListener("submit", e => {
          e.preventDefault()
            if(msg.value) {
              socket.emit("message", msg.value)
              msg.value = ""
            }
        })

        socket.on("chat", msg => {
          const h3 = document.createElement("h3")
          h3.textContent = msg
          chats.appendChild(h3)
        })

        btn.addEventListener("click", () => {
          fetch(`/chat/:${room._id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }) 
          location.reload()
        });
      });
    });

  fetch("/chat/joined-rooms")
    .then((res) => res.json())
    .then((data) => {
      const info = data.map((room) => {
        const items = document.createElement("h1");
        items.textContent = room;
        invited.appendChild(items);
        items.addEventListener("click", () => {
          socket.emit("join-room", items.innerText)
        })
      });
    });

    fetch("/https://ap-south-1.aws.data.mongodb-api.com/app/data-extkq/endpoint/data/v1")
    .then(res => res.json())
    .then(data => console.log(data))
});

// iw00cZAKRgVdWGQ6dytkdDaxAyDqMb8bapwv5UOA1QBsnz2iq6j2IxaW9HagHDpz