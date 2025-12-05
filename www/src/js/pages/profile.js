import supabaseClient from '../supabase.js';
import { lost_found } from '../render/post.js';
import AlertSystem from '../render/Alerts.js';

document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    const logoutBtn = document.getElementById('logoutBtn');
    const logoutModal = document.getElementById('logoutModal');
    const cancelLogout = document.getElementById('cancelLogout');
    const confirmLogout = document.getElementById('confirmLogout');

    /* -------------------------------------------
        LOGOUT MODAL CONTROL
    ------------------------------------------- */

    const openModal = () => {
        logoutModal.classList.remove('hidden');
        app.classList.add('opacity-50');
    };

    const closeModal = () => {
        logoutModal.classList.add('hidden');
        app.classList.remove('opacity-50');
    };

    logoutBtn.addEventListener('click', openModal);
    cancelLogout.addEventListener('click', closeModal);

    logoutModal.addEventListener('click', e => {
        if (e.target === logoutModal) closeModal();
    });

    /* -------------------------------------------
        LOGOUT HANDLING
    ------------------------------------------- */

    confirmLogout.addEventListener('click', async () => {
        confirmLogout.innerHTML = `
            <i class="fas fa-spinner fa-spin mr-2"></i> Logging out...
        `;
        confirmLogout.disabled = true;

        try {
            const { error } = await supabaseClient.auth.signOut();
            if (error) throw error;

            setTimeout(() => {
                window.location.href = '../../index.html';
            }, 1000);

        } catch (err) {
            console.error(err);
            alert('Logout failed: ' + err.message);

            // reset button
            confirmLogout.innerHTML = 'Yes, Logout';
            confirmLogout.disabled = false;

            closeModal();
        }
    });

    /* -------------------------------------------
        LOAD USER NAME
    ------------------------------------------- */

    async function loadUserName() {
        const { data, error } = await supabaseClient.auth.getUser();
        if (error || !data?.user) {
            console.log("User not logged in");
            return;
        }

        const name = data.user.user_metadata?.display_name || "User";

        const elements = {
            username: document.getElementById("username"),
            name: document.getElementById("name"),
            namepost: document.getElementById("Name_post")
        };

        if (elements.username) elements.username.textContent = name;
        if (elements.name) elements.name.textContent = name;
        if (elements.namepost) elements.namepost.textContent = `${name}'s Posts`;
    }

    loadUserName();
});
