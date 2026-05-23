/**
 * ==========================================================================
 * EARLIEST CLOTHING CO. & CREATIVE DIRECTION - INTERACTION & ANIMATION ENGINE
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
    
    // ----------------------------------------------------------------------
    // 1. Gestione Preloader & Rivelazione Iniziale
    // ----------------------------------------------------------------------
    const preloader = document.getElementById("preloader");
    
    window.addEventListener("load", () => {
        setTimeout(() => {
            if (preloader) {
                preloader.style.opacity = "0";
                preloader.style.visibility = "hidden";
                
                // Trigger iniziale per gli elementi reveal nella hero
                setTimeout(triggerScrollReveals, 200);
            }
        }, 2600); // Abbastanza tempo per completare le animazioni SVG del preloader
    });

    // Fallback nel caso in cui l'evento load tardi troppo
    setTimeout(() => {
        if (preloader && preloader.style.visibility !== "hidden") {
            preloader.style.opacity = "0";
            preloader.style.visibility = "hidden";
            triggerScrollReveals();
        }
    }, 4500);

    // ----------------------------------------------------------------------
    // 2. Cursore Personalizzato Luxury (con effetto interpolato LERP)
    // ----------------------------------------------------------------------
    const cursorDot = document.querySelector(".custom-cursor");
    const cursorFollower = document.querySelector(".custom-cursor-follower");
    
    let mouseX = 0, mouseY = 0;     // Coordinate effettive del mouse
    let dotX = 0, dotY = 0;         // Coordinate del dot interno
    let followerX = 0, followerY = 0; // Coordinate del follower esterno
    
    const followerLerp = 0.12;      // Velocità di ritardo del follower (più basso = più ritardo/flessibilità)

    document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Funzione di aggiornamento del cursore a 60 FPS
    function updateCursor() {
        // Il dot interno segue istantaneamente
        dotX += (mouseX - dotX);
        dotY += (mouseY - dotY);
        if (cursorDot) {
            cursorDot.style.left = `${dotX}px`;
            cursorDot.style.top = `${dotY}px`;
        }

        // Il follower esterno segue con interpolazione lineare (Lerp) per un effetto fluido e cinematico
        followerX += (mouseX - followerX) * followerLerp;
        followerY += (mouseY - followerY) * followerLerp;
        if (cursorFollower) {
            cursorFollower.style.left = `${followerX}px`;
            cursorFollower.style.top = `${followerY}px`;
        }

        requestAnimationFrame(updateCursor);
    }
    requestAnimationFrame(updateCursor);

    // Gestione degli hover reattivi
    function setupCursorHoverEffects() {
        const hoverTriggers = document.querySelectorAll(".hover-trigger, a, button, input, select, textarea, .accordion-header, .garment-card");
        
        hoverTriggers.forEach(trigger => {
            trigger.addEventListener("mouseenter", () => {
                cursorDot.classList.add("hovered");
                cursorFollower.classList.add("hovered");
            });
            trigger.addEventListener("mouseleave", () => {
                cursorDot.classList.remove("hovered");
                cursorFollower.classList.remove("hovered");
            });
        });
    }
    setupCursorHoverEffects();

    // Nascondi cursore se esce dalla finestra
    document.addEventListener("mouseleave", () => {
        if (cursorDot) cursorDot.style.opacity = "0";
        if (cursorFollower) cursorFollower.style.opacity = "0";
    });
    document.addEventListener("mouseenter", () => {
        if (cursorDot) cursorDot.style.opacity = "1";
        if (cursorFollower) cursorFollower.style.opacity = "1";
    });

    // ----------------------------------------------------------------------
    // 3. Canvas Atmosferico (Pulviscolo dorato fluttuante)
    // ----------------------------------------------------------------------
    const canvas = document.getElementById("atmosphereCanvas");
    const ctx = canvas ? canvas.getContext("2d") : null;
    let particles = [];
    const maxParticles = 65;

    if (canvas && ctx) {
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        class Particle {
            constructor() {
                this.reset();
                this.y = Math.random() * canvas.height; // Posizione iniziale su tutto lo schermo al primo caricamento
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = canvas.height + 20;
                this.size = Math.random() * 2.2 + 0.6; // Particelle molto fini per un effetto elegante
                this.speedY = -(Math.random() * 0.4 + 0.15); // Lente fluttuazioni verso l'alto
                this.speedX = Math.random() * 0.2 - 0.1;
                this.opacity = Math.random() * 0.45 + 0.1;
                this.color = `rgba(236, 192, 151, ${this.opacity})`; // Oro Araldico con opacità variabile
                this.wobble = Math.random() * Math.PI;
                this.wobbleSpeed = Math.random() * 0.02 + 0.005;
            }

            update() {
                this.y += this.speedY;
                this.wobble += this.wobbleSpeed;
                this.x += this.speedX + Math.sin(this.wobble) * 0.15;

                // Repulsione del mouse molto sottile
                const dx = mouseX - this.x;
                const dy = mouseY - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 180) {
                    const force = (180 - dist) / 180;
                    this.x -= (dx / dist) * force * 0.8;
                    this.y -= (dy / dist) * force * 0.8;
                }

                // Reset quando esce dallo schermo
                if (this.y < -20 || this.x < -20 || this.x > canvas.width + 20) {
                    this.reset();
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                // Leggero bagliore
                ctx.shadowBlur = 4;
                ctx.shadowColor = "rgba(236, 192, 151, 0.3)";
                ctx.fill();
                ctx.shadowBlur = 0; // Reset shadow blur per performance
            }
        }

        // Popola particelle
        for (let i = 0; i < maxParticles; i++) {
            particles.push(new Particle());
        }

        // Loop di rendering
        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    function resizeCanvas() {
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    }

    // ----------------------------------------------------------------------
    // 4. Parallasse dello Sfondo Hero
    // ----------------------------------------------------------------------
    const heroBg = document.getElementById("heroBg");
    const hero = document.getElementById("hero");

    if (heroBg && hero) {
        window.addEventListener("scroll", () => {
            const scrollPos = window.pageYOffset;
            const heroHeight = hero.offsetHeight;
            if (scrollPos <= heroHeight) {
                // Sposta l'immagine verso il basso a un terzo della velocità di scroll per l'effetto parallasse
                const yOffset = scrollPos * 0.35;
                heroBg.style.transform = `translateY(${yOffset}px) scale(1.05)`;
            }
        });
    }

    // ----------------------------------------------------------------------
    // 5. Inclinazione 3D sulle Card (3D Tilt Effect)
    // ----------------------------------------------------------------------
    const tiltCards = document.querySelectorAll(".hover-tilt");

    tiltCards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // Coordinata X relativa all'elemento
            const y = e.clientY - rect.top;  // Coordinata Y relativa all'elemento
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Angolo massimo di inclinazione (es. 8 gradi per finezza)
            const maxTilt = 8;
            
            const rotateX = ((centerY - y) / centerY) * maxTilt;
            const rotateY = ((x - centerX) / centerX) * maxTilt;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
        });
    });

    // ----------------------------------------------------------------------
    // 6. Gestione Pulsanti di Commissione Servizi (Focus Vendita & Conversione)
    // ----------------------------------------------------------------------
    const commissionButtons = document.querySelectorAll(".commission-btn");
    const formServiceSelect = document.getElementById("formService");
    const contactSection = document.getElementById("contact");

    commissionButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            e.preventDefault();
            const serviceKey = button.getAttribute("data-service");
            
            if (formServiceSelect) {
                formServiceSelect.value = serviceKey;
                formServiceSelect.dispatchEvent(new Event("change"));
            }

            if (contactSection) {
                contactSection.scrollIntoView({ behavior: "smooth" });
            }
        });
    });

    // ----------------------------------------------------------------------
    // 7. Slider Orizzontale Lookbook (Infinite Loop Scroll - Scorribile a Ruota)
    // ----------------------------------------------------------------------
    const slider = document.getElementById("lookbookSlider");
    
    if (slider) {
        const originalCards = Array.from(slider.children);
        
        // Clona le card all'inizio e alla fine per creare un loop infinito (a ruota)
        originalCards.forEach(card => {
            const clone = card.cloneNode(true);
            clone.classList.add("cloned-card");
            slider.appendChild(clone);
        });
        
        originalCards.slice().reverse().forEach(card => {
            const clone = card.cloneNode(true);
            clone.classList.add("cloned-card");
            slider.insertBefore(clone, slider.firstChild);
        });

        // Associa i trigger del cursore custom anche alle card clonate
        const clonedCards = slider.querySelectorAll(".cloned-card");
        clonedCards.forEach(clone => {
            if (cursorDot && cursorFollower) {
                clone.addEventListener("mouseenter", () => {
                    cursorDot.classList.add("hovered");
                    cursorFollower.classList.add("hovered");
                });
                clone.addEventListener("mouseleave", () => {
                    cursorDot.classList.remove("hovered");
                    cursorFollower.classList.remove("hovered");
                });
            }
        });

        // 3D Tilt & Glare Effect interattivo su tutte le card dei vestiti (originali + clonate)
        const allGarmentCards = slider.querySelectorAll(".garment-card");
        allGarmentCards.forEach(card => {
            card.addEventListener("mouseenter", () => {
                // Rendi il movimento attivo più reattivo riducendo il tempo di transizione
                card.style.transition = "transform 0.15s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.3s ease, border-color 0.4s";
            });

            card.addEventListener("mousemove", (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left; // Coordinata X relativa all'elemento
                const y = e.clientY - rect.top;  // Coordinata Y relativa all'elemento
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                // Angolo massimo di inclinazione (15 gradi per un bell'effetto tridimensionale visibile)
                const maxTilt = 15;
                
                // Rotazione X: il mouse in alto fa inclinare la card in avanti (X positivo), in basso all'indietro (X negativo)
                const rotateX = ((centerY - y) / centerY) * maxTilt;
                // Rotazione Y: il mouse a destra fa inclinare la card a destra (Y positivo), a sinistra a sinistra (Y negativo)
                const rotateY = ((x - centerX) / centerX) * -maxTilt; // Invertito per orientare la card verso il puntatore
                
                // Aggiorna le variabili CSS per lo scintillio olografico (glare)
                const xPercent = (x / rect.width) * 100;
                const yPercent = (y / rect.height) * 100;
                card.style.setProperty("--x", `${xPercent}%`);
                card.style.setProperty("--y", `${yPercent}%`);
                
                // Applica la rotazione 3D dinamica combinata con il sollevamento verticale su hover
                card.style.transform = `translateY(-24px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.04)`;
                card.style.boxShadow = `0 40px 80px rgba(5,5,5,0.95), 0 20px 40px rgba(236, 192, 151, 0.25)`;
            });

            card.addEventListener("mouseleave", () => {
                // Ripristina la transizione lussuosa originaria per un rientro morbidissimo
                card.style.transition = "transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.65s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s";
                card.style.transform = "translateY(0px) rotateX(0deg) rotateY(0deg) scale(1)";
                card.style.boxShadow = "none";
                card.style.setProperty("--x", "50%");
                card.style.setProperty("--y", "50%");
            });
        });

        let originalSetWidth = 0;
        const sliderWrapper = slider.parentElement;
        
        function updateSliderBounds() {
            // Larghezza del set originale (1/3 della larghezza totale scollabile)
            originalSetWidth = slider.scrollWidth / 3;
            
            // Allineamento iniziale: posiziona lo slider sul set originale (al centro)
            if (sliderWrapper.scrollLeft === 0 && originalSetWidth > 0) {
                sliderWrapper.scrollLeft = originalSetWidth;
            }
        }
        
        // Ricalcola quando le immagini e le risorse sono pronte
        window.addEventListener("load", updateSliderBounds);
        updateSliderBounds();
        setTimeout(updateSliderBounds, 400); 
        setTimeout(updateSliderBounds, 1200); 

        let isDown = false;
        let startX;
        let scrollLeft;
        let velocity = 0;
        let lastX = 0;
        let lastTime = 0;
        let animationFrameId = null;

        sliderWrapper.addEventListener("mousedown", (e) => {
            isDown = true;
            sliderWrapper.style.cursor = "grabbing";
            startX = e.pageX - sliderWrapper.offsetLeft;
            scrollLeft = sliderWrapper.scrollLeft;
            lastX = e.pageX;
            lastTime = Date.now();
            velocity = 0;
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        });

        sliderWrapper.addEventListener("mouseleave", () => {
            if (isDown) {
                isDown = false;
                sliderWrapper.style.cursor = "grab";
                applyInertia();
            }
        });

        sliderWrapper.addEventListener("mouseup", () => {
            if (isDown) {
                isDown = false;
                sliderWrapper.style.cursor = "grab";
                applyInertia();
            }
        });

        sliderWrapper.addEventListener("mousemove", (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - sliderWrapper.offsetLeft;
            const walk = (x - startX) * 1.5; // Velocità di trascinamento
            sliderWrapper.scrollLeft = scrollLeft - walk;
            
            handleInfiniteLoop();

            // Calcolo velocità per l'inerzia dello scivolamento
            const now = Date.now();
            const elapsed = now - lastTime;
            if (elapsed > 0) {
                const deltaX = e.pageX - lastX;
                velocity = deltaX / elapsed;
                lastX = e.pageX;
                lastTime = now;
            }
        });

        // Scorrimento fluido a ruota anche tramite rotellina (Shift+Scroll o Trackpad)
        sliderWrapper.addEventListener("wheel", (e) => {
            if (e.deltaY !== 0) {
                e.preventDefault();
                sliderWrapper.scrollLeft += e.deltaY * 1.2;
                handleInfiniteLoop();
            }
        }, { passive: false });

        // Gestisce il salto invisibile per creare la ruota continua
        function handleInfiniteLoop() {
            if (originalSetWidth <= 0) return;
            
            const currentScroll = sliderWrapper.scrollLeft;
            
            // Se scorri troppo a destra (oltre il secondo set), salta indietro invisibilmente al primo set
            if (currentScroll >= originalSetWidth * 2) {
                sliderWrapper.scrollLeft = currentScroll - originalSetWidth;
            }
            // Se scorri troppo a sinistra (prima del set originale), salta avanti invisibilmente al secondo set
            else if (currentScroll <= originalSetWidth - window.innerWidth) {
                sliderWrapper.scrollLeft = currentScroll + originalSetWidth;
            }
        }

        function applyInertia() {
            if (Math.abs(velocity) < 0.1) return;
            
            function step() {
                sliderWrapper.scrollLeft -= velocity * 15;
                velocity *= 0.92; // Attrito/decelerazione
                
                handleInfiniteLoop();
                
                if (Math.abs(velocity) > 0.05 && !isDown) {
                    animationFrameId = requestAnimationFrame(step);
                }
            }
            animationFrameId = requestAnimationFrame(step);
        }

        window.addEventListener("resize", () => {
            updateSliderBounds();
        });
    }

    // ----------------------------------------------------------------------
    // 8. Sezione Merch: Modale Pop-up Dettaglio Prodotto (Interamente in Italiano)
    // ----------------------------------------------------------------------
    
    // Dataset dei prodotti senza distorsione di dati - Tradotto in Italiano
    const garmentsData = {
        "1": {
            tag: "FELPA | ARCHIVIO",
            title: "FELPA CON STEMMA IMPERIALE",
            price: "€ 189.00",
            desc: "Capo iconico costruito per il comando. Questa felpa esclusiva in edizione d'archivio presenta l'emblema della corona e dello scudo ricamato sul petto in un profondo rosso imperiale. Realizzata in cotone spazzolato a grammatura pesante.",
            fit: "Taglio Oversize Imperiale con spalle scese",
            stitching: "Cuciture in rilievo tono su tono ultra resistenti",
            img: "assets/clothing/crewneck_full.jpg"
        },
        "2": {
            tag: "HOODIE | ARCHIVIO",
            title: "HOODIE VANGUARD DI LUSSO",
            price: "€ 220.00",
            desc: "La fusione perfetta tra comodità streetwear e l'eleganza sofisticata del brand EARLIEST. Cappuccio foderato a doppio strato rigido, tasca a marsupio geometrica priva di cuciture a vista e ricamo araldico sul retro per comandare la strada.",
            fit: "Boxy Fit strutturato con polsini spessi a coste",
            stitching: "Ricamo in filo rosso ad alta densità sul retro",
            img: "assets/clothing/luxury_hoodie.jpg"
        },
        "3": {
            tag: "POLO | SOVRANA",
            title: "POLO ARISTOCRATICA SLIM-FIT",
            price: "€ 125.00",
            desc: "Una reinterpretazione contemporanea del lusso classico. Colletto a coste affusolato e chiusura a bottoni nascosta. Lo stemma minimale 'E' ricamato sul petto testimonia un'eccellenza sartoriale silenziosa ma autorevole.",
            fit: "Slim-fit raffinato con spacchetti laterali",
            stitching: "Cuciture invisibili sui bordi e ricamo micro sul petto",
            img: "assets/clothing/elegant_polo.jpg"
        },
        "4": {
            tag: "FELPA | DETTAGLI",
            title: "CREWNECK CON DETTAGLI DI CUCITURA ROSSI",
            price: "€ 195.00",
            desc: "Studio meticoloso sul contrasto cromatico. Questa felpa nera esalta le linee costruttive del capo con cuciture rosse a contrasto posizionate lungo le giunture anatomiche delle maniche e del colletto. Uno status metropolitano audace.",
            fit: "Regular Fit strutturato prelavato anti-restringimento",
            stitching: "Cuciture piatte a contrasto in filato rosso robusto",
            img: "assets/clothing/crewneck_detail.jpg"
        },
        "5": {
            tag: "EDITORIALE | CAMPAGNA",
            title: "FELPA SOVRANA - STEMMA POSTERIORE",
            price: "€ 189.00",
            desc: "Direttamente dallo shooting ufficiale di campagna. Felpa nera d'archivio immortalata sul modello nella vista posteriore, evidenziando il maestoso stemma ricamato in rosso che si staglia sulle spalle in un connubio di prestigio e attitudine urban.",
            fit: "Taglio Comfort Oversize con spalle strutturate",
            stitching: "Dettaglio ricamato posteriore 24x28 cm ad altissima precisione",
            img: "assets/shooting/model_back_car.jpg"
        },
        "6": {
            tag: "EDITORIALE | VETTURA",
            title: "FELPA SOVRANA - STEMMA ANTERIORE",
            price: "€ 189.00",
            desc: "Foto editoriale del modello all'interno dell'abitacolo della vettura sportiva nera. Evidenzia la vestibilità frontale e il posizionamento asimmetrico dello stemma imperiale sul petto sinistro, a indicare l'appartenenza alla nuova élite dello stile.",
            fit: "Drappeggio sartoriale da streetwear",
            stitching: "Cucitura spalla rinforzata in doppio filo di cotone",
            img: "assets/shooting/model_in_car.jpg"
        }
    };

    const modal = document.getElementById("garmentModal");
    const modalImg = document.getElementById("modalImg");
    const modalTag = document.getElementById("modalTag");
    const modalTitle = document.getElementById("modalTitle");
    const modalPrice = document.getElementById("modalPrice");
    const modalDesc = document.getElementById("modalDesc");
    const modalFit = document.getElementById("modalFit");
    const modalStitch = document.getElementById("modalStitch");
    const closeModalBtn = document.getElementById("closeModal");
    const modalBackdrop = document.getElementById("modalBackdrop");
    const commandBtn = document.getElementById("commandBtn");

    // Gestione click su qualsiasi card (inclusi i cloni generati per la ruota infinita)
    document.addEventListener("click", (e) => {
        const card = e.target.closest(".garment-card");
        if (card) {
            const itemId = card.getAttribute("data-item");
            const data = garmentsData[itemId];

            if (data && modal) {
                // Popola modale
                modalImg.src = data.img;
                modalImg.alt = data.title;
                modalTag.textContent = data.tag;
                modalTitle.textContent = data.title;
                modalPrice.textContent = data.price;
                modalDesc.textContent = data.desc;
                modalFit.textContent = data.fit;
                modalStitch.textContent = data.stitching;

                // Mostra modale con transizione
                modal.classList.add("active");
                document.body.style.overflow = "hidden"; // Blocca scroll di sfondo
            }
        }
    });

    // Chiudi modale
    function closeModal() {
        if (modal) {
            modal.classList.remove("active");
            document.body.style.overflow = "auto"; // Ripristina scroll
        }
    }

    if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener("click", closeModal);

    // Chiusura con tasto ESC
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeModal();
            closeSideMenu();
        }
    });

    // Gestione pulsante di acquisto
    if (commandBtn) {
        commandBtn.addEventListener("click", () => {
            commandBtn.innerHTML = "<span>ACQUISITO NEL SISTEMA</span><span class='material-symbols-outlined'>check</span>";
            commandBtn.style.backgroundColor = "#ecc097";
            commandBtn.style.color = "#050505";
            commandBtn.style.borderColor = "#ecc097";
            commandBtn.style.boxShadow = "0 0 20px rgba(236,192,151,0.4)";
            
            setTimeout(() => {
                commandBtn.innerHTML = "<span>ORDINA IL CAPO</span><span class='material-symbols-outlined'>workspace_premium</span>";
                commandBtn.style.backgroundColor = "var(--color-primary)";
                commandBtn.style.color = "var(--color-text-light)";
                commandBtn.style.borderColor = "var(--color-primary)";
                commandBtn.style.boxShadow = "0 0 15px var(--color-red-glow)";
                closeModal();
                
                // Scorri dolcemente al form dei contatti per "completare il comando"
                const contactSec = document.getElementById("contact");
                if (contactSec) {
                    contactSec.scrollIntoView({ behavior: "smooth" });
                }
            }, 1200);
        });
    }

    // Interattività pulsanti taglie
    const sizeButtons = document.querySelectorAll(".size-btn");
    sizeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            sizeButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
        });
    });

    // ----------------------------------------------------------------------
    // 9. Intersection Observer (Rivelazioni Cinematiche allo Scorrimento)
    // ----------------------------------------------------------------------
    const revealElements = document.querySelectorAll(".reveal-fade, .reveal-slide-left, .reveal-slide-right, .reveal-fade-up");

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("reveal-active");
                // Una volta rivelato, smettiamo di osservarlo per performance
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15, // Rivelazione quando l'elemento è visibile al 15%
        rootMargin: "0px 0px -40px 0px" // Innesco leggermente prima di toccare il bordo inferiore
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Funzione manuale per forzare rivelazione iniziale (es. hero)
    function triggerScrollReveals() {
        const heroElements = document.querySelectorAll("#hero .reveal-fade, #hero .reveal-fade-up");
        heroElements.forEach(el => {
            el.classList.add("reveal-active");
        });
    }

    // ----------------------------------------------------------------------
    // 10. Effetto Header Scrolled & Barra Scorrimento Progressiva
    // ----------------------------------------------------------------------
    const header = document.querySelector(".main-header");
    const progressBar = document.getElementById("progressBar");

    window.addEventListener("scroll", () => {
        const scrollPos = window.pageYOffset;
        
        // Header scrolled
        if (header) {
            if (scrollPos > 50) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
        }

        // Calcolo barra di progresso
        if (progressBar) {
            const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolledPercent = (scrollPos / docHeight) * 100;
            progressBar.style.width = `${scrolledPercent}%`;
        }
    });

    // ----------------------------------------------------------------------
    // 11. Menu Mobile a Scomparsa (Slide Overlay)
    // ----------------------------------------------------------------------
    const menuToggle = document.getElementById("menuToggle");
    const closeMenuBtn = document.getElementById("closeMenu");
    const sideMenu = document.getElementById("sideMenu");
    const sideLinks = document.querySelectorAll(".side-link");

    function openSideMenu() {
        if (sideMenu) {
            sideMenu.classList.add("active");
            document.body.style.overflow = "hidden";
        }
    }

    function closeSideMenu() {
        if (sideMenu) {
            sideMenu.classList.remove("active");
            document.body.style.overflow = "auto";
        }
    }

    if (menuToggle) menuToggle.addEventListener("click", openSideMenu);
    if (closeMenuBtn) closeMenuBtn.addEventListener("click", closeSideMenu);

    sideLinks.forEach(link => {
        link.addEventListener("click", closeSideMenu);
    });

    // ----------------------------------------------------------------------
    // 12. Gestione Form d'Élite (Command Gate Submission - In Italiano)
    // ----------------------------------------------------------------------
    const form = document.getElementById("commandForm");
    const submitBtn = document.getElementById("submitFormBtn");

    if (form && submitBtn) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            
            // Animazione caricamento in italiano
            submitBtn.innerHTML = "<span>CONNESSIONE AL SATELLITE...</span><span class='material-symbols-outlined'>hourglass_bottom</span>";
            submitBtn.style.backgroundColor = "transparent";
            submitBtn.style.color = "var(--color-secondary)";
            submitBtn.style.borderColor = "var(--color-secondary)";
            submitBtn.style.boxShadow = "none";
            
            setTimeout(() => {
                submitBtn.innerHTML = "<span>COMANDO STABILITO</span><span class='material-symbols-outlined'>done_all</span>";
                submitBtn.style.backgroundColor = "#ecc097";
                submitBtn.style.color = "#050505";
                submitBtn.style.borderColor = "#ecc097";
                submitBtn.style.boxShadow = "0 0 25px rgba(236,192,151,0.5)";
                
                // Notifica a schermo minimalista ed elegante in italiano
                const alertBox = document.createElement("div");
                alertBox.style.position = "fixed";
                alertBox.style.bottom = "30px";
                alertBox.style.right = "30px";
                alertBox.style.backgroundColor = "#ecc097";
                alertBox.style.color = "#050505";
                alertBox.style.padding = "20px 30px";
                alertBox.style.fontFamily = "var(--font-headline)";
                alertBox.style.fontSize = "0.85rem";
                alertBox.style.fontWeight = "700";
                alertBox.style.letterSpacing = "0.25em";
                alertBox.style.zIndex = "99999";
                alertBox.style.boxShadow = "0 10px 30px rgba(5,5,5,0.9)";
                alertBox.textContent = "COMANDO RICEVUTO. CANALI DI IDENTITÀ ATTIVATI.";
                document.body.appendChild(alertBox);

                setTimeout(() => {
                    alertBox.style.opacity = "0";
                    alertBox.style.transition = "opacity 0.8s ease";
                    setTimeout(() => alertBox.remove(), 800);
                }, 4000);

                form.reset();

                setTimeout(() => {
                    submitBtn.innerHTML = "<span>INIZIA IL COMANDO</span><span class='material-symbols-outlined'>bolt</span>";
                    submitBtn.style.backgroundColor = "var(--color-primary)";
                    submitBtn.style.color = "var(--color-text-light)";
                    submitBtn.style.borderColor = "var(--color-primary)";
                    submitBtn.style.boxShadow = "0 0 15px var(--color-red-glow)";
                }, 3000);

            }, 2000);
        });
    }
});
