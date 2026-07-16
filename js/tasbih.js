function initTasbih() {
    let tasbihTarget = 0;
    let tasbihCount = 0;
    let tasbihFinished = false;
    let currentTargetText = "";
    let closeTimeout = null;
  
    const popup = document.getElementById("tasbihPopup");
    const countEl = document.getElementById("tasbihCount");
    const progressEl = document.getElementById("tasbihProgress");
    const plusBtn = document.getElementById("tasbihPlus");
    const resetBtn = document.getElementById("tasbihReset");
    const closeBtn = document.getElementById("closeTasbih");
    const circle = document.getElementById("progressCircle");
    const percentText = document.getElementById("tasbihPercent");
    const statusEl = document.getElementById("tasbihStatus");
    const activeBox = document.getElementById("activeDzikirBox");
    const activeArabic = document.getElementById("activeArabic");
    const activeTarget = document.getElementById("activeTargetText");
    const selectWrap =  document.getElementById("tasbihSelectWrap");
    const tasbihSelectBtn = document.getElementById("tasbihSelectBtn");
    const tasbihSelectText = document.getElementById("tasbihSelectText");
    const tasbihMenu = document.getElementById("tasbihMenu");    // Pastikan semua elemen popup tersedia
    if (
    !popup ||
    !countEl ||
    !progressEl ||
    !plusBtn ||
    !resetBtn ||
    !closeBtn ||
    !circle ||
    !percentText ||
    !selectWrap ||
    !tasbihSelectBtn ||
    !tasbihSelectText ||
    !tasbihMenu
) {
    console.error("Tasbih Popup belum ditemukan.");
    return;
}

    const radius = 75;
    const circumference = 2 * Math.PI * radius;

    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = circumference;

    function updateTasbih() {

    countEl.textContent = tasbihCount;
    progressEl.textContent = `${tasbihCount} / ${tasbihTarget}`;

    let percent = 0;

    if (tasbihTarget > 0) {
        percent = (tasbihCount / tasbihTarget) * 100;
    }

    if (percent > 100) percent = 100;

    percentText.textContent = Math.round(percent) + "%";

    const offset =
        circumference -
        (percent / 100) * circumference;

    circle.style.strokeDashoffset = offset;

    if (tasbihTarget > 0 && tasbihCount >= tasbihTarget) {

          statusEl.textContent = "🎉 Target Tercapai";
statusEl.classList.add("show");
      
        tasbihCount = tasbihTarget;
        countEl.classList.add("tasbih-finish");

        if (!tasbihFinished) {
            tasbihFinished = true;

            // Getaran saat target tercapai
            navigator.vibrate?.([200, 80, 200, 80, 400]);
        }

    } else {

        statusEl.textContent = "";
statusEl.classList.remove("show");

        countEl.classList.remove("tasbih-finish");
        tasbihFinished = false;

    }
}

    // Membuka popup menggunakan event delegation
    document.addEventListener("click", (e) => {

    const btn = e.target.closest(".tasbih-link");

    if (!btn) return;

    const card = btn.closest(".dzikir-card");

const options = JSON.parse(btn.dataset.options || "[]");

tasbihMenu.innerHTML = "";

if (options.length > 0){

    selectWrap.style.display = "flex";

    options.forEach(value=>{

        tasbihMenu.insertAdjacentHTML(
            "beforeend",
            `<button data-value="${value}">${value}x</button>`
        );

    });

    tasbihSelectText.textContent = options[0] + "x";

}else{

    selectWrap.style.display = "none";

}
      
    activeArabic.innerHTML = card.querySelector(".arabic").innerHTML;

currentTargetText = btn.dataset.targettext || "";

if (currentTargetText) {
    activeTarget.textContent = currentTargetText.replace("{x}", tasbihTarget);
} else {
    activeTarget.textContent = `Dibaca ${tasbihTarget}x`;
}                                                     
activeBox.classList.add("show");

    if (options.length > 0) {
    tasbihTarget = Number(options[0]);   // pilihan pertama sebagai default
    tasbihSelectText.textContent = options[0] + "x";
    activeTarget.textContent = `Dibaca ${tasbihTarget}x`;
} else {
    tasbihTarget = Number(btn.dataset.target) || 0;
}
    tasbihCount = 0;
tasbihFinished = false;
if (closeTimeout) {
    clearTimeout(closeTimeout);
    closeTimeout = null;
}

popup.style.display = "flex";

requestAnimationFrame(() => {
    popup.classList.add("show");
    activeBox.classList.add("show");
});

document.body.classList.add("blur-background");

updateTasbih();
});

    plusBtn.addEventListener("click", () => {

    if (tasbihTarget === 0) return;

    // Tidak bisa diklik lagi setelah selesai
    if (tasbihFinished) return;

    navigator.vibrate?.([30, 20, 30]);

    tasbihCount++;

    updateTasbih();

});

    tasbihSelectBtn.addEventListener("click",()=>{

    tasbihMenu.style.display =
        tasbihMenu.style.display==="block"
        ? "none"
        : "block";

});

    tasbihMenu.addEventListener("click", (e) => {

    if (!e.target.dataset.value) return;

    tasbihTarget = Number(e.target.dataset.value);

    tasbihSelectText.textContent = tasbihTarget + "x";

    if (currentTargetText) {
    activeTarget.textContent = currentTargetText.replace("{x}", tasbihTarget);
} else {
    activeTarget.textContent = `Dibaca ${tasbihTarget}x`;
}

    tasbihCount = 0;
    tasbihFinished = false;

    updateTasbih();

    tasbihMenu.style.display = "none";

});
  
    resetBtn.addEventListener("click", () => {

    tasbihCount = 0;
    tasbihFinished = false;

    updateTasbih();

});

    closeBtn.addEventListener("click", () => {
    activeBox.classList.remove("show");
    popup.classList.remove("show");
    selectWrap.style.display = "none";

    document.body.classList.remove("blur-background");

    closeTimeout = setTimeout(() => {
    popup.style.display = "none";
    closeTimeout = null;
}, 1000); // sesuaikan dengan durasi transition CSS
});

    // Tutup popup saat klik di luar box
    popup.addEventListener("click", (e) => {
    if (e.target === popup) {
        activeBox.classList.remove("show");
        popup.classList.remove("show");
        selectWrap.style.display = "none";

        document.body.classList.remove("blur-background");

        closeTimeout = setTimeout(() => {
    popup.style.display = "none";
    closeTimeout = null;
}, 1000);
    }
});

}
