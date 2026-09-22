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
                </div>
                <div class="news-body" data-raw="${encodeURIComponent(post.body)}"></div>
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
        if (btn) {
            const article = btn.closest(".news-item-full");
            const body = article.querySelector(".news-body");
            const expanded = article.classList.toggle("expanded");

            if (expanded && !body.dataset.rendered) {
                const raw = decodeURIComponent(body.dataset.raw);
                body.innerHTML = renderBody(raw);
                body.dataset.rendered = "1";
            }

            btn.textContent = expanded ? "Zwiń" : "Czytaj więcej";
            return;
        }

        const clickedImage = e.target.closest(".news-photo, .news-gallery img");
        if (clickedImage) openLightbox(clickedImage);
    });

    /* ============================
       LIGHTBOX - PODGLĄD ZDJĘĆ
       ============================ */
    const lightbox = document.getElementById("imageLightbox");
    const lightboxImg = lightbox ? lightbox.querySelector("img") : null;
    const lightboxPrev = lightbox ? lightbox.querySelector(".lightbox-prev") : null;
    const lightboxNext = lightbox ? lightbox.querySelector(".lightbox-next") : null;

    let album = [];
    let albumIndex = 0;

    function showAlbumImage() {
        const img = album[albumIndex];
        if (!img || !lightboxImg) return;
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
    }

    function showNextImage() {
        if (album.length < 2) return;
        albumIndex = (albumIndex + 1) % album.length;
        showAlbumImage();
    }

    function showPrevImage() {
        if (album.length < 2) return;
        albumIndex = (albumIndex - 1 + album.length) % album.length;
        showAlbumImage();
    }

    function openLightbox(imgEl) {
        if (!lightbox || !lightboxImg) return;

        const article = imgEl.closest(".news-item-full");
        album = article ? Array.from(article.querySelectorAll(".news-photo, .news-body img")) : [imgEl];
        albumIndex = Math.max(0, album.indexOf(imgEl));

        showAlbumImage();
        lightbox.classList.toggle("single", album.length < 2);
        lightbox.classList.add("open");
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove("open");
    }

    if (lightbox) {
        lightbox.addEventListener("click", e => {
            if (e.target.closest(".lightbox-nav")) return;
            closeLightbox();
        });

        if (lightboxPrev) {
            lightboxPrev.addEventListener("click", e => {
                e.stopPropagation();
                showPrevImage();
            });
        }

        if (lightboxNext) {
            lightboxNext.addEventListener("click", e => {
                e.stopPropagation();
                showNextImage();
            });
        }

        document.addEventListener("keydown", e => {
            if (!lightbox.classList.contains("open")) return;
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowRight") showNextImage();
            if (e.key === "ArrowLeft") showPrevImage();
        });
    }
});
