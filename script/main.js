$(document).ready(function () {
    const $sliderContainer = $("#slider-container");
    const swiper = new Swiper(".mySwiper", {
        effect: "cards",
        grabCursor: true,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        speed: 700, // Устанавливаем скорость анимации
    });

    let isSliderActive = false;
    let scrollDelta = 0;
    const scrollThreshold = 50;
    let isScrollingAllowed = true;
    const breakpoint = 1280;

    function calculateScrollbarWidth() {
        const scrollDiv = document.createElement("div");
        scrollDiv.style.overflow = "scroll";
        scrollDiv.style.width = "50px";
        scrollDiv.style.height = "50px";
        scrollDiv.style.visibility = "hidden";
        document.body.appendChild(scrollDiv);

        const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
        document.body.removeChild(scrollDiv);
        return scrollbarWidth;
    }

    const scrollbarWidth = calculateScrollbarWidth();

    function blockPageScroll() {
        $("body").css({
            overflow: "hidden",
            "padding-right": scrollbarWidth + "px",
        });
    }

    function unblockPageScroll() {
        $("body").css({
            overflow: "",
            "padding-right": "",
        });
    }

    function isSliderInView() {
        const rect = $sliderContainer[0].getBoundingClientRect();
        const windowHeight = $(window).height();
        return rect.top <= windowHeight / 2 && rect.bottom >= windowHeight / 2;
    }

    function handleSliderScroll(event) {
        const isLastSlide = swiper.activeIndex === swiper.slides.length - 1;
        const isFirstSlide = swiper.activeIndex === 0;

        if (!isScrollingAllowed) return;

        scrollDelta += event.deltaY;

        if (Math.abs(scrollDelta) >= scrollThreshold) {
            if (scrollDelta > 0) {
                if (!isLastSlide) {
                    swiper.slideNext();
                    blockScrollingTemporarily();
                } else {
                    unblockPageScroll();
                    isSliderActive = false;
                    window.scrollBy(0, scrollDelta);
                }
            } else {
                if (!isFirstSlide) {
                    swiper.slidePrev();
                    blockScrollingTemporarily();
                } else {
                    unblockPageScroll();
                    isSliderActive = false;
                    window.scrollBy(0, scrollDelta);
                }
            }
            scrollDelta = 0;
        }
    }

    function blockScrollingTemporarily() {
        isScrollingAllowed = false;
        setTimeout(() => {
            isScrollingAllowed = true;
        }, 500); // Принудительная задержка 500 мс
    }

    function handleScroll(event) {
        if (isSliderInView()) {
            event.preventDefault();
            blockPageScroll();
            isSliderActive = true;
            handleSliderScroll(event);
        } else {
            unblockPageScroll();
            isSliderActive = false;
        }
    }

    function enableScrollHandling() {
        window.addEventListener("wheel", handleScroll, { passive: false });
    }

    function disableScrollHandling() {
        window.removeEventListener("wheel", handleScroll);
        unblockPageScroll();
    }

    function checkScreenSize() {
        if ($(window).width() >= breakpoint) {
            enableScrollHandling();
        } else {
            disableScrollHandling();
        }
    }

    $(window).on("resize", checkScreenSize);
    checkScreenSize();
});
