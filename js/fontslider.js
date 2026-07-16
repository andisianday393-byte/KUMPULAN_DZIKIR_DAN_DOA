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