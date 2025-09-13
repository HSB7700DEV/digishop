document.addEventListener('DOMContentLoaded', () => {
    // --- Homepage Slider ---
    const slider = document.querySelector('.slider');
    if (slider) {
        const slides = slider.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.slider-dots .dot');
        let currentSlide = 0;
        let slideInterval = setInterval(nextSlide, 5000);

        function goToSlide(n) {
            if (slides.length === 0) return;
            slides[currentSlide].classList.remove('active');
            dots[currentSlide].classList.remove('active');
            currentSlide = (n + slides.length) % slides.length;
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
        }

        function nextSlide() { goToSlide(currentSlide + 1); }
        
        document.querySelector('.slider-nav.next')?.addEventListener('click', () => {
            nextSlide();
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000);
        });
        document.querySelector('.slider-nav.prev')?.addEventListener('click', () => {
            goToSlide(currentSlide - 1);
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000);
        });
        dots.forEach(dot => dot.addEventListener('click', (e) => {
            goToSlide(parseInt(e.target.dataset.slide));
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000);
        }));
    }

    // --- Homepage Carousel ---
    const carousel = document.getElementById('product-carousel');
    if (carousel) {
        const nextBtn = document.getElementById('nextBtn');
        const prevBtn = document.getElementById('prevBtn');
        nextBtn.addEventListener('click', () => carousel.scrollBy({ left: -carousel.clientWidth * 0.8, behavior: 'smooth' }));
        prevBtn.addEventListener('click', () => carousel.scrollBy({ left: carousel.clientWidth * 0.8, behavior: 'smooth' }));
    }
});