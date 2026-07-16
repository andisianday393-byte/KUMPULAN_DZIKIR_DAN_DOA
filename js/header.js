function initSearch() {

    const searchBox = document.querySelector(".search-box input");
    const searchIcon = document.querySelector(".search-icon");

    if (!searchBox) return;

    const suggestionBox = document.createElement("div");
    suggestionBox.className = "suggestion-box";
    searchBox.parentNode.appendChild(suggestionBox);

  const pages = {
    "dzikir pagi": "dzikir-pagi.html",
    "dzikir petang": "dzikir-petang.html",
    "dzikir shalat": "dzikir-setelah-solat.html",
    "doa harian": "doa-harian.html",
    "kumpulan doa": "kumpulan-doa.html",
    "bacaan shalat": "bacaan-shalat.html",
    "juz amma": "juz-amma.html",
    "kalender hijriah": "kalender-hijriah.html",
    "hafalan": "hafalan.html",
    "tasbih": "tasbih.html",
    "kisah nabi": "kisah-nabi.html",
    "hadits": "intent://#Intent;package=com.saltanera.hadits;end",
    "kiblat": "arah-kiblat.html"
  };

  let currentFocus = -1;
  let history = JSON.parse(localStorage.getItem("searchHistory")) || {};

  // tampilkan suggestion saat mengetik
  searchBox.addEventListener("input", () => {
    const query = searchBox.value.trim().toLowerCase();
    suggestionBox.innerHTML = "";
    currentFocus = -1;

    if (!query) {
      showHistory();
      return;
    }

    const historyMatches = Object.keys(history)
      .filter(item => item.includes(query))
      .sort((a, b) => history[b].count - history[a].count);

    const pageMatches = Object.keys(pages).filter(key => key.includes(query));

    if (historyMatches.length > 0) {
      historyMatches.forEach(itemText => {
        const item = document.createElement("div");
        item.className = "suggestion-item history";

        const regex = new RegExp(`(${query})`, "gi");
        const lastTime = timeAgo(history[itemText].last);
        item.innerHTML = `🕘 ${itemText.replace(regex, "<b>$1</b>")} (${history[itemText].count}x, terakhir ${lastTime})`;

        item.addEventListener("click", () => {
          runSearch(itemText);
        });

        const deleteBtn = document.createElement("span");
        deleteBtn.textContent = "❌";
        deleteBtn.className = "delete-history";
        deleteBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          delete history[itemText];
          localStorage.setItem("searchHistory", JSON.stringify(history));
          searchBox.dispatchEvent(new Event("input"));
        });

        item.style.display = "flex";
        item.style.justifyContent = "space-between";
        item.appendChild(deleteBtn);

        suggestionBox.appendChild(item);
      });
    }

    if (pageMatches.length > 0) {
      pageMatches.forEach(match => {
        const item = document.createElement("div");
        item.className = "suggestion-item";

        const regex = new RegExp(`(${query})`, "gi");
        item.innerHTML = match.replace(regex, "<b>$1</b>");

        item.addEventListener("click", () => {
          goToPage(pages[match], match);
        });
        suggestionBox.appendChild(item);
      });
    }

    if (historyMatches.length === 0 && pageMatches.length === 0) {
      const errorMsg = document.createElement("div");
errorMsg.className = "search-error";
errorMsg.innerHTML = `
<span class="search-error-icon">❌</span>
<span>Kata kunci salah</span>
`;

suggestionBox.appendChild(errorMsg);
    }
  });

  // navigasi dengan keyboard
  searchBox.addEventListener("keydown", e => {
    let items = suggestionBox.querySelectorAll(".suggestion-item");
    if (e.key === "ArrowDown") {
      currentFocus++;
      addActive(items);
    } else if (e.key === "ArrowUp") {
      currentFocus--;
      addActive(items);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (currentFocus > -1 && items[currentFocus]) {
        items[currentFocus].click();
      } else {
        runSearch(searchBox.value.trim().toLowerCase());
      }
    }
  });

  function addActive(items) {
    if (!items) return;
    removeActive(items);
    if (currentFocus >= items.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = items.length - 1;
    items[currentFocus].classList.add("active");
  }

  function removeActive(items) {
    items.forEach(item => item.classList.remove("active"));
  }

  if (searchIcon) {
    searchIcon.addEventListener("click", () => {
      runSearch(searchBox.value.trim().toLowerCase());
    });
  }

  function runSearch(query) {
    console.log("Mencari:", query);
    if (pages[query]) {
      goToPage(pages[query], query);
    } else {
      suggestionBox.innerHTML = "<small style='color:red; padding-left: 10px;'>❌ Kata kunci salah</small>";


    }
  }

  function goToPage(url, query) {
    searchBox.value = "";
    suggestionBox.innerHTML = "";

    if (query) {
      if (!history[query]) {
        history[query] = { count: 0, last: Date.now() };
      }
      history[query].count++;
      history[query].last = Date.now();
      localStorage.setItem("searchHistory", JSON.stringify(history));
    }

    window.location.href = url;
  }

  function showHistory() {
    suggestionBox.innerHTML = "";
    const sortedHistory = Object.keys(history).sort((a, b) => history[b].count - history[a].count);

    if (sortedHistory.length > 0) {
      sortedHistory.slice(0, 5).forEach(itemText => {
        const item = document.createElement("div");
        item.className = "suggestion-item history";
        const lastTime = timeAgo(history[itemText].last);
        item.textContent = `🕘 ${itemText} (${history[itemText].count}x, terakhir ${lastTime})`;

        item.addEventListener("click", () => {
          runSearch(itemText);
        });

        const deleteBtn = document.createElement("span");
        deleteBtn.textContent = "❌";
        deleteBtn.className = "delete-history";
        deleteBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          delete history[itemText];
          localStorage.setItem("searchHistory", JSON.stringify(history));
          showHistory();
        });

        item.style.display = "flex";
        item.style.justifyContent = "space-between";
        item.appendChild(deleteBtn);

        suggestionBox.appendChild(item);
      });

      const clearBtn = document.createElement("div");
      clearBtn.className = "clear-history";
      clearBtn.innerHTML =
'<i class="fa-solid fa-broom"></i> Bersihkan Riwayat';
      clearBtn.addEventListener("click", () => {
        history = {};
        localStorage.removeItem("searchHistory");
        suggestionBox.innerHTML = "";
      });
      suggestionBox.appendChild(clearBtn);
    }
  }

  // fungsi untuk menampilkan "2 hari lalu", "5 menit lalu", dll
  function timeAgo(timestamp) {
    const diff = Date.now() - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} hari lalu`;
    if (hours > 0) return `${hours} jam lalu`;
    if (minutes > 0) return `${minutes} menit lalu`;
    return "baru saja";
  }

 function clearSearch() {
    searchBox.value = "";
    suggestionBox.innerHTML = "";
}

window.clearSearch = clearSearch; 
}

function initDrawer() {
  
const drawerBtn = document.getElementById("drawerBtn");
const drawer = document.getElementById("headerDrawer");
const title = document.getElementById("headerTitle");
const listBtn = document.getElementById("listBtn");
const playBtn = document.getElementById("playBtn");
const shareWrap = document.getElementById("sharePdfWrap");
  
if (drawerBtn && drawer && title) {

    drawerBtn.onclick = () => {

    const open = drawer.classList.toggle("open");
if (shareWrap) {
    if (open) {
        shareWrap.classList.add("hide");
    } else {
        setTimeout(() => {
            shareWrap.classList.remove("hide");
        }, 10);
    }
}

      if (listBtn) {
    if (open) {
        listBtn.classList.add("hide");
    } else {
        setTimeout(() => {
            listBtn.classList.remove("hide");
        }, 250);
    }
}
if (playBtn) {
    if (open) {
        playBtn.classList.add("hide");
    } else {
        setTimeout(() => {
            playBtn.classList.remove("hide");
          if (shareWrap) {
    shareWrap.classList.remove("hide");
}
        }, 300);
    }
}
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
if (listBtn) {
    listBtn.classList.remove("hide");
}
if (playBtn) {
    playBtn.classList.remove("hide");
}
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

function initFontSlider() {

let arabSize = 1.4;
let sliderVisible = false;

    const fontBtn = document.getElementById("fontSizeBtn");
    const sliderBox = document.getElementById("fontSliderBox");
    const slider = document.getElementById("fontSlider");
    const fontValue = document.getElementById("fontValue");

    if (!fontBtn || !sliderBox || !slider || !fontValue) return;

    slider.value = arabSize;

    document.querySelectorAll(".arabic").forEach(el => {
        el.style.fontSize = arabSize + "rem";
    });

    fontValue.textContent = arabSize;

    fontBtn.addEventListener("click", () => {
        sliderVisible = !sliderVisible;
        sliderBox.style.display = sliderVisible ? "flex" : "none";
    });

    slider.addEventListener("input", () => {
        arabSize = parseFloat(slider.value);

        document.querySelectorAll(".arabic").forEach(el => {
            el.style.fontSize = arabSize + "rem";
        });

        fontValue.textContent = slider.value;
    });

    document.addEventListener("pointerdown", (e) => {
        if (
            sliderVisible &&
            !sliderBox.contains(e.target) &&
            !fontBtn.contains(e.target)
        ) {
            sliderVisible = false;
            sliderBox.style.display = "none";
        }
    });
}

function initWakeLock() {let wakeLock = null;
const wakeBtn = document.getElementById("wakeLockBtn");
if (!wakeBtn) {
        console.log("wakeLockBtn tidak ditemukan");
        return;
    }

async function enableWakeLock() {
    try {
        wakeLock = await navigator.wakeLock.request("screen");

        wakeBtn.innerHTML =
            '<i class="fa-solid fa-lightbulb"></i>';

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

function initListDrawer() {
    const listBtn = document.getElementById("listBtn");
    const listDrawer = document.getElementById("doaListDrawer");
  
    // Lakukan pengecekan di awal
    if (!listBtn || !listDrawer) return;

    // Pindahkan querySelector ke sini (setelah dipastikan listDrawer ada)
    const thumb = listDrawer.querySelector(".list-scroll-thumb");

    // Buka / tutup daftar
    listBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        listDrawer.classList.toggle("show");
    });
    // Klik salah satu item daftar doa
    listDrawer.addEventListener("click", (e) => {

        const item = e.target.closest(".doa-list-item");
        if (!item) return;

        const targetId = item.dataset.target;
        const target = document.getElementById(targetId);

        if (target) {

    const header = document.querySelector(".top-header");
    const offset = header ? header.offsetHeight + 10 : 70;

    const y =
        target.getBoundingClientRect().top +
        window.pageYOffset -
        offset;

    window.scrollTo({
        top: y,
        behavior: "smooth"
    });

    listDrawer.classList.remove("show");
}

    });

    // Tutup daftar saat klik di luar
    document.addEventListener("pointerdown", (e) => {

        if (
            listDrawer.classList.contains("show") &&
            !listDrawer.contains(e.target) &&
            !listBtn.contains(e.target)
        ) {
            listDrawer.classList.remove("show");
        }

    });

// Tutup daftar saat klik di luar
document.addEventListener("pointerdown", (e) => {

    if (
        listDrawer.classList.contains("show") &&
        !listDrawer.contains(e.target) &&
        !listBtn.contains(e.target)
    ) {
        listDrawer.classList.remove("show");
    }

});

// ← TAMBAHKAN DI SINI

if (thumb) {

    function updateThumb() {

        const maxScroll =
            listDrawer.scrollHeight - listDrawer.clientHeight;

        const thumbHeight = Math.max(
            30,
            (listDrawer.clientHeight / listDrawer.scrollHeight) *
            listDrawer.clientHeight
        );

        const maxTop =
            listDrawer.clientHeight - thumbHeight;

        const top =
            maxScroll > 0
                ? (listDrawer.scrollTop / maxScroll) * maxTop
                : 0;

        thumb.style.height = thumbHeight + "px";
        thumb.style.transform = `translateY(${top}px)`;
    }

    updateThumb();

    listDrawer.addEventListener("scroll", updateThumb);

    window.addEventListener("resize", updateThumb);
}

// ← Lalu tutup function
}
  
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

function toggleActionMenu(btn){

    document.querySelectorAll(".action-menu.show").forEach(menu=>{
        if(menu !== btn.nextElementSibling){
            menu.classList.remove("show");
        }
    });

    btn.nextElementSibling.classList.toggle("show");
}

document.addEventListener("click", function(e){

    if (
        !e.target.closest(".action-menu") &&
        !e.target.closest(".menu-btn")
    ) {

        document.querySelectorAll(".action-menu.show")
            .forEach(menu => {
                menu.classList.remove("show");
            });

    }

});

function initDzikirActions() {

    window.toggleDzikir = function(btn) {

        const card = btn.closest(".dzikir-card");
        if (!card) return;

        const translation = card.querySelector(".translation");
        if (!translation) return;

        translation.style.display =
            translation.style.display === "block"
                ? "none"
                : "block";
    };

    window.toggleLatin = function(btn) {

        const menu = btn.closest(".action-menu");
        const card = menu.closest(".dzikir-card");

        if (!card) return;

        const latin = card.querySelector(".latin");

        latin.style.display =
            latin.style.display === "block"
                ? "none"
                : "block";

        menu.classList.remove("show");
    };

    window.copyDzikir = async function(btn) {

        const menu = btn.closest(".action-menu");
        const card = menu.closest(".dzikir-card");

        if (!card) return;

        const arabic =
            card.querySelector(".arabic")?.innerText.trim() || "";

        const latin =
            card.querySelector(".latin")?.innerText.trim() || "";

        const translation =
            card.querySelector(".translation")?.innerText.trim() || "";

        const instruction =
            card.querySelector(".instruction")?.innerText.trim() || "";

        const text =
`${arabic}

