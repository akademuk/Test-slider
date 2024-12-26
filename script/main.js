$(document).ready(function () {
    const $sliderContainer = $("#slider-container");
    const swiper = new Swiper(".mySwiper", {
        effect: "cards",
        grabCursor: true,
    });

    let isSliderActive = false; // Флаг активности слайдера
    let scrollDelta = 0; // Накопитель прокрутки
    const scrollThreshold = 50; // Порог для переключения слайдов
    let isScrollingAllowed = true; // Флаг для ограничения скорости переключения
    let scrollbarWidth = 0; // Ширина скроллбара

    // Функция для расчёта ширины скроллбара
    function calculateScrollbarWidth() {
        const scrollDiv = document.createElement("div");
        scrollDiv.style.overflow = "scroll";
        scrollDiv.style.width = "50px";
        scrollDiv.style.height = "50px";
        scrollDiv.style.visibility = "hidden";
        document.body.appendChild(scrollDiv);

        scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
        document.body.removeChild(scrollDiv);
    }

    // Проверка, находится ли блок слайдера в зоне видимости
    function isSliderInView() {
        const rect = $sliderContainer[0].getBoundingClientRect();
        const windowHeight = $(window).height();
        return rect.top <= windowHeight / 2 && rect.bottom >= windowHeight / 2;
    }

    // Блокировка прокрутки страницы с компенсацией скроллбара
    function blockPageScroll() {
        $("body").css({
            overflow: "hidden",
            "padding-right": scrollbarWidth + "px",
        });
    }

    // Разблокировка прокрутки страницы и удаление компенсации
    function unblockPageScroll() {
        $("body").css({
            overflow: "",
            "padding-right": "",
        });
    }

    // Обработка прокрутки внутри слайдера
    function handleSliderScroll(event) {
        const isLastSlide = swiper.activeIndex === swiper.slides.length - 1;
        const isFirstSlide = swiper.activeIndex === 0;

        if (!isScrollingAllowed) return; // Пропускаем событие, если скролл заблокирован

        scrollDelta += event.originalEvent.deltaY;

        if (Math.abs(scrollDelta) >= scrollThreshold) {
            if (scrollDelta > 0) {
                // Скролл вниз
                if (!isLastSlide) {
                    swiper.slideNext();
                    blockScrollingTemporarily();
                } else {
                    // Разрешаем прокрутку страницы после последнего слайда
                    unblockPageScroll();
                    isSliderActive = false;
                    $(window).scrollTop($(window).scrollTop() + scrollDelta);
                }
            } else {
                // Скролл вверх
                if (!isFirstSlide) {
                    swiper.slidePrev();
                    blockScrollingTemporarily();
                } else {
                    // Разрешаем прокрутку страницы перед первым слайдом
                    unblockPageScroll();
                    isSliderActive = false;
                    $(window).scrollTop($(window).scrollTop() + scrollDelta);
                }
            }
            scrollDelta = 0; // Сброс накопителя
        }
    }

    // Блокировка дальнейших событий на время выполнения анимации
    function blockScrollingTemporarily() {
        isScrollingAllowed = false;
        setTimeout(() => {
            isScrollingAllowed = true;
        }, 700); // Таймаут совпадает с длительностью анимации Swiper
    }

    // Основной обработчик прокрутки
    function handleScroll(event) {
        if (isSliderInView()) {
            event.preventDefault(); // Блокируем стандартный скролл
            blockPageScroll(); // Блокируем прокрутку страницы
            isSliderActive = true; // Активируем слайдер
            handleSliderScroll(event); // Управляем переключением слайдов
        } else {
            unblockPageScroll(); // Разрешаем стандартный скролл, если слайдер не в зоне видимости
            isSliderActive = false; // Деактивируем слайдер
        }
    }

    // Привязка события прокрутки
    $(window).on("wheel", (event) => {
        if (isSliderActive || isSliderInView()) {
            handleScroll(event);
        }
    });

    // Рассчитать ширину скроллбара при загрузке страницы
    calculateScrollbarWidth();
});
