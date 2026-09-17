document.addEventListener("DOMContentLoaded", () => {

    /* ============================
       AKTUALNOŚCI - LISTA
       ============================ */
    const container = document.querySelector("#aktualnosci");

    if (!container) return;

    function escapeHtml(str) {
        const div = document.createElement("div");
        div.textContent = str;
        return div.innerHTML;
    }

    function renderBody(raw) {
        const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
        const images = [];
        let match;

        while ((match = imageRegex.exec(raw)) !== null) {
            images.push({ alt: match[1], src: match[2] });
        }

        const textOnly = raw.replace(imageRegex, "").trim();
        const textHtml = typeof marked !== "undefined" ? marked.parse(textOnly) : textOnly;

        const galleryHtml = images.length
            ? `<div class="news-gallery">${images.map(img => `<img src="${img.src}" alt="${img.alt}">`).join("")}</div>`
            : "";

        return textHtml + galleryHtml;
    }

    function formatDate(dateStr) {
        const date = new Date(dateStr);
        if (isNaN(date)) return dateStr;
        return date.toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric" });
    }

    function renderCard(post) {
        const title = escapeHtml(post.title);
        const lead = escapeHtml(post.lead);
        const image = post.image
            ? `<img src="${escapeHtml(post.image)}" alt="${title}" class="news-photo">`
            : "";

        return `
            <article class="news-item-full">
                ${image}
                <div class="news-content">
                    <h3>${title}</h3>
                    <p class="news-date">${formatDate(post.date)}</p>
                    <p class="news-lead">${lead}</p>
                    <button type="button" class="news-more">Czytaj więcej</button>
                    <div class="news-body" data-raw="${encodeURIComponent(post.body)}"></div>
                </div>
            </article>
        `;
    }

    fetch("aktualnosci-data.json")
        .then(res => res.json())
        .then(posts => {
            if (!posts.length) {
                container.innerHTML = '<p class="news-empty">Brak aktualności.</p>';
                return;
            }
            container.innerHTML = posts.map(renderCard).join("");
        })
        .catch(() => {
            container.innerHTML = '<p class="news-empty">Nie udało się wczytać aktualności.</p>';
        });

    container.addEventListener("click", e => {
        const btn = e.target.closest(".news-more");
        if (!btn) return;

        const article = btn.closest(".news-item-full");
        const body = article.querySelector(".news-body");
        const expanded = article.classList.toggle("expanded");

        if (expanded && !body.dataset.rendered) {
            const raw = decodeURIComponent(body.dataset.raw);
            body.innerHTML = renderBody(raw);
            body.dataset.rendered = "1";
        }

        btn.textContent = expanded ? "Zwiń" : "Czytaj więcej";
    });
});
