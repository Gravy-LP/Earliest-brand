/**
 * ==========================================================================
 * EARLIEST CLOTHING CO. - INTERACTION & E-COMMERCE ENGINE (URBAN ARISTOCRACY)
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
                document.body.classList.add("preloader-finished");
                setTimeout(triggerScrollReveals, 200);
            }
        }, 2600);
    });

    // Fallback se caricamento tarda
    setTimeout(() => {
        if (preloader && preloader.style.visibility !== "hidden") {
            preloader.style.opacity = "0";
            preloader.style.visibility = "hidden";
            document.body.classList.add("preloader-finished");
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

    function updateCursor() {
        dotX += (mouseX - dotX);
        dotY += (mouseY - dotY);
        if (cursorDot) {
            cursorDot.style.left = `${dotX}px`;
            cursorDot.style.top = `${dotY}px`;
        }

        followerX += (mouseX - followerX) * followerLerp;
        followerY += (mouseY - followerY) * followerLerp;
        if (cursorFollower) {
            cursorFollower.style.left = `${followerX}px`;
            cursorFollower.style.top = `${followerY}px`;
        }

        requestAnimationFrame(updateCursor);
    }
    requestAnimationFrame(updateCursor);

    // Gestione degli hover reattivi con delegazione o ri-innesco
    function setupCursorHoverEffects() {
        const hoverTriggers = "a, button, input, select, textarea, .product-card, .size-btn, .qty-btn, .remove-item-btn, .hover-trigger, .interactive-3d-canvas, .clothes-gallery-item, .lookbook-card";
        
        document.body.addEventListener("mouseenter", (e) => {
            if (e.target.matches && e.target.matches(hoverTriggers)) {
                cursorDot.classList.add("hovered");
                cursorFollower.classList.add("hovered");
            }
        }, true);
        
        document.body.addEventListener("mouseleave", (e) => {
            if (e.target.matches && e.target.matches(hoverTriggers)) {
                cursorDot.classList.remove("hovered");
                cursorFollower.classList.remove("hovered");
            }
        }, true);
    }
    setupCursorHoverEffects();

    // Nascondi cursore se esce dalla finestra, mostralo quando entra
    document.addEventListener("mouseleave", () => {
        if (cursorDot) cursorDot.style.opacity = "0";
        if (cursorFollower) cursorFollower.style.opacity = "0";
    });
    document.addEventListener("mouseenter", () => {
        if (cursorDot) cursorDot.style.opacity = "";
        if (cursorFollower) cursorFollower.style.opacity = "";
    });

    // ----------------------------------------------------------------------
    // 3. Canvas Atmosferico (Pulviscolo dorato fluttuante)
    // ----------------------------------------------------------------------
    const canvas = document.getElementById("atmosphereCanvas");
    const ctx = canvas ? canvas.getContext("2d") : null;
    let particles = [];
    const maxParticles = 55;

    if (canvas && ctx) {
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        class Particle {
            constructor() {
                this.reset();
                this.y = Math.random() * canvas.height;
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = canvas.height + 20;
                this.size = Math.random() * 2.0 + 0.5;
                this.speedY = -(Math.random() * 0.35 + 0.12);
                this.speedX = Math.random() * 0.18 - 0.09;
                this.opacity = Math.random() * 0.4 + 0.1;
                this.color = `rgba(236, 192, 151, ${this.opacity})`;
                this.wobble = Math.random() * Math.PI;
                this.wobbleSpeed = Math.random() * 0.015 + 0.005;
            }

            update() {
                this.y += this.speedY;
                this.wobble += this.wobbleSpeed;
                this.x += this.speedX + Math.sin(this.wobble) * 0.12;

                const dx = mouseX - this.x;
                const dy = mouseY - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    const force = (150 - dist) / 150;
                    this.x -= (dx / dist) * force * 0.6;
                    this.y -= (dy / dist) * force * 0.6;
                }

                if (this.y < -20 || this.x < -20 || this.x > canvas.width + 20) {
                    this.reset();
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 3;
                ctx.shadowColor = "rgba(236, 192, 151, 0.2)";
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }

        for (let i = 0; i < maxParticles; i++) {
            particles.push(new Particle());
        }

        function drawLines() {
            for (let i = 0; i < particles.length; i++) {
                // Connessione con il mouse
                const dxMouse = mouseX - particles[i].x;
                const dyMouse = mouseY - particles[i].y;
                const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
                if (distMouse < 180) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouseX, mouseY);
                    const alpha = ((180 - distMouse) / 180) * 0.15;
                    ctx.strokeStyle = `rgba(139, 0, 0, ${alpha})`; // Rosso araldico
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }

                // Connessione con altre particelle
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 100) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        const alpha = ((100 - dist) / 100) * 0.12;
                        ctx.strokeStyle = `rgba(236, 192, 151, ${alpha})`; // Oro champagne
                        ctx.lineWidth = 0.4;
                        ctx.stroke();
                    }
                }
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            drawLines();
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
                const yOffset = scrollPos * 0.35;
                heroBg.style.transform = `translateY(${yOffset}px) scale(1.05)`;
            }
        });
    }

    // ----------------------------------------------------------------------
    // 5. Inclinazione 3D & Scintillio Glare sulle Card Prodotto
    // ----------------------------------------------------------------------
    function setupTiltEffect() {
        const cards = document.querySelectorAll(".product-card");
        
        cards.forEach(card => {
            card.addEventListener("mouseenter", () => {
                card.style.transition = "transform 0.15s cubic-bezier(0.25, 1, 0.5, 1), border-color 0.4s";
            });

            card.addEventListener("mousemove", (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const maxTilt = 10;
                const rotateX = ((centerY - y) / centerY) * maxTilt;
                const rotateY = ((x - centerX) / centerX) * -maxTilt;
                
                const xPercent = (x / rect.width) * 100;
                const yPercent = (y / rect.height) * 100;
                card.style.setProperty("--x", `${xPercent}%`);
                card.style.setProperty("--y", `${yPercent}%`);
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            });

            card.addEventListener("mouseleave", () => {
                card.style.transition = "transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s";
                card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
                card.style.setProperty("--x", "50%");
                card.style.setProperty("--y", "50%");
            });
        });
    }

    // ----------------------------------------------------------------------
    // 6. Dataset dei Prodotti EARLIEST (Vestiti)
    // ----------------------------------------------------------------------
    const garmentsData = {
        "1": {
            tag: "FELPA | ARCHIVIO",
            title: "FELPA CON STEMMA IMPERIALE",
            price: "€ 189.00",
            numPrice: 189.00,
            desc: "Capo strutturato d'archivio ad alto spessore. Costruito con cotone spazzolato premium da 450 GSM per un drappeggio geometrico. Presenta il maestoso stemma corona-scudo ricamato in filo rosso ad altissima precisione.",
            fit: "Taglio Imperiale Oversize (Spalle scese)",
            stitching: "Cuciture spessorate rinforzate tono su tono",
            img: "../SHOOTING 1/Replace_the_model's_sweatshirt_with_202605212121 (1).jpeg"
        },
        "2": {
            tag: "HOODIE | ARCHIVIO",
            title: "HOODIE VANGUARD DI LUSSO",
            price: "€ 220.00",
            numPrice: 220.00,
            desc: "La massima espressione dell'Urban Aristocracy. Cappuccio rigido foderato, tasca a marsupio geometrica integrata a spigolo vivo e silhouette boxy. Dettaglio araldico ricamato in rosso.",
            fit: "Boxy Fit Strutturato pesante",
            stitching: "Cuciture spessorate piatte rosse sul retro",
            img: "../SHOOTING 1/Replace_the_model's_sweatshirt_with_202605212121 (2).jpeg"
        },
        "3": {
            tag: "POLO | SOVRANA",
            title: "POLO ARISTOCRATICA SLIM-FIT",
            price: "€ 125.00",
            numPrice: 125.00,
            desc: "Polo a maniche corte sartoriale con colletto rigido a coste e abbottonatura nascosta. Unisce il prestigio classico al comfort metropolitano. Ricamo crest minimale dorato sul petto.",
            fit: "Slim-fit Geometrico con spacchetti",
            stitching: "Orli e bordi con finitura sartoriale invisibile",
            img: "../SHOOTING 1/rendi_il_logo_più_piccolo_202605212124.jpeg"
        },
        "4": {
            tag: "FELPA | DETTAGLI",
            title: "CREWNECK DETTAGLI ROSSI",
            price: "€ 195.00",
            numPrice: 195.00,
            desc: "Una felpa girocollo che esalta le linee anatomiche attraverso vistose cuciture piatte di colore rosso imperiale. Costruita per imporsi nel panorama dello stile metropolitano.",
            fit: "Regular Fit prelavato a coste spesse",
            stitching: "Cuciture piatte a tre aghi in contrasto rosso",
            img: "../SHOOTING 1/sposta_il_logo_in_alto_202605212121.jpeg"
        }
    };

    // ----------------------------------------------------------------------
    // 7. Modale Prodotto (Dettaglio e Selezione Taglia)
    // ----------------------------------------------------------------------
    const productModal = document.getElementById("garmentModal");
    const modalImg = document.getElementById("modalImg");
    const modalTag = document.getElementById("modalTag");
    const modalTitle = document.getElementById("modalTitle");
    const modalPrice = document.getElementById("modalPrice");
    const modalDesc = document.getElementById("modalDesc");
    const modalFit = document.getElementById("modalFit");
    const modalStitch = document.getElementById("modalStitch");
    const closeModalBtn = document.getElementById("closeModal");
    const modalBackdrop = document.getElementById("modalBackdrop");
    const modalAddToCartBtn = document.getElementById("modalAddToCartBtn");

    let currentSelectedProductId = null;
    let selectedSize = "M"; // Dimensione standard

    // Gestione Taglie nella Modale
    const sizeButtons = document.querySelectorAll(".size-btn");
    sizeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            sizeButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            selectedSize = btn.textContent.trim();
        });
    });

    // Delegazione click per aprire la modale
    document.addEventListener("click", (e) => {
        const detailsBtn = e.target.closest(".product-details-btn");
        if (detailsBtn) {
            e.preventDefault();
            const id = detailsBtn.getAttribute("data-id");
            const data = garmentsData[id];
            
            if (data && productModal) {
                currentSelectedProductId = id;
                modalImg.src = data.img;
                modalImg.alt = data.title;
                modalTag.textContent = data.tag;
                modalTitle.textContent = data.title;
                modalPrice.textContent = data.price;
                modalDesc.textContent = data.desc;
                modalFit.textContent = data.fit;
                modalStitch.textContent = data.stitching;

                // Reimposta taglia su 'M'
                sizeButtons.forEach(b => b.classList.remove("active"));
                const defaultSizeBtn = Array.from(sizeButtons).find(b => b.textContent.trim() === "M");
                if (defaultSizeBtn) defaultSizeBtn.classList.add("active");
                selectedSize = "M";

                productModal.classList.add("active");
                document.body.style.overflow = "hidden"; // Blocca scroll di sfondo
            }
        }
    });

    function closeProductModal() {
        if (productModal) {
            productModal.classList.remove("active");
            document.body.style.overflow = "auto";
        }
    }

    // ----------------------------------------------------------------------
    // 7b. Interattività 3D Olografica per la Modale
    // ----------------------------------------------------------------------
    const hologramContainer = document.getElementById("hologramContainer");
    const toggle3DScanBtn = document.getElementById("toggle3DScanBtn");
    const hologramStatusBadge = document.querySelector(".hologram-status-badge");
    let isScanningActive = false;

    function resetHologram() {
        isScanningActive = false;
        if (hologramContainer) {
            hologramContainer.classList.remove("scanning");
            const img = hologramContainer.querySelector("img");
            if (img) {
                img.style.transform = "rotateY(0deg) rotateX(0deg) scale(1)";
                img.style.transition = "transform 0.5s ease";
            }
        }
        if (toggle3DScanBtn) {
            toggle3DScanBtn.innerHTML = "<span>SCANSIONE OLOGRAFICA 3D</span><span class='material-symbols-outlined'>radar</span>";
            toggle3DScanBtn.style.borderColor = "var(--color-primary-bright)";
            toggle3DScanBtn.style.color = "var(--color-primary-bright)";
        }
        if (hologramStatusBadge) {
            hologramStatusBadge.textContent = "TERMINALE OFF";
        }
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", () => {
            closeProductModal();
            resetHologram();
        });
    }
    if (modalBackdrop) {
        modalBackdrop.addEventListener("click", () => {
            closeProductModal();
            resetHologram();
        });
    }

    // Effetto 3D Parallax al movimento del mouse sulla galleria della modale
    if (hologramContainer) {
        hologramContainer.addEventListener("mousemove", (e) => {
            if (isScanningActive) return; // Evita di interferire con l'auto-rotazione

            const rect = hologramContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const maxTilt = 25; // Inclinazione pazzesca
            const rotateX = ((centerY - y) / centerY) * maxTilt;
            const rotateY = ((x - centerX) / centerX) * -maxTilt;
            
            const img = hologramContainer.querySelector("img");
            if (img) {
                img.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
            }
        });

        hologramContainer.addEventListener("mouseleave", () => {
            if (isScanningActive) return;
            const img = hologramContainer.querySelector("img");
            if (img) {
                img.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
                img.style.transition = "transform 0.5s ease";
            }
        });
        
        hologramContainer.addEventListener("mouseenter", () => {
            if (isScanningActive) return;
            const img = hologramContainer.querySelector("img");
            if (img) {
                img.style.transition = "none";
            }
        });
    }

    // Toggle pulsante scansione olografica
    if (toggle3DScanBtn) {
        toggle3DScanBtn.addEventListener("click", (e) => {
            e.preventDefault();
            isScanningActive = !isScanningActive;
            
            if (hologramContainer) {
                if (isScanningActive) {
                    hologramContainer.classList.add("scanning");
                    toggle3DScanBtn.innerHTML = "<span>DIAGNOSTICA IN CORSO...</span><span class='material-symbols-outlined'>hourglass_empty</span>";
                    toggle3DScanBtn.style.borderColor = "var(--color-secondary)";
                    toggle3DScanBtn.style.color = "var(--color-secondary)";
                    if (hologramStatusBadge) {
                        hologramStatusBadge.textContent = "HOLOGRAM ACTIVE";
                    }
                    
                    // Suono/Glow di feedback visivo
                    setTimeout(() => {
                        if (isScanningActive) {
                            toggle3DScanBtn.innerHTML = "<span>STOP SCANSIONE 3D</span><span class='material-symbols-outlined'>stop</span>";
                        }
                    }, 1200);
                } else {
                    resetHologram();
                }
            }
        });
    }

    // ----------------------------------------------------------------------
    // 8. Gestione dello Stato del Carrello Spesa (E-Commerce Logic)
    // ----------------------------------------------------------------------
    let cart = []; // Array di oggetti: { id, title, price, size, quantity, image }

    const cartDrawer = document.getElementById("cartDrawer");
    const cartBackdrop = document.getElementById("cartBackdrop");
    const cartTrigger = document.getElementById("cartTrigger");
    const closeCartBtn = document.getElementById("closeCart");
    const cartItemsWrapper = document.getElementById("cartItemsWrapper");
    const cartCountBadge = document.getElementById("cartCount");
    const cartSubtotalVal = document.getElementById("cartSubtotalVal");
    const checkoutBtn = document.getElementById("checkoutBtn");

    function openCart() {
        if (cartDrawer && cartBackdrop) {
            cartDrawer.classList.add("active");
            cartBackdrop.classList.add("active");
            document.body.style.overflow = "hidden";
        }
    }

    function closeCart() {
        if (cartDrawer && cartBackdrop) {
            cartDrawer.classList.remove("active");
            cartBackdrop.classList.remove("active");
            document.body.style.overflow = "auto";
        }
    }

    if (cartTrigger) cartTrigger.addEventListener("click", openCart);
    if (closeCartBtn) closeCartBtn.addEventListener("click", closeCart);
    if (cartBackdrop) cartBackdrop.addEventListener("click", closeCart);

    // Aggiunta Prodotto al Carrello
    function addToCart(productId, size, quantity = 1) {
        const data = garmentsData[productId];
        if (!data) return;

        // Cerca se esiste già un prodotto identico con la STESSA taglia nel carrello
        const existingItem = cart.find(item => item.id === productId && item.size === size);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: productId,
                title: data.title,
                price: data.numPrice,
                size: size,
                quantity: quantity,
                image: data.img
            });
        }

        renderCart();
        openCart();
    }

    // Aggiungi al carrello da dentro la modale
    if (modalAddToCartBtn) {
        modalAddToCartBtn.addEventListener("click", () => {
            if (currentSelectedProductId) {
                addToCart(currentSelectedProductId, selectedSize, 1);
                
                // Animazione di feedback
                modalAddToCartBtn.innerHTML = "<span>AGGIUNTO AL CARRELLO</span><span class='material-symbols-outlined'>check</span>";
                modalAddToCartBtn.style.backgroundColor = "#ecc097";
                modalAddToCartBtn.style.color = "#050505";
                modalAddToCartBtn.style.borderColor = "#ecc097";
                
                setTimeout(() => {
                    modalAddToCartBtn.innerHTML = "<span>AGGIUNGI AL CARRELLO</span><span class='material-symbols-outlined'>workspace_premium</span>";
                    modalAddToCartBtn.style.backgroundColor = "var(--color-primary)";
                    modalAddToCartBtn.style.color = "var(--color-text-light)";
                    modalAddToCartBtn.style.borderColor = "var(--color-primary)";
                    closeProductModal();
                }, 1000);
            }
        });
    }

    // Aggiungi direttamente dal catalogo con taglia predefinita 'M'
    document.addEventListener("click", (e) => {
        const directAddBtn = e.target.closest(".catalog-add-btn");
        if (directAddBtn) {
            e.preventDefault();
            const id = directAddBtn.getAttribute("data-id");
            addToCart(id, "M", 1);
        }
    });

    // Funzione di aggiornamento grafico del carrello
    function renderCart() {
        if (!cartItemsWrapper) return;

        if (cart.length === 0) {
            cartItemsWrapper.innerHTML = `
                <div class="empty-cart-message">
                    <span class="material-symbols-outlined">shopping_bag</span>
                    <div class="empty-cart-text">IL CARRELLO È VUOTO</div>
                    <div style="font-size: 0.75rem; max-width: 220px; text-transform: uppercase;">Nessun capo d'archivio aggiunto per stabilire la supremazia.</div>
                </div>
            `;
            if (cartCountBadge) cartCountBadge.textContent = "0";
            if (cartSubtotalVal) cartSubtotalVal.textContent = "€ 0.00";
            if (checkoutBtn) checkoutBtn.disabled = true;
            return;
        }

        let html = "";
        let totalItems = 0;
        let subtotal = 0;

        cart.forEach((item, index) => {
            totalItems += item.quantity;
            subtotal += (item.price * item.quantity);

            html += `
                <div class="cart-item-card" data-index="${index}">
                    <div class="cart-item-img-holder">
                        <img src="${item.image}" alt="${item.title}">
                    </div>
                    <div class="cart-item-details">
                        <div>
                            <h4 class="cart-item-title">${item.title}</h4>
                            <div class="cart-item-meta">TAGLIA: ${item.size}</div>
                        </div>
                        <div class="cart-item-controls">
                            <div class="quantity-selector">
                                <button class="qty-btn dec-qty" data-index="${index}">-</button>
                                <span class="qty-val">${item.quantity}</span>
                                <button class="qty-btn inc-qty" data-index="${index}">+</button>
                            </div>
                            <div class="cart-item-price">€ ${(item.price * item.quantity).toFixed(2)}</div>
                        </div>
                    </div>
                    <button class="remove-item-btn" data-index="${index}" aria-label="Rimuovi prodotto">
                        <span class="material-symbols-outlined" style="font-size: 20px;">delete</span>
                    </button>
                </div>
            `;
        });

        cartItemsWrapper.innerHTML = html;
        if (cartCountBadge) cartCountBadge.textContent = totalItems;
        if (cartSubtotalVal) cartSubtotalVal.textContent = `€ ${subtotal.toFixed(2)}`;
        if (checkoutBtn) checkoutBtn.disabled = false;
    }

    // Gestione click dentro il carrello (quantità e rimozione)
    if (cartItemsWrapper) {
        cartItemsWrapper.addEventListener("click", (e) => {
            const decBtn = e.target.closest(".dec-qty");
            const incBtn = e.target.closest(".inc-qty");
            const removeBtn = e.target.closest(".remove-item-btn");

            if (decBtn) {
                const index = parseInt(decBtn.getAttribute("data-index"));
                if (cart[index].quantity > 1) {
                    cart[index].quantity--;
                } else {
                    cart.splice(index, 1);
                }
                renderCart();
            }

            if (incBtn) {
                const index = parseInt(incBtn.getAttribute("data-index"));
                if (cart[index].quantity < 99) {
                    cart[index].quantity++;
                }
                renderCart();
            }

            if (removeBtn) {
                const index = parseInt(removeBtn.getAttribute("data-index"));
                cart.splice(index, 1);
                renderCart();
            }
        });
    }

    // Inizializzazione carrello vuoto al boot
    renderCart();

    // ----------------------------------------------------------------------
    // 9. Modale di Checkout d'Elite (Command Checkout Gate)
    // ----------------------------------------------------------------------
    const checkoutModal = document.getElementById("checkoutModal");
    const closeCheckoutBtn = document.getElementById("closeCheckout");
    const checkoutBackdrop = document.getElementById("checkoutBackdrop");
    const checkoutSummaryItems = document.getElementById("checkoutSummaryItems");
    const checkoutTotalVal = document.getElementById("checkoutTotalVal");
    const checkoutForm = document.getElementById("checkoutForm");
    const checkoutSubmitBtn = document.getElementById("checkoutSubmitBtn");

    function openCheckout() {
        if (checkoutModal && checkoutSummaryItems && checkoutTotalVal) {
            closeCart();
            
            // Popola il riepilogo nel Checkout
            let summaryHtml = "";
            let subtotal = 0;

            cart.forEach(item => {
                subtotal += (item.price * item.quantity);
                summaryHtml += `
                    <div class="checkout-summary-row">
                        <span class="checkout-summary-label">${item.title} (x${item.quantity}) - ${item.size}</span>
                        <span>€ ${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                `;
            });

            checkoutSummaryItems.innerHTML = summaryHtml;
            checkoutTotalVal.textContent = `€ ${subtotal.toFixed(2)}`;

            checkoutModal.classList.add("active");
            document.body.style.overflow = "hidden";
        }
    }

    function closeCheckout() {
        if (checkoutModal) {
            checkoutModal.classList.remove("active");
            document.body.style.overflow = "auto";
        }
    }

    if (checkoutBtn) checkoutBtn.addEventListener("click", openCheckout);
    if (closeCheckoutBtn) closeCheckoutBtn.addEventListener("click", closeCheckout);
    if (checkoutBackdrop) checkoutBackdrop.addEventListener("click", closeCheckout);

    // Gestione invio dell'ordine
    if (checkoutForm && checkoutSubmitBtn) {
        checkoutForm.addEventListener("submit", (e) => {
            e.preventDefault();

            // Animazione di autenticazione dell'ordine
            checkoutSubmitBtn.innerHTML = "<span>CRITTOGRAFIA IN CORSO...</span><span class='material-symbols-outlined'>lock</span>";
            checkoutSubmitBtn.style.backgroundColor = "transparent";
            checkoutSubmitBtn.style.color = "var(--color-secondary)";
            checkoutSubmitBtn.style.borderColor = "var(--color-secondary)";
            
            setTimeout(() => {
                checkoutSubmitBtn.innerHTML = "<span>CONVALIDA CREDENZIALI...</span><span class='material-symbols-outlined'>hourglass_empty</span>";
                
                setTimeout(() => {
                    checkoutSubmitBtn.innerHTML = "<span>ORDINE ACCETTATO</span><span class='material-symbols-outlined'>done_all</span>";
                    checkoutSubmitBtn.style.backgroundColor = "#ecc097";
                    checkoutSubmitBtn.style.color = "#050505";
                    checkoutSubmitBtn.style.borderColor = "#ecc097";
                    checkoutSubmitBtn.style.boxShadow = "0 0 25px rgba(236,192,151,0.5)";
                    
                    // Notifica a schermo minimale ed elegante
                    const alertBox = document.createElement("div");
                    alertBox.style.position = "fixed";
                    alertBox.style.bottom = "30px";
                    alertBox.style.right = "30px";
                    alertBox.style.backgroundColor = "#ecc097";
                    alertBox.style.color = "#050505";
                    alertBox.style.padding = "20px 30px";
                    alertBox.style.fontFamily = "'Cinzel', serif";
                    alertBox.style.fontSize = "0.85rem";
                    alertBox.style.fontWeight = "700";
                    alertBox.style.letterSpacing = "0.2em";
                    alertBox.style.zIndex = "999999";
                    alertBox.style.boxShadow = "0 10px 30px rgba(5,5,5,0.9)";
                    alertBox.textContent = "ORDINE STABILITO. CANALI ARISTOCRATICI ATTIVATI.";
                    document.body.appendChild(alertBox);

                    setTimeout(() => {
                        alertBox.style.opacity = "0";
                        alertBox.style.transition = "opacity 0.8s ease";
                        setTimeout(() => alertBox.remove(), 800);
                    }, 4000);

                    // Svuota carrello ed esce
                    cart = [];
                    renderCart();
                    checkoutForm.reset();

                    setTimeout(() => {
                        closeCheckout();
                        checkoutSubmitBtn.innerHTML = "<span>INVIA CANDIDATURA D'ORDINE</span><span class='material-symbols-outlined'>bolt</span>";
                        checkoutSubmitBtn.style.backgroundColor = "var(--color-primary)";
                        checkoutSubmitBtn.style.color = "var(--color-text-light)";
                        checkoutSubmitBtn.style.borderColor = "var(--color-primary)";
                        checkoutSubmitBtn.style.boxShadow = "0 0 15px var(--color-red-glow)";
                    }, 1200);

                }, 1500);
            }, 1500);
        });
    }

    // ----------------------------------------------------------------------
    // 10. Form Contatti Principale (Command Gate)
    // ----------------------------------------------------------------------
    const commandForm = document.getElementById("commandForm");
    const submitFormBtn = document.getElementById("submitFormBtn");

    if (commandForm && submitFormBtn) {
        commandForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            submitFormBtn.innerHTML = "<span>AUTENTICAZIONE IN CORSO...</span><span class='material-symbols-outlined'>lock</span>";
            submitFormBtn.style.backgroundColor = "transparent";
            submitFormBtn.style.color = "var(--color-secondary)";
            submitFormBtn.style.borderColor = "var(--color-secondary)";
            
            setTimeout(() => {
                submitFormBtn.innerHTML = "<span>ACCESSO CONFERMATO</span><span class='material-symbols-outlined'>done_all</span>";
                submitFormBtn.style.backgroundColor = "#ecc097";
                submitFormBtn.style.color = "#050505";
                submitFormBtn.style.borderColor = "#ecc097";
                submitFormBtn.style.boxShadow = "0 0 25px rgba(236,192,151,0.5)";
                
                const alertBox = document.createElement("div");
                alertBox.style.position = "fixed";
                alertBox.style.bottom = "30px";
                alertBox.style.right = "30px";
                alertBox.style.backgroundColor = "#ecc097";
                alertBox.style.color = "#050505";
                alertBox.style.padding = "20px 30px";
                alertBox.style.fontFamily = "'Cinzel', serif";
                alertBox.style.fontSize = "0.85rem";
                alertBox.style.fontWeight = "700";
                alertBox.style.letterSpacing = "0.2em";
                alertBox.style.zIndex = "999999";
                alertBox.style.boxShadow = "0 10px 30px rgba(5,5,5,0.9)";
                alertBox.textContent = "RICHIESTA REGISTRATA NEL SISTEMA.";
                document.body.appendChild(alertBox);

                setTimeout(() => {
                    alertBox.style.opacity = "0";
                    alertBox.style.transition = "opacity 0.8s ease";
                    setTimeout(() => alertBox.remove(), 800);
                }, 4000);

                commandForm.reset();

                setTimeout(() => {
                    submitFormBtn.innerHTML = "<span>INVIA RICHIESTA ACCESSO</span><span class='material-symbols-outlined'>bolt</span>";
                    submitFormBtn.style.backgroundColor = "var(--color-primary)";
                    submitFormBtn.style.color = "var(--color-text-light)";
                    submitFormBtn.style.borderColor = "var(--color-primary)";
                    submitFormBtn.style.boxShadow = "0 0 15px var(--color-red-glow)";
                }, 3000);

            }, 2000);
        });
    }

    // ----------------------------------------------------------------------
    // 11. Intersection Observer (Rivelazioni Cinematiche allo Scorrimento) & Scramble Reveal
    // ----------------------------------------------------------------------
    function scrambleText(element) {
        const originalText = element.getAttribute("data-original-text") || element.textContent.trim();
        if (!element.getAttribute("data-original-text")) {
            element.setAttribute("data-original-text", originalText);
        }
        
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789[]_#*@$";
        let iteration = 0;
        let interval = null;
        
        clearInterval(interval);
        
        interval = setInterval(() => {
            element.textContent = originalText
                .split("")
                .map((char, index) => {
                    if (char === " " || char === "\n") return char;
                    if (index < iteration) {
                        return originalText[index];
                    }
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join("");
            
            if (iteration >= originalText.length) {
                clearInterval(interval);
                element.textContent = originalText; // Assicura che finisca pulito
            }
            
            iteration += 1 / 3;
        }, 25);
    }

    const revealElements = document.querySelectorAll(".reveal-fade, .reveal-slide-left, .reveal-slide-right, .reveal-fade-up, .reveal-stagger, .scramble-trigger");

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("reveal-active");
                if (entry.target.classList.contains("scramble-trigger")) {
                    scrambleText(entry.target);
                }
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -30px 0px"
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    function triggerScrollReveals() {
        const heroElements = document.querySelectorAll("#hero .reveal-fade, #hero .reveal-fade-up, #hero .reveal-stagger, #hero .scramble-trigger");
        heroElements.forEach(el => {
            el.classList.add("reveal-active");
            if (el.classList.contains("scramble-trigger")) {
                scrambleText(el);
            }
            if (revealObserver) {
                revealObserver.unobserve(el);
            }
        });
    }

    // ----------------------------------------------------------------------
    // 12. Effetto Header Scrolled & Barra Scorrimento Progressiva
    // ----------------------------------------------------------------------
    const header = document.querySelector(".main-header");
    const progressBar = document.getElementById("progressBar");

    window.addEventListener("scroll", () => {
        const scrollPos = window.pageYOffset;
        
        if (header) {
            if (scrollPos > 50) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
        }

        if (progressBar) {
            const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolledPercent = (scrollPos / docHeight) * 100;
            progressBar.style.width = `${scrolledPercent}%`;
        }
    });

    // ----------------------------------------------------------------------
    // 13. Menu Mobile a Scomparsa (Slide Overlay)
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

    // Gestione ESC
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeProductModal();
            closeCart();
            closeCheckout();
            closeSideMenu();
        }
    });

    // Inizializza gli effetti
    setupTiltEffect();

    // ----------------------------------------------------------------------
    // 10. WebGL 3D Procedural Garments Generator (Three.js)
    // ----------------------------------------------------------------------
    function init3DGarment(containerId, accentColor) {
        // Defensive check: if Three.js is not loaded, try to load it dynamically!
        if (typeof THREE === "undefined") {
            console.warn("Three.js non è caricato. Tentativo di caricamento dinamico...");
            
            if (!window.threeJsLoadingStarted) {
                window.threeJsLoadingStarted = true;
                const script = document.createElement("script");
                script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
                script.onload = () => {
                    console.log("Three.js caricato con successo dinamicamente!");
                    init3DGarment("canvasManifesto3D", 0xecc097);
                    init3DGarment("canvasLookbook3D", 0x8b0000);
                };
                script.onerror = () => {
                    console.error("Impossibile caricare Three.js via CDN.");
                };
                document.head.appendChild(script);
            }
            return;
        }

        const container = document.getElementById(containerId);
        if (!container) return;

        // Evita doppie inizializzazioni sullo stesso container
        if (container.querySelector("canvas")) {
            return;
        }

        // Scene, Camera, Renderer
        const scene = new THREE.Scene();
        
        // Safeguards to prevent aspect ratio NaN
        const initWidth = container.clientWidth || 350;
        const initHeight = container.clientHeight || 350;

        const camera = new THREE.PerspectiveCamera(45, initWidth / initHeight, 0.1, 100);
        camera.position.z = 7.5;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(initWidth, initHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.95);
        dirLight1.position.set(5, 5, 5);
        scene.add(dirLight1);

        const dirLight2 = new THREE.DirectionalLight(accentColor, 1.5);
        dirLight2.position.set(-5, 3, -2);
           // Procedural Cotton Fabric Bump Texture Generator
        const createFabricBumpTexture = () => {
            const canvasBump = document.createElement("canvas");
            canvasBump.width = 128;
            canvasBump.height = 128;
            const ctxBump = canvasBump.getContext("2d");
            
            // Draw fine-grain interlocking cotton noise
            ctxBump.fillStyle = "#808080"; // neutral grey base
            ctxBump.fillRect(0, 0, 128, 128);
            
            ctxBump.fillStyle = "#ffffff";
            for (let i = 0; i < 128; i += 2) {
                for (let j = 0; j < 128; j += 2) {
                    if ((i + j) % 4 === 0) {
                        ctxBump.fillRect(i, j, 1, 1);
                    }
                }
            }
            
            ctxBump.fillStyle = "#000000";
            for (let i = 0; i < 128; i += 2) {
                for (let j = 0; j < 128; j += 2) {
                    if ((i - j) % 4 === 0) {
                        ctxBump.fillRect(i, j, 1, 1);
                    }
                }
            }
            
            const tex = new THREE.CanvasTexture(canvasBump);
            tex.wrapS = THREE.RepeatWrapping;
            tex.wrapT = THREE.RepeatWrapping;
            tex.repeat.set(8, 8); // scale texture down
            return tex;
        };
        const bumpTex = createFabricBumpTexture();

        // Create the 3D Garment Group
        const garmentGroup = new THREE.Group();

        // 1. Torso: High-fidelity organic cylinder representing heavy cotton drapes & wrinkles
        const torsoGeom = new THREE.CylinderGeometry(1.0, 1.22, 2.5, 32, 24);
        const posTorso = torsoGeom.attributes.position;
        for (let i = 0; i < posTorso.count; i++) {
            let x = posTorso.getX(i);
            let y = posTorso.getY(i);
            let z = posTorso.getZ(i);
            
            let angle = Math.atan2(z, x);
            let radius = Math.sqrt(x*x + z*z);
            
            // Organic horizontal wrinkles and vertical drapes
            let foldWave1 = Math.sin(y * 5) * 0.05 * Math.cos(angle * 2);
            let foldWave2 = Math.cos(y * 11) * 0.025; // fine horizontal creasing
            let newRadius = radius + foldWave1 + foldWave2;
            
            // Muscular chest postures
            if (y > 0.4 && z > 0) {
                newRadius += 0.08 * Math.sin(angle);
            }
            
            posTorso.setX(i, Math.cos(angle) * newRadius);
            posTorso.setZ(i, Math.sin(angle) * newRadius);
        }
        torsoGeom.computeVertexNormals();

        // Materials: Heavy Matte Cotton Fabric
        const fabricMat = new THREE.MeshStandardMaterial({
            color: 0x070707,
            roughness: 0.88,       // Matte fabric texture
            metalness: 0.12,       // Heavy non-metallic cotton
            bumpMap: bumpTex,
            bumpScale: 0.08
        });

        // Glowing Crimson/Gold wireframe
        const wireframeMat = new THREE.MeshBasicMaterial({
            color: accentColor,
            wireframe: true,
            transparent: true,
            opacity: 0.22
        });

        const torsoMesh = new THREE.Mesh(torsoGeom, fabricMat);
        const torsoWire = new THREE.Mesh(torsoGeom, wireframeMat);
        garmentGroup.add(torsoMesh);
        garmentGroup.add(torsoWire);

        // 2. Long Sleeves: Curved organically using TubeGeometry with elbow wrinkles
        const leftSleevePath = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-1.0, 0.9, 0.0),       // shoulder
            new THREE.Vector3(-1.3, 0.25, 0.15),     // elbow
            new THREE.Vector3(-0.95, -0.45, 0.18)     // wrist
        ]);
        
        const rightSleevePath = new THREE.CatmullRomCurve3([
            new THREE.Vector3(1.0, 0.9, 0.0),        // shoulder
            new THREE.Vector3(1.3, 0.25, 0.15),      // elbow
            new THREE.Vector3(0.95, -0.45, 0.18)      // wrist
        ]);

        const sleeveGeomLeft = new THREE.TubeGeometry(leftSleevePath, 24, 0.38, 16, false);
        const sleeveGeomRight = new THREE.TubeGeometry(rightSleevePath, 24, 0.38, 16, false);

        // Add elbow wrinkling
        const perturbSleeve = (geom) => {
            const pos = geom.attributes.position;
            for (let i = 0; i < pos.count; i++) {
                let x = pos.getX(i);
                let y = pos.getY(i);
                let z = pos.getZ(i);
                
                let distToElbow = Math.abs(y - 0.25);
                if (distToElbow < 0.5) {
                    let wave = Math.sin(y * 24) * 0.045;
                    pos.setX(i, x + wave);
                    pos.setZ(i, z + wave);
                }
            }
            geom.computeVertexNormals();
        };
        perturbSleeve(sleeveGeomLeft);
        perturbSleeve(sleeveGeomRight);

        // Left Sleeve
        const leftSleeveMesh = new THREE.Mesh(sleeveGeomLeft, fabricMat);
        const leftSleeveWire = new THREE.Mesh(sleeveGeomLeft, wireframeMat);
        garmentGroup.add(leftSleeveMesh);
        garmentGroup.add(leftSleeveWire);

        // Right Sleeve
        const rightSleeveMesh = new THREE.Mesh(sleeveGeomRight, fabricMat);
        const rightSleeveWire = new THREE.Mesh(sleeveGeomRight, wireframeMat);
        garmentGroup.add(rightSleeveMesh);
        garmentGroup.add(rightSleeveWire);

        // 3. Ribbed Wrist Cuffs (Cylinders with 3D ribbing vertical grooves)
        const cuffGeom = new THREE.CylinderGeometry(0.34, 0.3, 0.22, 32, 4);
        const posCuff = cuffGeom.attributes.position;
        for (let i = 0; i < posCuff.count; i++) {
            let x = posCuff.getX(i);
            let y = posCuff.getY(i);
            let z = posCuff.getZ(i);
            let angle = Math.atan2(z, x);
            let radius = Math.sqrt(x*x + z*z);
            let rib = Math.sin(angle * 24) * 0.022;
            let newRadius = radius + rib;
            posCuff.setX(i, Math.cos(angle) * newRadius);
            posCuff.setZ(i, Math.sin(angle) * newRadius);
        }
        cuffGeom.computeVertexNormals();

        // Left Wrist Cuff
        const leftCuffMesh = new THREE.Mesh(cuffGeom, fabricMat);
        const leftCuffWire = new THREE.Mesh(cuffGeom, wireframeMat);
        leftCuffMesh.position.set(-0.95, -0.5, 0.18);
        leftCuffMesh.rotation.z = -Math.PI / 8;
        leftCuffWire.position.set(-0.95, -0.5, 0.18);
        leftCuffWire.rotation.z = -Math.PI / 8;
        garmentGroup.add(leftCuffMesh);
        garmentGroup.add(leftCuffWire);

        // Right Wrist Cuff
        const rightCuffMesh = new THREE.Mesh(cuffGeom, fabricMat);
        const rightCuffWire = new THREE.Mesh(cuffGeom, wireframeMat);
        rightCuffMesh.position.set(0.95, -0.5, 0.18);
        rightCuffMesh.rotation.z = Math.PI / 8;
        rightCuffWire.position.set(0.95, -0.5, 0.18);
        rightCuffWire.rotation.z = Math.PI / 8;
        garmentGroup.add(rightCuffMesh);
        garmentGroup.add(rightCuffWire);

        // 4. Crewneck Collar & Bottom Ribbed Hem
        const collarGeom = new THREE.TorusGeometry(0.55, 0.08, 8, 32);
        const posCollar = collarGeom.attributes.position;
        for (let i = 0; i < posCollar.count; i++) {
            let x = posCollar.getX(i);
            let y = posCollar.getY(i);
            let z = posCollar.getZ(i);
            let angle = Math.atan2(z, x);
            let radius = Math.sqrt(x*x + z*z);
            let rib = Math.sin(angle * 28) * 0.015;
            let newRadius = radius + rib;
            posCollar.setX(i, Math.cos(angle) * newRadius);
            posCollar.setZ(i, Math.sin(angle) * newRadius);
        }
        collarGeom.computeVertexNormals();

        const collarMesh = new THREE.Mesh(collarGeom, fabricMat);
        const collarWire = new THREE.Mesh(collarGeom, wireframeMat);
        const collarGroup = new THREE.Group();
        collarGroup.add(collarMesh);
        collarGroup.add(collarWire);
        collarGroup.position.set(0, 1.25, 0.05);
        collarGroup.rotation.x = Math.PI / 2 + 0.15;
        garmentGroup.add(collarGroup);

        // Ribbed waist bottom hem
        const bottomHemGeom = new THREE.CylinderGeometry(1.26, 1.26, 0.25, 32, 4);
        const posHem = bottomHemGeom.attributes.position;
        for (let i = 0; i < posHem.count; i++) {
            let x = posHem.getX(i);
            let y = posHem.getY(i);
            let z = posHem.getZ(i);
            let angle = Math.atan2(z, x);
            let radius = Math.sqrt(x*x + z*z);
            let rib = Math.sin(angle * 32) * 0.025;
            let newRadius = radius + rib;
            posHem.setX(i, Math.cos(angle) * newRadius);
            posHem.setZ(i, Math.sin(angle) * newRadius);
        }
        bottomHemGeom.computeVertexNormals();

        const bottomHemMesh = new THREE.Mesh(bottomHemGeom, fabricMat);
        const bottomHemWire = new THREE.Mesh(bottomHemGeom, wireframeMat);
        const bottomHemGroup = new THREE.Group();
        bottomHemGroup.add(bottomHemMesh);
        bottomHemGroup.add(bottomHemWire);
        bottomHemGroup.position.set(0, -1.25, 0);
        garmentGroup.add(bottomHemGroup);

        // 5. Logo Crests (Front Left Chest & Large Back)ont Left Chest & Large Back)
        const frontCrestGeom = new THREE.PlaneGeometry(0.42, 0.42);
        const backCrestGeom = new THREE.PlaneGeometry(0.85, 0.85);
        const textureLoader = new THREE.TextureLoader();
        
        const addCrestPlacements = (textureMap) => {
            // Front Chest Crest (Crimson Red)
            const frontCrestMat = new THREE.MeshBasicMaterial({
                map: textureMap,
                transparent: true,
                side: THREE.DoubleSide,
                depthWrite: false,
                color: 0xaa1111 // Tint Crimson Red
            });
            const frontCrestMesh = new THREE.Mesh(frontCrestGeom, frontCrestMat);
            frontCrestMesh.position.set(-0.38, 0.52, 1.15);
            frontCrestMesh.rotation.y = Math.PI / 8; // align to cylinder chest curve
            garmentGroup.add(frontCrestMesh);

            // Large Back Crest (Crimson Red)
            const backCrestMat = new THREE.MeshBasicMaterial({
                map: textureMap,
                transparent: true,
                side: THREE.DoubleSide,
                depthWrite: false,
                color: 0xaa1111 // Tint Crimson Red
            });
            const backCrestMesh = new THREE.Mesh(backCrestGeom, backCrestMat);
            backCrestMesh.position.set(0, 0.3, -1.18);
            backCrestMesh.rotation.y = Math.PI; // Face Backwards
            garmentGroup.add(backCrestMesh);
        };

        // Caricamento texture con fallback automatico su errore CORS/404
        textureLoader.load(
            '../../logo/png senza sfondo/6.png',
            (texture) => {
                addCrestPlacements(texture);
            },
            undefined,
            (err) => {
                console.warn("CORS o 404 bloccato per la texture locale. Caricamento del segnaposto digitale rosso araldico.");
                
                // Crea un emblema segnaposto tramite canvas 2D dinamico
                const canvasCrest = document.createElement("canvas");
                canvasCrest.width = 128;
                canvasCrest.height = 128;
                const ctxCrest = canvasCrest.getContext("2d");
                
                ctxCrest.fillStyle = "rgba(0,0,0,0)";
                ctxCrest.fillRect(0,0,128,128);
                
                ctxCrest.strokeStyle = "#aa1111";
                ctxCrest.lineWidth = 4;
                ctxCrest.beginPath();
                // Disegna scudo araldico
                ctxCrest.moveTo(64, 20);
                ctxCrest.lineTo(94, 40);
                ctxCrest.lineTo(94, 80);
                ctxCrest.quadraticCurveTo(64, 115, 64, 115);
                ctxCrest.quadraticCurveTo(34, 80, 34, 80);
                ctxCrest.lineTo(34, 40);
                ctxCrest.closePath();
                ctxCrest.stroke();

                // Lettera 'E' centrale ricamata
                ctxCrest.fillStyle = "#aa1111";
                ctxCrest.font = "bold 44px 'Cinzel', serif";
                ctxCrest.textAlign = "center";
                ctxCrest.textBaseline = "middle";
                ctxCrest.fillText("E", 64, 68);

                const fallbackTexture = new THREE.CanvasTexture(canvasCrest);
                addCrestPlacements(fallbackTexture);
            }
        );

        // 5. Holographic Scanline Sweep: Torus sweep
        const scanRingGeom = new THREE.TorusGeometry(1.35, 0.015, 8, 48);
        const scanRingMat = new THREE.MeshBasicMaterial({
            color: accentColor,
            transparent: true,
            opacity: 0.85
        });
        const scanRing = new THREE.Mesh(scanRingGeom, scanRingMat);
        scanRing.rotation.x = Math.PI / 2;
        scanRing.position.y = -1.2;
        garmentGroup.add(scanRing);

        scene.add(garmentGroup);

        // Levitation base position
        garmentGroup.position.y = -0.2;

        // Mouse Rotation State
        const interactiveTarget = container.parentElement || container;
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };
        let targetRotationX = 0;
        let targetRotationY = 0;
        let scanDirection = 1;

        // Mouse Down / Touch Start
        const onDragStart = (e) => {
            isDragging = true;
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            previousMousePosition = { x: clientX, y: clientY };
        };

        // Mouse Move / Touch Move
        const onDragMove = (e) => {
            if (!isDragging) return;

            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

            const deltaMove = {
                x: clientX - previousMousePosition.x,
                y: clientY - previousMousePosition.y
            };

            targetRotationY += deltaMove.x * 0.007;
            targetRotationX += deltaMove.y * 0.007;

            previousMousePosition = { x: clientX, y: clientY };
        };

        const onDragEnd = () => {
            isDragging = false;
        };

        // Event bindings on parent card (to bypass z-index overlay blocking)
        interactiveTarget.addEventListener('mousedown', onDragStart);
        interactiveTarget.addEventListener('touchstart', onDragStart, { passive: true });
        
        interactiveTarget.addEventListener('mousemove', onDragMove);
        interactiveTarget.addEventListener('touchmove', onDragMove, { passive: true });
        
        window.addEventListener('mouseup', onDragEnd);
        window.addEventListener('touchend', onDragEnd);

        // Prevent dragging page on mobile touch drag inside interactive card
        interactiveTarget.addEventListener('touchmove', (e) => {
            if (isDragging) e.preventDefault();
        }, { passive: false });

        // Animation Loop
        let frameCount = 0;
        function animate() {
            frameCount++;
            requestAnimationFrame(animate);

            // Laser scanner animation
            scanRing.position.y += 0.018 * scanDirection;
            if (scanRing.position.y > 1.8) {
                scanDirection = -1;
            } else if (scanRing.position.y < -1.4) {
                scanDirection = 1;
            }

            // Glow fluctuation
            scanRingMat.opacity = 0.4 + Math.sin(frameCount * 0.04) * 0.35;

            // Automatic lazy spin
            if (!isDragging) {
                targetRotationY += 0.003;
            }

            // Clamp vertical rotation
            targetRotationX = Math.max(-Math.PI / 4.5, Math.min(Math.PI / 4.5, targetRotationX));

            // Smooth Interpolated Inertia (LERP)
            garmentGroup.rotation.y += (targetRotationY - garmentGroup.rotation.y) * 0.07;
            garmentGroup.rotation.x += (targetRotationX - garmentGroup.rotation.x) * 0.07;

            // Levitating floating bounce
            garmentGroup.position.y = -0.2 + Math.sin(frameCount * 0.012) * 0.1;

            renderer.render(scene, camera);
        }
        animate();

        // Responsive Observer
        const resizeObserver = new ResizeObserver(() => {
            const w = container.clientWidth;
            const h = container.clientHeight;
            if (w > 0 && h > 0) {
                camera.aspect = w / h;
                camera.updateProjectionMatrix();
                renderer.setSize(w, h);
            }
        });
        resizeObserver.observe(container);
    }

    // Inizializza i modelli 3D dei vestiti del brand
    init3DGarment("canvasManifesto3D", 0xecc097); // Gold accent in Manifesto
    init3DGarment("canvasLookbook3D", 0x8b0000);  // Crimson accent in Lookbook
});
