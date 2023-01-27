// Настройка слайдеров
function setCorrectSlider() {
  const $tasks = $('.task');
  const $now = $('.slider__buttons .now');
  const $all = $('.slider__buttons .all');
  let actives = 1;

  $now.text(actives);
  $all.text($tasks.length);


  // Слайдер с картинками
  $('.case__aside').slick({
    arrows: false,
    asNavFor: '.case__content',
    speed: 1000,
    fade: true,
    // autoplay: true,
    autoplaySpeed: 2000,
    draggable: false
  });

  $('.case__aside').on('beforeChange', (event, slick, currentSlide, nextSlide) => {
    actives = nextSlide + 1;
    $now.text(actives);
  });

  // Кастомные кнопки навигации
  $('.slider__prev').on('click', () => {
    $('.case__aside').slick('slickPrev');
  });
  $('.slider__next').on('click', () => {
    $('.case__aside').slick('slickNext');
  });

  // Слайдер с вопросом - ответом
  $('.case__content').slick({
    arrows: false,
    asNavFor: '.case__aside',
    speed: 1000,
    fade: true,
    // autoplay: true,
    autoplaySpeed: 2000,
    draggable: false,
  });
}


// Установка скролла по секциям
function setCorrectScroll() {
  if (window.matchMedia('(min-width: 720px)').matches) {
    $.scrollify.enable(); // Если посекционная прокрутка была выключена - она будет включена
    const $dots = $('.dot');

    $dots.on('click', function(event) {
      event.preventDefault();
      $.scrollify.move($(this).attr('href'));
    });

    $.scrollify({
      section: '.section',
      scrollSpeed: 1100,
      setHeights: true,
      interstitialSection:".footer",

      before: function(i, panels) {
        $dots.removeClass('active');
        if (i >= $dots.length) $($dots[$dots.length-1]).addClass('active');
        else $($dots[i]).addClass('active');
      },
      afterRender: function() {
      }
    });
  } else {
    $.scrollify.disable(); // Отключаем посекционную прокрутку
  }
}


// Настройка аккордеона с ответами на вопросы
function setCorrectAccordeon() {
  const accordeon = document.querySelector('.accordeon');
  const answers = accordeon.querySelectorAll('.answer');

  answers.forEach(answer => {
    answer.addEventListener('click', () => {
      answers.forEach(other => {
        if (other !== answer) {
          hideAnswer(other);
        }
      });
      showAnswer(answer);
    });
  });
  
  // показать ответ (элемент аккордеона)
  function showAnswer(answer) {
    const content = answer.querySelector('.answer-content');
    
    if (!answer.classList.contains('active')) {
      answer.classList.add('active');
      content.style.maxHeight = content.scrollHeight + 'px';
    } else {
      hideAnswer(answer, content);
    }

    $.scrollify.update();
  }
  
  
  // скрыть ответ (элемент аккордеона)
  function hideAnswer(answer, content) {
    if (!content) content = answer.querySelector('.answer-content');
    answer.classList.remove('active');
    content.style.maxHeight = 0 + 'px';
    
    $.scrollify.update();
  }
}


// Настройка ссылок-якорей
function setCorrectAnchors() {
  const anchors = document.querySelectorAll('.anchor');

  anchors.forEach(anchor => {
    anchor.addEventListener('click', (event) => {
      event.preventDefault();
      const toScroll = anchor.getAttribute('href');
      
      // Если больше планшета - то работает посекционный скролл
      if (window.matchMedia('(min-width: 720px)').matches) {
        console.log(toScroll);
        $.scrollify.move(toScroll);
      } else {
        const sectionToScroll = document.querySelector(toScroll);
        window.scrollTo({
          top: sectionToScroll.getBoundingClientRect().y,
          behavior: 'smooth'
        });
      }
    });
  });
}


// Анимация земли со спутником в шапке сайта по движению мыши
function setCorrectEarthAnimation() {
  const header = document.querySelector('.header');
  const earth = header.querySelector('.promo__image img.earth');
  const sputnik = header.querySelector('.promo__image img.sputnik');
  const light = header.querySelector('.promo__image img.light');
  const stars = header.querySelector('.promo__image img.stars');

  let [x, y] = [null, null];
  document.body.addEventListener('mousemove', (event) => {
    x = event.clientX;
    y = event.clientY;

    earth.style.transform = `translate(${x / 20}px, ${y / 15}px)`;
    sputnik.style.transform = `translate(${x / 30}px, ${y / 20}px)`;
    light.style.transform = `translate(${x / 30}px, ${y / 20}px)`;
    stars.style.transform = `translate(${x / 70}px, ${y / 50}px)`;
  });
}

// Слежение за точками навигации через обсервер (для устройств, где не будет посекционного скролла)
function setCorrectDotsOnMobiles() {
  if (window.matchMedia('(max-width: 720px)').matches) {
    const dots = document.querySelectorAll('.dot');
    const sections = document.querySelectorAll('.section');
    const observer = new IntersectionObserver(entryCallback, {
      threshold: 1,
    });

    
    // Обработчик для входных секций
    function entryCallback(items) {
      items.forEach(item => {
        if (item.isIntersecting) {
          const dotIndex = Array.from(sections).indexOf(item.target);
          addActiveToDot(dotIndex);
        }
      });
    }
    
    sections.forEach(section => {
      observer.observe(section);
    });
    
    // Добавить класс active на точку, соотвествующей нужной секции
    function addActiveToDot(dotIndex) {
      dots.forEach(dot => dot.classList.remove('active'));
      dots[dotIndex].classList.add('active');
    }
  }
}


