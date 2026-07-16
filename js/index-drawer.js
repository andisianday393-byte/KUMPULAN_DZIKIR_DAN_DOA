function initDrawer(){

    const drawerBtn = document.getElementById("drawerBtn");
    const drawer = document.getElementById("headerDrawer");
    const searchBox = document.querySelector(".search-box");

    if(!drawerBtn || !drawer) return;

    drawerBtn.addEventListener("click", (e)=>{

        e.stopPropagation();

        const open = drawer.classList.toggle("open");
drawerBtn.classList.toggle("open", open);

        searchBox?.classList.toggle("hide", open);

        drawerBtn.innerHTML = open
            ? '<i class="fa-solid fa-xmark"></i>'
            : '<i class="fa-solid fa-sliders"></i>';

    });

    document.addEventListener("pointerdown",(e)=>{

        if(
            drawer.classList.contains("open") &&
            !drawer.contains(e.target) &&
            !drawerBtn.contains(e.target)
        ){

            drawer.classList.remove("open");

            searchBox?.classList.remove("hide");

            drawerBtn.innerHTML =
                '<i class="fa-solid fa-sliders"></i>';

        }

    });

}

document.addEventListener("DOMContentLoaded", () => {
    initDrawer();
});