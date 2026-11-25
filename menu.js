const menuButton = document.getElementById("menu-toggle");
const navigation = document.getElementById("main-nav");

menuButton.addEventListener("click", () => {
  navigation.classList.toggle("active");

  const isOpen = navigation.classList.contains("active");

  menuButton.setAttribute("aria-expanded", isOpen);
  menuButton.textContent = isOpen ? "✕" : "☰";
});