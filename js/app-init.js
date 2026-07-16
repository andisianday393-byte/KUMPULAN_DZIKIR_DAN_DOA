document.addEventListener("DOMContentLoaded", async () => {
    try {
        await loadDzikir();
        initSearch();
        initDrawer();
        initTheme();
        initFontSlider();
        initWakeLock();
    } catch (err) {
        console.error(err);
    }
});