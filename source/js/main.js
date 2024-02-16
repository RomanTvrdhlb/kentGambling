//-----vars---------------------------------------
const header = document.querySelector("header");
const overlay = document.querySelector("[data-overlay]");
const mobileMenu = document.querySelector(".h2o-mobile-menu");
const burgers = document.querySelectorAll(".h2o-burger");
const mainSlider = document.querySelector(".h2o-main-slider");
const accParrent = [...document.querySelectorAll("[data-accordion-init]")];
const htmlEl = document.documentElement;
const bodyEl = document.body;
const providersSlider = document.querySelector('.h2o-providers-slider');
const jackpotSlider = document.querySelector('.h2o-jackpot-slider');
const loyaltySlider = document.querySelector('.h2o-loyalty-slider');
const timers = document.querySelectorAll('.h2o-timer');
const gamesSlider = document.querySelector('.h2o-games-slider');
const tournSlider = document.querySelector('.h2o-tournament-slider');
const bonusSliders = document.querySelectorAll('.h2o-bonus-slider');
const bannerSlider = document.querySelector('.h2o-banner-slider');
let list1 = document.getElementById("h2o-list1");
let list2 = document.getElementById("h2o-list2");
let list3 = document.getElementById("h2o-list3");



const asideMenu = document.querySelector('.h2o-sidebar');
const asideMenuBtn = document.querySelector('.h2o-aside-button');
const searchForms = document.querySelectorAll('.h2o-search-form');

//------------------------------------------------

//----customFunction------------------------------
const toggleCustomClass = (item, customClass = "active") => {
  item.classList.toggle(customClass);
};

const toggleClassInArray = (arr, customClass = "active") => {
  arr.forEach((item) => {
    item.classList.toggle(customClass);
  });
};

const removeClassInArray = (arr, customClass = "active") => {
  arr.forEach((item) => {
    item.classList.remove(customClass);
  });
};

const addCustomClass = (item, customClass = "active") => {
  item.classList.add(customClass);
};

const removeCustomClass = (item, customClass = "active") => {
  item.classList.remove(customClass);
};

const disableScroll = () => {
  const fixBlocks = document?.querySelectorAll(".fixed-block");
  const pagePosition = window.scrollY;
  const paddingOffset = `${window.innerWidth - bodyEl.offsetWidth}px`;

  htmlEl.style.scrollBehavior = "none";
  fixBlocks.forEach((el) => {
    el.style.paddingRight = paddingOffset;
  });
  bodyEl.style.paddingRight = paddingOffset;
  bodyEl.classList.add("dis-scroll");
  bodyEl.dataset.position = pagePosition;
  bodyEl.style.top = `-${pagePosition}px`;
};

const enableScroll = () => {
  const fixBlocks = document?.querySelectorAll(".fixed-block");
  const body = document.body;
  const pagePosition = parseInt(bodyEl.dataset.position, 10);
  fixBlocks.forEach((el) => {
    el.style.paddingRight = "0px";
  });
  bodyEl.style.paddingRight = "0px";

  bodyEl.style.top = "auto";
  bodyEl.classList.remove("dis-scroll");
  window.scroll({
    top: pagePosition,
    left: 0,
  });
};

const elementHeight = (el, variableName) => {
  if(el) {
    function initListener(){
      const elementHeight = el.offsetHeight;
      document.querySelector(':root').style.setProperty(`--${variableName}`, `${elementHeight}px`);
    }
    window.addEventListener('DOMContentLoaded', initListener)
    window.addEventListener('resize', initListener)
  }
}
//------------------------------------------------

//----asideMenuHandler----------------------------
asideMenu && asideMenuBtn &&
  asideMenuBtn.addEventListener("click", function (e) {
    e.preventDefault();
    addCustomClass(asideMenu, 'active');
  });

//----asideMenuClose-----------------------------
asideMenu && asideMenuBtn &&
  document.addEventListener("click", function (event) {
    if (!asideMenu.contains(event.target) && !asideMenuBtn.contains(event.target)) {
      removeCustomClass(asideMenu, 'active');
    }
  });
 