// Настройка опроса (квиз)
function setCorrectQuiz() {
  const startQuiz = document.querySelector('.quiz-start__activate');
  const quiz = document.querySelector('.quiz');
  const quizContent = quiz.querySelector('.quiz .content');
  const quizClose =  quiz.querySelector('.quiz__close');

  // Появление и скрытие квиза
  startQuiz.addEventListener('click', showQuiz);
  quiz.addEventListener('click', hideQuiz);
  quizClose.addEventListener('click', hideQuiz);

  // Показать опросник
  function showQuiz() {
    quiz.classList.add('active');
    document.body.classList.add('unscroll');
  }

  // Скрыть опросник
  function hideQuiz(event) {
    // Если кликнули на содержимое квиза (за исключением крестика) - не скрываем квиз
    if (event.target.closest('.content') === quizContent && event.target !== quizClose) return;

    quiz.style.opacity = 0;
    setTimeout(() => {
      quiz.style.zIndex = -1;
      quiz.classList.remove('active');
      quiz.style = "";
      document.body.classList.remove('unscroll');
    }, 550);
  }
}


// Логика квиза
function setCorrectLogicQuiz() {
  const questionString = document.querySelector('.quiz-main__question .question-title');
  const answersList = document.querySelector('.quiz-main__answers');
  const allAnswers = answersList.getElementsByClassName('quiz-main__variant');
  const stepCounts = document.querySelector('.quiz-main__count');
  const stepNow = stepCounts.querySelector('.quiz-main__now');
  const stepAll = stepCounts.querySelector('.quiz-main__all');
  const next = document.querySelector('.question__next');

  let result = {};
  let step = 0;

  // Обрабатываем клик на ответ
  answersList.addEventListener('click', clickOnAnswer);

  // Устанавливаем максимальное значение 
  stepAll.textContent = questions.length;

  showQuestion(step);

  // Показать вопрос по его индексу
  function showQuestion(questionIndex) {
    next.classList.remove('active');

    const questionTitle = questions[questionIndex]['title'];
    const questionAnswers = questions[questionIndex]['answers'];
    let answers = '';

    // Вывод вопроса
    questionString.textContent = questionTitle;

    // Вывод вариантов ответа
    for (key in questionAnswers)
      answers += `<li class="quiz-main__variant" data-value="${key}">${questionAnswers[key]}</li>`
    answersList.innerHTML = answers;

    // Обновление счётчика
    stepNow.textContent = step+1;
  }

  // Обработка клика на ответ
  function clickOnAnswer(event) {
    event.stopPropagation();
    if (!event.target.dataset.value) return;
    else answerToActive(event.target);
  }


  // Показ результата
  function showResult() {
    const maxValueKey = Object.keys(result)
      .reduce((prev, next) => result[prev] > result[next] ? prev : next);
    console.log(maxValueKey);
    console.log(result);
    const finalObj = {
      isFinal: true,
      maxValueKey,
    };
    hideDecor(finalObj);
  }

  // Выделить кнопку
  function answerToActive(answer) {
    for (otherAnswer of allAnswers) {
      otherAnswer === answer ? 
        answer.classList.toggle('active') 
        : 
        otherAnswer.classList.remove('active');
    }

    // Если нажатая кнопка выделилась - то показываем кнопку "дальше" и передаём ей значения в dataset
    if (answer.classList.contains('active')) {
      next.classList.add('active');
      next.dataset.value = answer.dataset.value;
    } else {
      next.classList.remove('active');
      next.dataset.value = "";
    }

    next.onclick = (event) => {
      const answerBtn = event.target;
      if (!answerBtn.classList.contains('active')) return;

      const answerValue = answerBtn.dataset.value; // Категория ответа
      if (result[answerValue]) result[answerValue]++;
      else result[answerValue] = 1;
      
      // Если этап ещё не конечный - продолжаем квиз
      if (step+1 < questions.length) {
        showQuestion(++step);
      } else {
        showResult();
      }
    }
  }

    // Скрыть неважные элементы
    function hideDecor({ isFinal, maxValueKey }) {
      if (isFinal) {
        stepCounts.hidden = true;
        next.classList.remove('active');

        questionString.textContent = "Итоги тестирования";
        console.log(results[maxValueKey], maxValueKey);
        answersList.innerHTML = '<p class="quiz-main__result">' + results[maxValueKey].title + '</p>';
        answersList.innerHTML += '<button class="quiz-main__restart green-btn" type="button">Пройти ещё раз</button>'
  
        const restartBtn = document.querySelector('.quiz-main__restart');
        restartBtn.onclick = restartQuiz;
      }
    }

  // Показать неважные элементы
  function showDecor() {
    stepCounts.hidden = false;
  }

  // Обнулить служебные переменные
  function resetVars() {
    result = {};
    step = 0;
  }

  // Начать заново
  function restartQuiz() {
    showDecor();
    resetVars();
    showQuestion(step);
  }
}


// Вызов всех настраивающих функций
function applyAll() {
  setCorrectSlider();
  setCorrectAccordeon();
  setCorrectAnchors()
  setCorrectEarthAnimation();
  setCorrectScroll();
  setCorrectDotsOnMobiles();
  setCorrectQuiz();
  setCorrectLogicQuiz();
}


document.addEventListener("DOMContentLoaded", () => {
  try {
    applyAll();
    
    window.addEventListener('resize', () => {
      setCorrectScroll();
      setCorrectDotsOnMobiles();
    });

  } catch(err) {
    console.error(err);
  }
});

// На прод - раскомментировать
// console.log = () => {};
// console.error = () => {};
// console.warn = () => {};