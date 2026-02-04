class TeamSlider {
    constructor(teamSelector, cardSelector) {
        this.teamRow = document.querySelector(teamSelector);
        this.memberCards = document.querySelectorAll(cardSelector);

        this.currentIndex = 0;
        this.isScrolling = false;
        this.scrollTimeout = null;

        this.touchStartX = 0;
        this.touchStartY = 0;

        this.init();
    }

    // -----------------------------
    // Set active card (mobile)
    // -----------------------------
    setActiveCard(index) {
        if (window.innerWidth > 950) return;

        const minus = window.innerWidth <= 450 ? 13 : 20;

        // Clamp index
        index = Math.max(0, Math.min(index, this.memberCards.length - 1));
        this.currentIndex = index;

        // Remove active from all cards
        this.memberCards.forEach(card => card.classList.remove('active'));
        // Set active
        this.memberCards[index].classList.add('active');

        // Center card
        const styles = window.getComputedStyle(this.teamRow);
        const cardWidth = this.memberCards[0].offsetWidth;
        const gap = parseFloat(styles.rowGap);
        const screenCenter = window.innerWidth / 2;
        const totalOffset = (cardWidth + gap) * index;
        const marginNeeded = screenCenter - cardWidth / 2 - totalOffset - minus;

        this.memberCards[0].style.marginLeft = `${marginNeeded}px`;
    }

    // -----------------------------
    // Mobile: click on card
    // -----------------------------
    handleMobileClicks() {
        this.memberCards.forEach((card, index) => {
            card.addEventListener('click', () => {
                if (window.innerWidth <= 950) this.setActiveCard(index);
            });
        });
    }

    // -----------------------------
    // Mobile: swipe handling
    // -----------------------------
    handleTouch() {
        this.teamRow.addEventListener('touchstart', e => {
            if (window.innerWidth > 950) return;

            this.touchStartX = e.touches[0].clientX;
            this.touchStartY = e.touches[0].clientY;
        });

        this.teamRow.addEventListener('touchmove', e => {
            if (window.innerWidth > 950) return;

            clearTimeout(this.scrollTimeout);

            if (!this.isScrolling) {
                const touchEndX = e.touches[0].clientX;
                const touchEndY = e.touches[0].clientY;

                const diffX = this.touchStartX - touchEndX;
                const diffY = this.touchStartY - touchEndY;

                if (Math.abs(diffX) > 20 && Math.abs(diffX) >= 0.5 * Math.abs(diffY)) {
                    this.isScrolling = true;

                    if (diffX > 0) this.setActiveCard(this.currentIndex + 1);
                    else this.setActiveCard(this.currentIndex - 1);
                }
            }

            this.scrollTimeout = setTimeout(() => (this.isScrolling = false), 500);
        });
    }


    // -----------------------------
    // Desktop: hover & touch interactions
    // -----------------------------
    initDesktopInteractions() {
        this.memberCards.forEach(card => {
            card.addEventListener('pointerdown', e => {
                if (e.pointerType === 'mouse') return;

                const isActive = card.classList.contains('active');

                this.memberCards.forEach(c => c.classList.remove('active'));
                this.teamRow.classList.remove('active');

                if (!isActive) {
                    card.classList.add('active');
                    this.teamRow.classList.add('active');
                }
            });

            card.addEventListener('mouseenter', () => {
                card.classList.add('active');
                this.teamRow.classList.add('active');
            });

            card.addEventListener('mouseleave', () => {
                card.classList.remove('active');
                this.teamRow.classList.remove('active');
            });
        });

        this.teamRow.parentElement.addEventListener('pointerdown', e => {
            if (!this.teamRow.contains(e.target)) {
                this.memberCards.forEach(card => card.classList.remove('active'));
                this.teamRow.classList.remove('active');
            }
        });
    }


    // -----------------------------
    // Handle window resize
    // -----------------------------
    handleResize() {
        window.addEventListener('resize', () => {
            if (window.innerWidth <= 950) {
                this.setActiveCard(this.currentIndex);
            } else {
                // Clear mobile states
                this.memberCards.forEach(card => card.classList.remove('active'));
                this.teamRow.classList.remove('active');
                this.memberCards[0].style.marginLeft = '';
                this.currentIndex = 0;
                this.initDesktopInteractions();
            }
        });
    }

    // -----------------------------
    // Initialize all
    // -----------------------------
    init() {
        if (window.innerWidth <= 950) this.setActiveCard(0);
        this.handleMobileClicks();
        this.handleTouch();
        if (window.innerWidth > 950) this.initDesktopInteractions();
        this.handleResize();
    }
}

// -----------------------------
// Initialize the slider
// -----------------------------
const teamSlider = new TeamSlider('.team-row', '.team-member-card');
const clientSlider = new TeamSlider('.clients-row', '.client-card');