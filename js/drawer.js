function initDrawer() {
  
const drawerBtn = document.getElementById("drawerBtn");
const drawer = document.getElementById("headerDrawer");
const title = document.getElementById("headerTitle");

if (drawerBtn && drawer && title) {

    drawerBtn.onclick = () => {

    const open = drawer.classList.toggle("open");

    const isLandscape = window.matchMedia("(orientation: landscape)").matches;

    // Sembunyikan judul hanya saat portrait
    if (!isLandscape) {
        title.classList.toggle("hide", open);
    } else {
        title.classList.remove("hide");
    }

    // Drawer ditutup
    if (!open) {
        const suggestionBox = document.querySelector(".suggestion-box");
        if (suggestionBox) {
            suggestionBox.innerHTML = "";
        }
    }

    drawerBtn.classList.toggle("open", open);

    drawerBtn.innerHTML = open
        ? '<i class="fa-solid fa-xmark drawer-close-icon"></i>'
        : '<i class="fa-solid fa-sliders"></i>';

};

}  
document.addEventListener("pointerdown", (e) => {

    if (drawer && drawerBtn && drawer.classList.contains("open")) {

        const isControl =
    e.target.closest("#themeToggle") ||
    e.target.closest("#fontSizeBtn") ||
    e.target.closest("#wakeLockBtn") ||
    e.target.closest(".search-box");

if (
    !drawer.contains(e.target) &&
    !drawerBtn.contains(e.target) &&
    !isControl
) {
    drawer.classList.remove("open");
    title.classList.remove("hide");

    const suggestionBox = document.querySelector(".suggestion-box");
    if (suggestionBox) {
        suggestionBox.innerHTML = "";
    }

    drawerBtn.classList.remove("open");
    drawerBtn.innerHTML =
        '<i class="fa-solid fa-sliders"></i>';
}
    }

});
}