function toggleDzikir(btn, type){

    const card = btn.closest(".dzikir-card");
    const target = card.querySelector("." + type);

    if(!target) return;

    target.style.display =
        target.style.display === "block"
            ? "none"
            : "block";

    const actions = card.querySelector(".info-actions");

    const latinOpen =
        card.querySelector(".latin").style.display === "block";

    const artiOpen =
        card.querySelector(".translation").style.display === "block";

    actions.classList.toggle("expanded", latinOpen || artiOpen);
}

function copyDzikir(btn){

    const card = btn.closest(".dzikir-card");

    const arabic =
        card.querySelector(".arabic")?.innerText || "";

    const latin =
        card.querySelector(".latin")?.innerText || "";

    const arti =
        card.querySelector(".translation")?.innerText || "";

    const text =
`${arabic}

${latin}

${arti}`;

    navigator.clipboard.writeText(text);

    btn.innerHTML = '<i class="fa-solid fa-check"></i>';

    setTimeout(()=>{
        btn.innerHTML='<i class="fa-regular fa-copy"></i>';
    },1200);

}

function shareDzikir(btn){

    const card = btn.closest(".dzikir-card");

    const arabic =
        card.querySelector(".arabic")?.innerText || "";

    const latin =
        card.querySelector(".latin")?.innerText || "";

    const arti =
        card.querySelector(".translation")?.innerText || "";

    const text =
`${arabic}

${latin}

${arti}`;

    if(navigator.share){

        navigator.share({
            title:"Dzikir Pagi",
            text:text
        });

    }else{

        navigator.clipboard.writeText(text);

        alert("Perangkat tidak mendukung berbagi. Teks telah disalin.");

    }

}

