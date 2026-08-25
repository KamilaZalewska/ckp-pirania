document.addEventListener("DOMContentLoaded", () => {

    /* ============================
       1. PIONOWA KARUZELA ZDJĘĆ
       ============================ */
    const container = document.querySelector(".why-vertical-carousel");
    
    if (container) {
        const photos = Array.from(container.querySelectorAll("img"));

        function applyClasses() {
            if (photos.length >= 3) {
                photos[0].className = "top";
                photos[1].className = "active";
                photos[2].className = "bottom";
            }
        }

        applyClasses();

        photos.forEach(img => {
            img.addEventListener("click", () => {
                const last = photos.pop();
                photos.unshift(last);
                applyClasses();
            });
        });
    }


    /* ============================
       2. MENU MOBILNE
       ============================ */
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const mobilePanel = document.querySelector('.mobile-panel');

    if (mobileBtn && mobilePanel) {
        mobileBtn.addEventListener('click', () => {
            mobilePanel.classList.toggle('open');
        });
    }

    /* ============================
       3. SMOOTH SCROLL (Dla kotwic na stronie)
       ============================ */
    const header = document.querySelector("header");
    // Wybieramy tylko te linki, które służą do skakania po sekcjach na tej samej stronie (zaczynają się od #)
    const anchorLinks = document.querySelectorAll("a[href^='#']");

    anchorLinks.forEach(link => {
        link.addEventListener("click", e => {
            const targetId = link.getAttribute("href");
            
            if (targetId !== "#") {
                const target = document.querySelector(targetId);
                
                if (target) {
                    e.preventDefault();
                    const offset = header ? header.offsetHeight : 0;
                    
                    window.scrollTo({
                        top: target.offsetTop - offset,
                        behavior: "smooth"
                    });

                    // Zamykamy menu mobilne, jeśli kliknęliśmy z jego poziomu
                    if (mobilePanel && mobilePanel.classList.contains("open")) {
                        mobilePanel.classList.remove("open");
                    }
                }
            }
        });
    });

       /* ============================
   2A. Zamykanie menu po kliknięciu poza panelem
   ============================ */
document.addEventListener("click", (e) => {
    if (!mobilePanel.classList.contains("open")) return;

    const clickedInsidePanel = mobilePanel.contains(e.target);
    const clickedHamburger = mobileBtn.contains(e.target);

    if (!clickedInsidePanel && !clickedHamburger) {
        mobilePanel.classList.remove("open");
    }
});


    /* ============================
       4. SCROLLSPY + FADE-IN
       ============================ */
    const sections = document.querySelectorAll(".fade-section");

    if (sections.length > 0) {
        sections.forEach(sec => sec.classList.add("scroll-animate"));

        function onScroll() {
            const scrollPos = window.scrollY + (header ? header.offsetHeight : 0) + 50;

            sections.forEach(sec => {
                const top = sec.offsetTop;
                const bottom = top + sec.offsetHeight;

                if (scrollPos >= top && scrollPos < bottom) {
                    // Aktualizacja aktywnego linku w nawigacji
                    const activeLink = document.querySelector(`nav a[href="#${sec.id}"]`);
                    if (activeLink) {
                        document.querySelectorAll("nav a").forEach(link => link.classList.remove("active-link"));
                        activeLink.classList.add("active-link");
                    }

                    // Odpalenie animacji (Fade-in)
                    sec.classList.add("visible");
                }
            });
        }

        // Aktywacja zdarzenia! Tego brakowało.
        window.addEventListener("scroll", onScroll);
        onScroll(); // Wywołanie od razu po załadowaniu, by sprawdzić pozycję początkową
    }

    /* ============================
       5. PARALLAX HERO
       ============================ */
    const hero = document.querySelector("#hero");

    if (hero) {
        window.addEventListener("scroll", () => {
            const offset = window.pageYOffset;
            hero.style.backgroundPositionY = offset * 0.4 + "px";
        });
    }

    /* ============================
       6. STRZAŁKA POWROTU NA GÓRĘ
       ============================ */
    const backToTop = document.getElementById("backToTop");

    if (backToTop) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 400) {
                backToTop.classList.add("show");
            } else {
                backToTop.classList.remove("show");
            }
        });

        backToTop.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    /* ============================
       7. TRENERZY - MODAL
       ============================ */
    const trainerData = {
        trener1: {
            name: "Urszula Rydz",
            role: "Instruktorka pływania",
            photo: "Photos/trener1-card.jpg",
            description: "Urszula posiada 12 lat doświadczenia w pracy z dziećmi i młodzieżą. Specjalizuje się w technice kraula oraz nauce pływania od podstaw. Ukończył AWF oraz liczne kursy instruktorskie."
        },
        trener2: {
            name: "Konrad Dzwonkowski",
            role: "Trener pływania sportowego",
            photo: "Photos/trener2-card.jpg",
            description: "Konrad to doświadczony trener, który specjalizuje się w treningu pływania sportowego. Prowadzi grupy zaawansowane, przygotowując zawodników do startów w zawodach."
        },
        trener3: {
            name: "Marcin Łojewski",
            role: "Instruktor grup średniozaawansowanych",
            photo: "Photos/trener3-card.jpg",
            description: "Marcin odpowiada za przygotowanie motoryczne zawodników. Prowadzi treningi ogólnorozwojowe, siłowe oraz zajęcia na lądzie wspierające technikę pływania."
        },
        trener4: {
            name: "Piotr Ruszel",
            role: "Instruktor pływania sportowego",
            photo: "Photos/trener4-card.jpg",
            description: "Piotr specjalizuje się w treningu pływania sportowego. Prowadzi grupy średniozaawansowane, przygotowując zawodników do startów w zawodach i poprawy wyników."
        },
        trener5: {
            name: "Anna Marciniak",
            role: "Instruktorka pływania rekreacyjnego",
            photo: "Photos/trener5-card.jpg",
            description: "Anna prowadzi zajęcia dla osób dorosłych oraz grup rekreacyjnych. Skupia się na poprawie techniki, kondycji oraz przyjemności z pływania."
        }
    };

    const modal = document.getElementById("trainerModal");
    
    if (modal) {
        const modalPhoto = document.querySelector(".trainer-modal-photo");
        const modalName = document.querySelector(".trainer-modal-name");
        const modalRole = document.querySelector(".trainer-modal-role");
        const modalDesc = document.querySelector(".trainer-modal-description");
        const closeBtn = document.querySelector(".trainer-close");

        /*OPCJA POWIĘKSZENIA KARTY TRENERA PO KLIKNIECIU /*
       /* document.querySelectorAll(".trainer-card").forEach(card => {
            card.addEventListener("click", () => {
                const id = card.dataset.trainer;
                if (id && trainerData[id]) {
                    const data = trainerData[id];

                    if(modalPhoto) modalPhoto.src = data.photo;
                    if(modalName) modalName.textContent = data.name;
                    if(modalRole) modalRole.textContent = data.role;
                    if(modalDesc) modalDesc.textContent = data.description;

                    modal.style.display = "flex";
                }
            });
        }); */

        if (closeBtn) {
            closeBtn.addEventListener("click", () => {
                modal.style.display = "none";
            });
        }

        modal.addEventListener("click", (e) => {
            if (e.target === modal) modal.style.display = "none";
        });
    }

    /* ============================
       8. FORMULARZ KONTAKTOWY + EMAILJS
       ============================ */
    const form = document.getElementById("contactForm");
    
    if (form) {
        // Zabezpieczenie przed brakiem wczytania biblioteki EmailJS w HTML
        if (typeof emailjs !== "undefined") {
            emailjs.init({ publicKey: "i8Mw-Mvu3IMLt3oqN" });
        }

        const btn = document.getElementById("sendBtn");
        const successMsg = document.getElementById("successMessage");

        function validateForm() {
            const name = document.getElementById("name");
            const email = document.getElementById("email");
            const message = document.getElementById("message");

            let valid = true;

            if (name.value.trim().length < 2) {
                name.classList.add("input-error");
                valid = false;
            } else name.classList.remove("input-error");

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email.value.trim())) {
                email.classList.add("input-error");
                valid = false;
            } else email.classList.remove("input-error");

            if (message.value.trim().length < 5) {
                message.classList.add("input-error");
                valid = false;
            } else message.classList.remove("input-error");

            return valid;
        }

        form.addEventListener("submit", function(e) {
            e.preventDefault();

            if (!validateForm()) {
                btn.textContent = "Popraw błędy w formularzu";
                btn.style.backgroundColor = "red";

                setTimeout(() => {
                    btn.textContent = "Wyślij wiadomość";
                    btn.style.backgroundColor = "#2156ca";
                }, 2500);

                return;
            }

            btn.textContent = "Wysyłanie...";
            btn.style.backgroundColor = "#999";

            const formData = {
                name: document.getElementById("name").value,
                email: document.getElementById("email").value,
                message: document.getElementById("message").value
            };

            if (typeof emailjs !== "undefined") {
                emailjs.send("service_6opdrta", "template_k4ew0xt", formData)
                    .then(() => {
                        btn.textContent = "Wiadomość wysłana!";
                        btn.style.backgroundColor = "#2a8fa5";

                        form.reset();
                        if(successMsg) successMsg.classList.add("success-visible");

                        setTimeout(() => {
                            btn.textContent = "Wyślij wiadomość";
                            btn.style.backgroundColor = "#2156ca";
                            if(successMsg) successMsg.classList.remove("success-visible");
                        }, 4000);
                    })
                    .catch(() => {
                        btn.textContent = "Błąd wysyłania!";
                        btn.style.backgroundColor = "red";

                        setTimeout(() => {
                            btn.textContent = "Wyślij wiadomość";
                            btn.style.backgroundColor = "#2156ca";
                        }, 3000);
                    });
            }
        });
    }
});

