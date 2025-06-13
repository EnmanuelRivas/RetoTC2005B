// Obtiene el elemento del overlay del formulario
const overlay = document.getElementById("form-overlay");

document.querySelector(".flashcard:first-child").addEventListener("click", () => {
  overlay.classList.remove("d-none");
});