//----accordion----------------------------------
window.addEventListener("DOMContentLoaded", () => {
  accParrent &&
    accParrent.map(function (accordionParrent) {
      if (accordionParrent) {
        let multipleSetting = false;
        let breakpoinSetting = false;
        let defaultOpenSetting;

        if (
          accordionParrent.dataset.single &&
          accordionParrent.dataset.breakpoint
        ) {
          multipleSetting = accordionParrent.dataset.single; // true - включает сингл аккордион
          breakpoinSetting = accordionParrent.dataset.breakpoint; // брейкпоинт сингл режима (если он true)
        }

        const getAccordions = function (dataName = "[data-id]") {
          return accordionParrent.querySelectorAll(dataName);
        };

        const accordions = getAccordions();
        let openedAccordion = null;

        const closeAccordion = function (accordion, className = "active") {
          accordion.style.maxHeight = 0;
          removeCustomClass(accordion, className);
        };

        const openAccordion = function (accordion, className = "active") {
          accordion.style.maxHeight = accordion.scrollHeight + "px";
          addCustomClass(accordion, className);
        };

        const toggleAccordionButton = function (button, className = "active") {
          toggleCustomClass(button, className);
        };

        const checkIsAccordionOpen = function (accordion) {
          return accordion.classList.contains("active");
        };

        const accordionClickHandler = function (e) {
          e.preventDefault();
          let curentDataNumber = this.dataset.id;

          toggleAccordionButton(this);
          const accordionContent = accordionParrent.querySelector(
            `[data-content="${curentDataNumber}"]`
          );
          const isAccordionOpen = checkIsAccordionOpen(accordionContent);

          if (isAccordionOpen) {
            closeAccordion(accordionContent);
            openedAccordion = null;
          } else {
            if (openedAccordion != null) {
              const mobileSettings = () => {
                let containerWidth = document.documentElement.clientWidth;
                if (
                  containerWidth <= breakpoinSetting &&
                  multipleSetting === "true"
                ) {
                  closeAccordion(openedAccordion);
                  toggleAccordionButton(
                    accordionParrent.querySelector(
                      `[data-id="${openedAccordion.dataset.content}"]`
                    )
                  );
                }
              };

              window.addEventListener("resize", () => {
                mobileSettings();
              });
              mobileSettings();
            }

            openAccordion(accordionContent);
            openedAccordion = accordionContent;
          }
        };

        const activateAccordion = function (accordions, handler) {
          for (const accordion of accordions) {
            accordion.addEventListener("click", handler);
          }
        };
        const accordionDefaultOpen = (currentId) => {
          const defaultOpenContent = accordionParrent.querySelector(
            `[data-content="${currentId}"]`
          );
          const defaultOpenButton = accordionParrent.querySelector(
            `[data-id="${currentId}"]`
          );
          openedAccordion = defaultOpenContent;

          toggleAccordionButton(defaultOpenButton);
          openAccordion(defaultOpenContent);
        };

        if (accordionParrent.dataset.default) {
          defaultOpenSetting = accordionParrent.dataset.default; // получает id аккордиона который будет открыт по умолчанию
          accordionDefaultOpen(defaultOpenSetting);
        }

        activateAccordion(accordions, accordionClickHandler);
      }
    });
});

//----burger------------------------------------
const mobileMenuHandler = function (overlay, mobileMenu, burgers) {
  burgers.forEach((burger) => {
    burger.addEventListener("click", function (e) {
      e.preventDefault();
      toggleCustomClass(header, "active");
      toggleCustomClass(mobileMenu);
      toggleClassInArray(burgers);
      toggleCustomClass(overlay);
      burger.classList.contains("active") ? disableScroll() : enableScroll();
    });
  });
};

const hideMenuHandler = function (overlay, mobileMenu, burgers) {
  removeCustomClass(mobileMenu);
  removeClassInArray(burgers);
  removeCustomClass(header, "active");
  removeCustomClass(overlay);
  enableScroll();
};

if (overlay) {
  mobileMenuHandler(overlay, mobileMenu, burgers);
  overlay.addEventListener("click", function (e) {
    e.target.classList.contains("overlay")
      ? hideMenuHandler(overlay, mobileMenu, burgers)
      : null;
  });
}

//----sliders------------------------------------

