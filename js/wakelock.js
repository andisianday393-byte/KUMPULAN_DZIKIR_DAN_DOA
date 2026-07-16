function initWakeLock() {
let wakeLock = null;
const wakeBtn = document.getElementById("wakeLockBtn");
if (!wakeBtn) {
        console.log("wakeLockBtn tidak ditemukan");
        return;
    }

async function enableWakeLock() {
    try {
        wakeLock = await navigator.wakeLock.request("screen");

        wakeBtn.innerHTML =
            '<i class="fa-solid fa-lock-open"></i>';

        wakeBtn.title = "Standby Aktif";

        wakeLock.addEventListener("release", () => {
            wakeBtn.innerHTML =
                '<i class="fa-solid fa-mobile-screen-button"></i>';

            wakeBtn.title = "Standby Layar";
        });

    } catch (err) {
        alert("Perangkat tidak mendukung Standby Layar.");
    }
}

async function disableWakeLock() {
    if (wakeLock) {
        await wakeLock.release();
        wakeLock = null;

        wakeBtn.innerHTML =
            '<i class="fa-solid fa-mobile-screen-button"></i>';

        wakeBtn.title = "Standby Layar";
    }
}

if (wakeBtn) {
    wakeBtn.addEventListener("click", async () => {
        if (wakeLock) {
            disableWakeLock();
        } else {
            enableWakeLock();
        }
    });
}

// Jika kembali ke tab, aktifkan lagi bila sebelumnya aktif
document.addEventListener("visibilitychange", async () => {
    if (wakeLock !== null && document.visibilityState === "visible") {
        enableWakeLock();
    }
});
}
