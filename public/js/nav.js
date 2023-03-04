const menu = document.getElementById("menu-bar");
      const ul = document.querySelector("ul");
      menu.addEventListener("click", () => {
        if (ul.classList.contains("hide")) {
          ul.classList.remove("hide");
          ul.classList.add("show");
        } else {
          ul.classList.remove("show");
          ul.classList.add("hide");
        }
      });