async function renderSurah() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const nomor =
        params.get("id") || "78";

    try {

        const response =
            await fetch(
                `data/${nomor}.json`
            );

        const data =
            await response.json();

        const surah =
            data[nomor];

        if (!surah) {
            throw new Error(
                "Data surah tidak ditemukan"
            );
        }

        document.title =
            `Surah ${surah.name_latin}`;

        document.getElementById(
            "surah-title"
        ).textContent =
            `Surah ${surah.name_latin}`;

        const container =
            document.getElementById(
                "dzikir-content"
            );

        container.innerHTML = "";

        Object.keys(surah.text)
        .forEach(no => {

            const card =
                document.createElement("div");

            card.className =
                "dzikir-card";

            card.innerHTML = `
                <div class="info-row">
                    <span class="doa-title">
                        ${surah.name_latin} - Ayat ${no}
                    </span>
                </div>

                <span class="arabic">
                    ${surah.text[no]}
                </span>

                <details>
                    <summary>
                        Tampilkan Artinya
                    </summary>

                    <span class="translation">
                        ${surah.translations.id.text[no]}
                    </span>
                </details>
            `;

            container.appendChild(card);

        });

    } catch(error) {

        document.getElementById(
            "dzikir-content"
        ).innerHTML =
            `<h3>Surah tidak ditemukan</h3>`;

        console.error(error);
    }
}

document.addEventListener(
    "DOMContentLoaded",
    renderSurah
);

renderSurah();