providersSlider &&
  new Splide(providersSlider, {
    type: "slide",
    perPage: 7,
    gap: 15,
    pagination:false,
    arrows: false,
    mediaQuery: 'max',
      breakpoints: {
        1440: {
          perPage: '6',
        },
        1240: {
          perPage: '5',
        },
        1024: {
          perPage: '4',
        },
        768: {
          fixedWidth: '165px',
        }
      }
  }).mount();


  bonusSliders.forEach(function(bonuSlider, index){
    bonuSlider &&
    new Splide(bonuSlider, {
      type: "loop",
      perPage: 1,
      gap: 10,
      pagination:false,
      mediaQuery: 'max',
      autoplay: true,
      speed: 1400,
      interval: index === 1 ? 4800 : 3500,
      breakpoints: {
      768: {
        pagination: true,
        arrows: false,
        gap:16,
      },
    }
    }).mount();
  })


  tournSlider &&
  new Splide(tournSlider, {
    type: "slide",
    perPage: 1,
    gap: 15,
    autoplay: true,
    interval: 3000,
    pagination:false,
  }).mount();

  jackpotSlider && new Splide( jackpotSlider, {
    type   : 'slide',
    perPage: 5,
    speed: 1500,
    gap: 20,
    pagination:false,
    mediaQuery: 'max',
    breakpoints: {
      1320: {
        perPage: 4,
       
      },
      1024: {
        fixedWidth: '185px',
        arrows: false,
        pagination:true,
      },
      576: {
        perPage: 2,
      }
    }

  } ).mount();

  loyaltySlider && new Splide( loyaltySlider, {
    type   : 'slide',
    perPage: 5,
    speed: 1500,
    gap: 20,
    pagination:false,
    mediaQuery: 'max',
    breakpoints: {
      1024: {
        perPage: 4,
       
      },
      768: {
        perPage: 3,
        arrows: false,
      },
      576: {
        perPage: 2,
        fixedWidth: '180px'
      }
    }

  } ).mount(); 

  gamesSlider && new Splide( gamesSlider, {
    type   : 'slide',
    perPage: 5,
    speed: 1500,
    gap: 20,
    pagination:false,
    grid: {
      rows: 2,
      cols: 5,
    },


  } ).mount(); 

  bannerSlider && new Splide( bannerSlider, {
    type   : 'slide',
    perPage: 3,
    speed:1200,
    mediaQuery: 'min',
    breakpoints: {
      280: {
        autoWidth: true,
        perPage: 1,
        arrows:false,
      },
      768:{
        arrows:true,
      },
      1024: {
        pagination:false,
        arrows:false,
        drag:false,
        perPage: 2,
        gap:0,
      },
    }
  } ).mount();
  

//----stickyHeader------------------------------
let lastScroll = 0;
const defaultOffset = 40;

function stickyHeaderFunction(breakpoint){
  let containerWidth = document.documentElement.clientWidth;
  if (containerWidth > `${breakpoint}`) {
    const scrollPosition = () => window.pageYOffset || document.documentElement.scrollTop;
    const containHide = () => header.classList.contains('sticky');

    window.addEventListener('scroll', () => {
        if(scrollPosition() > lastScroll && !containHide() && scrollPosition() > defaultOffset) {
            addCustomClass(header, "sticky")
        }
        else if(scrollPosition() < defaultOffset){
            removeCustomClass(header, "sticky")
        }

        lastScroll = scrollPosition();
    })
  }
}

stickyHeaderFunction(320);
elementHeight(header, "header-height");

//------search----------------------------------
// searchForms && searchForms.forEach(function(form){
//   const input = form.querySelector('input');
//   const value = input.value;
//   const clearBtn = form.querySelector('.h2o-search-form__clear');


//   clearBtn.addEventListener('click', function (e) {
//     e.preventDefault();
//     input.value = '';
//     removeCustomClass(clearBtn, 'active');
//   });

//   input.addEventListener('blur', function () {
//     removeCustomClass(clearBtn, 'active');
//   });

//   input.addEventListener('input', function () {
//     updateButtonClass();
//   });

//   function updateButtonClass() {  
//     if (value.trim() !== '') {
//       removeCustomClass(clearBtn, 'active')
//     } else {
//       addCustomClass(clearBtn, 'active');
//     }
//   }
// })

//------timer-----------------------------------


timers && timers.forEach(function(item){  
  const itemDate = item.getAttribute('data-time');
  const countDownDate = new Date(itemDate).getTime();
  
  const x = setInterval(function() {
    
    const now = new Date().getTime();
    const distance = countDownDate - now;
  
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    
    if(!item.classList.contains('stop')){
      item.querySelector('.h2o-timer__days').innerText = formatedValue(days,10);
      item.querySelector('.h2o-timer__hours').innerText = formatedValue(hours,10);
      item.querySelector('.h2o-timer__minutes').innerText = formatedValue(minutes, 10);
      item.querySelector('.h2o-timer__seconds').innerText = formatedValue(seconds, 10);
  }
  }, 1000);
})

function formatedValue(value, countValue) {
  return value < countValue ? '0' + value : '' + value
}

//----replaceNav---------------------------------
function splitList(sourceList) {
  const halfLength = Math.floor(sourceList.children.length / 2);
  const firstHalf = Array.from(sourceList.children).slice(0, halfLength);
  const secondHalf = Array.from(sourceList.children).slice(halfLength);
  return { firstHalf, secondHalf };
}

function moveItems(sourceList, targetList, items) {
  items.forEach(function (item) {
    targetList.appendChild(item);
  });
}

const originalItems = Array.from(list3.children);

function checkWindowWidth() {
  const windowWidth = window.innerWidth;

  if (windowWidth <= 576) {
    const { firstHalf, secondHalf } = splitList(list3);
    moveItems(list3, list1, firstHalf);
    moveItems(list3, list2, secondHalf);
  } else {
    moveItems(list1, list3, originalItems.filter(item => list1.contains(item)));
    moveItems(list2, list3, originalItems.filter(item => list2.contains(item)));
  }
}

checkWindowWidth();
window.addEventListener("resize", checkWindowWidth);