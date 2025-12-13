import supabaseClient from '../supabase.js';
import { lost_found } from '../render/post.js';
import AlertSystem from '../render/Alerts.js';

const alertSystem = new AlertSystem();

// Get club ID from URL parameter
function getClubIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('clubId') || params.get('id');
}

// Load club data from database
async function loadClubData() {
    try {
        const clubId = getClubIdFromURL();
        if (!clubId) {
            console.error('No club ID provided in URL');
            return;
        }

        const { data: club, error } = await supabaseClient
            .from('clubs')
            .select('*')
            .eq('id', clubId)
            .single();

        if (error) throw error;
        if (!club) {
            alertSystem.show('Club not found', 'error');
            return;
        }

        // Update club header
        updateClubHeader(club);
        
        // Update club info tab
        updateClubInfo(club);

    } catch (error) {
        console.error('Error loading club data:', error);
        alertSystem.show('Failed to load club information', 'error');
    }
}

// Update club header with database info
function updateClubHeader(club) {
    const clubNameElement = document.querySelector('.bg-linear-to-r h2');
    const clubDescElement = document.querySelector('.bg-linear-to-r p');
    const pageTitle = document.querySelector('title');

    if (clubNameElement) clubNameElement.textContent = club.name || 'Club';
    if (clubDescElement) clubDescElement.textContent = club.tagline || 'Club information';
    if (pageTitle) pageTitle.textContent = `${club.name} - BarkadaHub`;

    // Update background image if available
    const clubHeader = document.querySelector('.club-header');
    if (clubHeader && club.cover_image) {
        clubHeader.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('${club.cover_image}')`;
    }
}

// Update club info tab with database info
function updateClubInfo(club) {
    const aboutSection = document.querySelector('[data-section="about"]') || 
                         document.querySelectorAll('.modal-tab-content')[0]?.querySelector('p');
    
    if (aboutSection) {
        aboutSection.textContent = club.description || 'No description available';
    }

    // Update member count if available
    const memberCountElement = document.querySelector('[data-members-count]');
    if (memberCountElement && club.member_count) {
        memberCountElement.textContent = `${club.member_count} members`;
    }

    // Update club category/type if available
    const categoryElement = document.querySelector('[data-club-category]');
    if (categoryElement && club.category) {
        categoryElement.textContent = club.category;
    }
}

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
