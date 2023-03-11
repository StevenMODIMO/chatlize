const socket = io();
const roomPanel = document.querySelector(".rooms");
const barOne = document.querySelector(".bar-one");
const usersPanel = document.querySelector(".users");
const usersContainer = document.querySelector(".room-users");
const barTwo = document.querySelector(".bar-two");

const createForm = document.getElementById("create");
const joinForm = document.getElementById("join");
const createInput = document.getElementById("room-input");
const joinInput = document.getElementById("join-input");

const userRooms = document.querySelector(".user-rooms");
const joinedRooms = document.querySelector(".joined-rooms");

const modal = document.createElement("div");
const modal_icon = document.createElement("span");
const modal_text = document.createElement("div");
const modal_con = document.createElement("div");

modal_con.classList.add("modal_con");
modal.classList.add("modal");
modal_icon.classList.add("bi", "bi-pass");
modal_text.textContent = "Id copied to clipboard";
modal_con.appendChild(modal_icon);
modal_con.appendChild(modal_text);
modal.appendChild(modal_con);

barOne.addEventListener("click", () => {
  roomPanel.classList.toggle("show-rooms");
});

barTwo.addEventListener("click", () => {
  usersPanel.classList.toggle("show-users");
  usersContainer.classList.toggle("users-panel");
});

createForm.addEventListener("submit", (e) => {
  e.preventDefault();
  fetch("/chat/new-room", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ roomName: createInput.value }),
  })
    .then((res) => res.json())
    .then((room) => {
      const avatar = document.createElement("h3");
      const name = document.createElement("h3");
      const id = document.createElement("span");
      const del = document.createElement("span");
      const container_one = document.createElement("div");
      const container_two = document.createElement("div");
      const container = document.createElement("div");
      avatar.textContent = room.room_avatar;
      name.textContent = room.room_name;
      id.classList.add("bi", "bi-clipboard");
      del.classList.add("bi", "bi-trash");
      avatar.classList.add("avatar");
      container.classList.add("container");
      container_one.classList.add("container_one");
      container_two.classList.add("container_two");
      container_one.appendChild(avatar);
      container_one.appendChild(name);
      container_two.appendChild(id);
      container_two.appendChild(del);
      container.appendChild(container_one);
      container.appendChild(container_two);
      userRooms.appendChild(container);
      id.addEventListener("click", () => {
        navigator.clipboard.writeText(room._id);
        modal.style.display = "block";
        setTimeout(() => (modal.style.display = "none"), 2000);
      });

      del.addEventListener("click", () => {
        fetch(`/chat/delete/:${room._id}`, {
          method: "DELETE",
        })
          .then((res) => res.json())
          .then((del) => console.log(del));
      });
    });
  createInput.value = "";
});

joinForm.addEventListener("submit", (e) => {
  e.preventDefault();
  fetch("/chat/join-room", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ joinedRoom: joinInput.value }),
  })
    .then((res) => res.json())
    .then((obj) => {
      const name = document.createElement("h3");
      const leave = document.createElement("span");
      const join_container = document.createElement("div");
      join_container.classList.add("join_container");
      name.textContent = obj.room_name;
      leave.classList.add("bi", "bi-box-arrow-left");
      join_container.appendChild(name);
      join_container.appendChild(leave);
      joinedRooms.appendChild(join_container);

      leave.addEventListener("click", () => {
        fetch(`/chat/leave/:${obj._id}`, {
          method: "DELETE",
        })
          .then((res) => res.json())
          .then((msg) => console.log(msg));
      });
    });
  joinInput.value = "";
});

fetch("/chat/user-rooms")
  .then((res) => res.json())
  .then((data) => {
    data.map((room) => {
      const avatar = document.createElement("h3");
      const name = document.createElement("h3");
      const id = document.createElement("span");
      const del = document.createElement("span");
      const container_one = document.createElement("div");
      const container_two = document.createElement("div");
      const container = document.createElement("div");
      avatar.textContent = room.room_avatar;
      name.textContent = room.room_name;
      id.classList.add("bi", "bi-clipboard");
      del.classList.add("bi", "bi-trash");
      avatar.classList.add("avatar");
      container.classList.add("container");
      container_one.classList.add("container_one");
      container_two.classList.add("container_two");
      container_one.appendChild(avatar);
      container_one.appendChild(name);
      container_two.appendChild(id);
      container_two.appendChild(del);
      container.appendChild(container_one);
      container.appendChild(container_two);
      userRooms.appendChild(container);
      id.addEventListener("click", () => {
        navigator.clipboard.writeText(room._id);
        modal.style.display = "block";
        setTimeout(() => (modal.style.display = "none"), 2000);
      });

      del.addEventListener("click", () => {
        fetch(`/chat/delete/:${room._id}`, {
          method: "DELETE",
        })
          .then((res) => res.json())
          .then((del) => console.log(del));
      });
    });
  });

fetch("/chat/joined-rooms")
  .then((res) => res.json())
  .then((data) => {
    data.map((obj) => {
      console.log(obj)
      const name = document.createElement("h3");
      const leave = document.createElement("span");
      const join_container = document.createElement("div");
      join_container.classList.add("join_container");
      name.textContent = obj.room_name;
      leave.textContent = "Leave";
      leave.classList.add("exit")
      join_container.appendChild(name);
      join_container.appendChild(leave);
      joinedRooms.appendChild(join_container);

      leave.addEventListener("click", () => {
        fetch(`/chat/leave/:${obj._id}`, {
          method: "DELETE",
        })
          .then((res) => res.json())
          .then((msg) => console.log(msg));
      });
    });
  });

document.body.appendChild(modal);
