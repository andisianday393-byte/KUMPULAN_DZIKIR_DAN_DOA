document.addEventListener("DOMContentLoaded", async () => {
    console.log("Memulai inisialisasi aplikasi...");

    // Fungsi-fungsi pembantu untuk inisialisasi aman
    const safeInit = async (fn, name) => {
        try {
            if (typeof fn === 'function') {
                await fn();
                console.log(`✅ ${name} berhasil dimuat.`);
            } else {
                console.warn(`⚠️ ${name} tidak ditemukan (skip).`);
            }
        } catch (error) {
            console.error(`❌ Error saat menjalankan ${name}:`, error);
        }
    };

    // Urutan inisialisasi
    await safeInit(window.loadDzikir, "loadDzikir");
    await safeInit(window.initTasbih, "initTasbih");
    await safeInit(window.initSearch, "initSearch");
    await safeInit(window.initDrawer, "initDrawer");
    await safeInit(window.initTheme, "initTheme");
    await safeInit(window.initFontSlider, "initFontSlider");
    await safeInit(window.initWakeLock, "initWakeLock");

    console.log("Sistem inisialisasi selesai dijalankan.");
});
