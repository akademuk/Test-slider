document.addEventListener("DOMContentLoaded", () => {
    const sliderContainer = document.getElementById("slider-container");

    const swiper = new Swiper(".mySwiper", {
        effect: "cards",
        grabCursor: true,
    });

    let scrollDelta = 0;
    const scrollThreshold = 40;
    let isSliderActive = false;

    function isSliderInView() {
        const containerRect = sliderContainer.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        return (
            containerRect.top <= windowHeight / 2 &&
            containerRect.bottom >= windowHeight / 2
        );
    }

    function smoothScrollAfterSlider(event) {
        const offset = event.deltaY > 0 ? 1 : -1;
        window.scrollBy({
            top: offset * Math.abs(event.deltaY),
            behavior: "smooth",
        });
    }

    function handleScroll(event) {
        const isLastSlide = swiper.activeIndex === swiper.slides.length - 1;
        const isFirstSlide = swiper.activeIndex === 0;

        if (!isSliderInView()) {
            isSliderActive = false;
            return;
        }

        isSliderActive = true;
        event.preventDefault();
        scrollDelta += event.deltaY;

        if (isLastSlide && scrollDelta > 0) {
            scrollDelta = 0;
            isSliderActive = false;
            smoothScrollAfterSlider(event);
            return;
        }

        if (isFirstSlide && scrollDelta < 0) {
            scrollDelta = 0;
            isSliderActive = false;
            smoothScrollAfterSlider(event);
            return;
        }

        if (Math.abs(scrollDelta) >= scrollThreshold) {
            if (scrollDelta > 0) {
                swiper.slideNext();
            } else {
                swiper.slidePrev();
            }
            scrollDelta = 0;
        }
    }

    window.addEventListener("wheel", handleScroll, { passive: false });
});
