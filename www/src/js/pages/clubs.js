import supabaseClient from '../supabase.js';
import { lost_found } from '../render/post.js';
import AlertSystem from '../render/Alerts.js';


/* -------------------------------------------
    CHECK USER LOGIN
------------------------------------------- */
document.addEventListener('DOMContentLoaded', async () => {
    const alertSystem = new AlertSystem();

    try {
        const { data, error } = await supabaseClient.auth.getUser();
        if (error || !data?.user) {
            alertSystem.show("You must be logged in.", 'error');
            setTimeout(() => window.location.href = '../../index.html', 1500);
            return;
        }
    } catch (err) {
        console.error("Error fetching user:", err);
        alertSystem.show("An error occurred. Please try again.", 'error');
        return;
    }


    /* -------------------------------------------
    MODAL ELEMENTS
    ------------------------------------------- */
    const modal = document.getElementById('createClubModal');
    const openBtn = document.getElementById('openCreateClubBtn');
    const closeBtn = document.getElementById('closeModalBtn');
    const cancelBtn = document.getElementById('cancelBtn');


    /* -------------------------------------------
    MODAL FUNCTIONS
    ------------------------------------------- */
    const openModal = () => {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    };

    const closeModal = () => {
        modal.classList.add('hidden');
        document.body.style.overflow = ''; // Restore scrolling
    };


    /* -------------------------------------------
    MODAL EVENT LISTENERS
    ------------------------------------------- */
    openBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    // Close modal when clicking outside content
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
});
