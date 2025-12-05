import supabaseClient from '../supabase.js';
import { lost_found } from '../render/post.js';
import AlertSystem from '../render/Alerts.js';


/* -------------------------------------------
    MODAL / TAB / CHAR COUNTER HANDLER
------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {

    /* -------------------------------------------
        DOM ELEMENTS
    ------------------------------------------- */
    const clubModal = document.getElementById('clubModal');
    const postContent = document.getElementById('postContent');
    const charCount = document.getElementById('charCount');


    /* -------------------------------------------
        OPEN MODAL
    ------------------------------------------- */
    window.openClubModal = function () {
        clubModal.classList.remove('hidden');
        clubModal.classList.add('flex');
        document.body.style.overflow = 'hidden'; // Disable scrolling
    };


    /* -------------------------------------------
        CLOSE MODAL
    ------------------------------------------- */
    window.closeClubModal = function () {
        clubModal.classList.remove('flex');
        clubModal.classList.add('hidden');
        document.body.style.overflow = 'auto'; // Restore scrolling
    };


    /* -------------------------------------------
        SWITCH MODAL TABS
    ------------------------------------------- */
    window.switchModalTab = function (tabName) {

        // Hide all tab content
        document.querySelectorAll('.modal-tab-content')
            .forEach(tab => tab.classList.add('hidden'));

        // Reset all tabs
        document.querySelectorAll('.modal-tab').forEach(tab => {
            tab.classList.remove('tab-active', 'border-white', 'text-white');
            tab.classList.add('border-transparent', 'text-blue-100');
        });

        // Show selected tab's content
        document.getElementById(`${tabName}Tab`).classList.remove('hidden');

        // Activate clicked tab button
        const activeTab = document.querySelector(`[onclick="switchModalTab('${tabName}')"]`);
        activeTab.classList.add('tab-active', 'border-white', 'text-white');
        activeTab.classList.remove('border-transparent', 'text-blue-100');
    };


    /* -------------------------------------------
        CLOSE MODAL WHEN CLICKING OUTSIDE
    ------------------------------------------- */
    clubModal.addEventListener('click', e => {
        if (e.target === clubModal) closeClubModal();
    });


    /* -------------------------------------------
        CLOSE MODAL WITH ESC KEY
    ------------------------------------------- */
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeClubModal();
    });


    /* -------------------------------------------
        CHARACTER COUNTER FOR TEXTAREA
    ------------------------------------------- */
    if (postContent && charCount) {
        postContent.addEventListener('input', () => {
            const length = postContent.value.length;

            charCount.textContent = length;
            charCount.classList.toggle('text-red-500', length >= 450);
        });
    }

});
