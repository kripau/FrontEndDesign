/**
 *
 * Manipulating the DOM exercise.
 * Exercise programmatically builds navigation,
 * scrolls to anchors from navigation,
 * and highlights section in viewport upon scrolling.
 *
 * Dependencies: None
 *
 * JS Version: ES2015/ES6
 *
 * JS Standard: ESlint
 *
 */

/**
 * Define Global Variables
 *
 */
const sectionList = document.querySelectorAll("section");

/**
 * End Global Variables
 * Start Helper Functions
 *
 */

// creating nav anchor element
function createNavElement(sec) {
  let anchor = document.createElement("a");
  anchor.className = "menu__link";
  anchor.dataset.id = sec.getAttribute("id");
  anchor.innerText = sec.getAttribute("data-nav");
  return anchor;
}

// activate section
function activateSection(id) {
  for (let i = 0; i < sectionList.length; i++) {
    if (sectionList[i].id === id) {
      sectionList[i].classList.add("your-active-class");
    } else {
      sectionList[i].classList.remove("your-active-class");
    }
  }
}

//activate nav
function activateNav(id) {
  const navItems = document.getElementsByClassName("menu__link");
  for (let i = 0; i < navItems.length; i++) {
    if (navItems[i].dataset.id === id) {
      navItems[i].classList.add("nav-active-class");
    } else {
      navItems[i].classList.remove("nav-active-class");
    }
  }
}

/**
 * End Helper Functions
 * Begin Main Functions
 *
 */

// build the nav

function addNavItem() {
  let fragment = document.createDocumentFragment();
  for (let i = 0; i < sectionList.length; i++) {
    let navLi = document.createElement("li");
    const anchorElement = createNavElement(sectionList[i]);
    navLi.appendChild(anchorElement);
    fragment.appendChild(navLi);
  }
  let ulElement = document.getElementById("navbar__list");
  ulElement.appendChild(fragment);
}

/**
 * End Main Functions
 * Begin Events
 *
 */

// nav  click eventhandler
function enableScroll() {
  const navItems = document.getElementsByClassName("menu__link");
  for (let i = 0; i < navItems.length; i++) {
    navItems[i].addEventListener("click", function (event) {
      const sectionID = event.target.getAttribute("data-id");
      const section = document.getElementById(sectionID);
      activateNav(sectionID);
      section.scrollIntoView({ behavior: "smooth" });
      activateSection(sectionID);
    });
  }
}

// mouse enter evenhandler
// highlight Nav and Section area
function highlightSectionNav() {
  for (let i = 0; i < sectionList.length; i++) {
    let functionHandler = function (i) {
      return function () {
        id = sectionList[i].getAttribute("id");
        activateSection(id);
        activateNav(id);
      };
    };
    sectionList[i].addEventListener("mouseenter", functionHandler(i));
  }
}

// Build menu (done)

// Scroll to section on link click (done)

// Set sections as active (done)

// create button which when clicked scrolls to the top of the page

function buttonElement() {
  let divPosition = document.getElementsByClassName("landing__container");
  for (let i = 0; i < divPosition.length; i++) {
    let button = document.createElement("BUTTON");
    const buttonText = document.createTextNode("TOP");
    button.appendChild(buttonText);
    divPosition[i].appendChild(button);
    button.addEventListener("click", function () {
      window.scroll({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    });
  }
}

// Call all the required function
function main() {
  addNavItem();
  enableScroll();
  highlightSectionNav();
  buttonElement();
}

main();
