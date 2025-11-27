import HeaderComponent from "./components/header.js";
import mobileNavigations from "./components/mobileNav.js";

document.addEventListener('DOMContentLoaded', function () {

    const headerElement = document.getElementById('header');
    const mobileNav = document.getElementById('mobileNav');

    if (headerElement || mobileNav) {
        headerElement.innerHTML = HeaderComponent();
        mobileNav.innerHTML = mobileNavigations();
    }


    const app = document.getElementById('app');
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const likeButtons = document.querySelectorAll('.like-btn');
    const pageSections = document.querySelectorAll('.page-section');
    const navLinks = document.querySelectorAll('.nav-link, .sidebar-link, .mobile-nav-item, .logo, .user-profile, .club-card, .friend-card, .view-all');
    const joinButtons = document.querySelectorAll('.join-btn');
    const backToClubs = document.querySelector('.back-to-clubs');

});