${latin}

${translation}

${instruction}`;

        try {

            await navigator.clipboard.writeText(text);

            menu.classList.remove("show");

            btn.innerHTML =
                '<i class="fa-solid fa-check"></i>';

            setTimeout(() => {
                btn.innerHTML = "Salin";
            }, 1500);

        } catch (err) {

            alert("Gagal menyalin teks.");

        }

    };

    window.shareDzikir = async function(btn) {

        const menu = btn.closest(".action-menu");
        const card = menu.closest(".dzikir-card");

        if (!card) return;

        const arabic =
            card.querySelector(".arabic")?.innerText.trim() || "";

        const latin =
            card.querySelector(".latin")?.innerText.trim() || "";

        const translation =
            card.querySelector(".translation")?.innerText.trim() || "";

        const instruction =
            card.querySelector(".instruction")?.innerText.trim() || "";

        const text =
`${arabic}

${latin}

${translation}

${instruction}`;

        menu.classList.remove("show");

        try {

            if (navigator.share) {

                await navigator.share({
                    title: "Dzikir",
                    text: text
                });

            } else {

                await navigator.clipboard.writeText(text);

                alert("Browser tidak mendukung Share. Teks telah disalin.");

            }

        } catch (err) {

            console.log("Share dibatalkan.");

        }

    };

}
function goBack() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = "/"; // Fallback ke home jika tidak ada history
    }
}

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
await safeInit(window.initDzikirActions, "initDzikirActions");
await safeInit(window.initTasbih, "initTasbih");
await safeInit(window.initSearch, "initSearch");
await safeInit(window.initDrawer, "initDrawer");
await safeInit(window.initListDrawer, "initListDrawer");
await safeInit(window.initTheme, "initTheme");
await safeInit(window.initFontSlider, "initFontSlider");
await safeInit(window.initWakeLock, "initWakeLock");
  
    console.log("Sistem inisialisasi selesai dijalankan.");
});
