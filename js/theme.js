function initTheme() {
    const toggleButton = document.getElementById("themeToggle");

    if (!toggleButton) {
        console.log("themeToggle tidak ditemukan");
        return;
    }

    const htmlElement = document.documentElement;

    const savedTheme = localStorage.getItem("theme") || "light";
    htmlElement.setAttribute("data-theme", savedTheme);
    updateThemeIcon(savedTheme);

    toggleButton.addEventListener("click", () => {
        const current = htmlElement.getAttribute("data-theme");
        const next = current === "light" ? "dark" : "light";

        htmlElement.setAttribute("data-theme", next);
        localStorage.setItem("theme", next);
        updateThemeIcon(next);
    });

    function updateThemeIcon(theme) {
        const icon = document.querySelector(".toggle-icon");
        if (!icon) return;

        icon.className =
            theme === "dark"
                ? "fa-solid fa-moon toggle-icon"
                : "fa-solid fa-sun toggle-icon";
    }
}
