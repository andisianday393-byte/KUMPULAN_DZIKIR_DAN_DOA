async function loadDzikir() {
console.log("loadDzikir mulai");
    const container = document.getElementById("dzikirContent");

    if (!container) return;

    try {

        const response = await fetch("json/dzikir-pagi.json");

        if (!response.ok) {
            throw new Error("Gagal memuat JSON");
        }

        const data = await response.json();

        container.innerHTML = "";

        data.dzikir.forEach(item => {

            const tasbihButton = item.tasbih
? `
<span
    class="tasbih-link"
    data-target="${item.tasbih}"
    data-options='${JSON.stringify(item.options || [])}'
    data-targettext="${item.targetText || ""}">
    📿 Tasbih
</span>
`
: "";

          const arabicClass = item.arabic.includes("\n")
    ? "arabic arabic-multiline"
    : "arabic";
          
            container.insertAdjacentHTML(
                "beforeend",
                `
                <div class="dzikir-card">

                    <span class="${arabicClass}">${item.arabic}</span>

                    <details>

                        <summary>
                            Tampilkan Artinya
                        </summary>

                        <span class="translation">
                            "${item.translation}"
                        </span>

                    </details>

                    <div class="info-row">

                        <span class="instruction">
                            ${item.instruction}
                        </span>

                        <div class="info-actions">

                            ${tasbihButton}

                            <span class="ref-number">
                                ${item.nomor}
                            </span>

                        </div>

                    </div>

                </div>
                `
            );

        });

    } catch (err) {

        console.error(err);

        container.innerHTML = `
            <div class="dzikir-card">
                Gagal memuat data dzikir.
            </div>
        `;
    }

}
