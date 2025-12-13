import supabaseClient from '../supabase.js';
import AlertSystem from '../render/Alerts.js';

const alertSystem = new AlertSystem();
let userJoinedClub = null;

// -----------------------------
// Update member count for a card
// -----------------------------
async function updateMemberCount(club, card) {
    const span = card.querySelector('.member-count');
    if (!span) return;

    try {
        const { count, error } = await supabaseClient
            .from('club_members')
            .select('*', { count: 'exact', head: true })
            .eq('club_id', club.id);

        if (error) throw error;
        span.textContent = `${count} member${count !== 1 ? 's' : ''}`;
    } catch (err) {
        console.error(`Error fetching members for club ${club.id}:`, err);
        span.textContent = 'Error';
    }
}

// -----------------------------
// Render a single club card (for clubs list page)
// -----------------------------
function renderClubCard(club) {
    const card = document.createElement('div');
    card.className = "bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1";

    card.innerHTML = `
        <div class="relative h-40 sm:h-44 overflow-hidden">
            <img src="${club.club_image || 'https://via.placeholder.com/400'}" 
                 alt="${club.club_name}" class="w-full h-full object-cover opacity-90">
        </div>
        <div class="p-4 sm:p-5">
            <h3 class="font-bold text-lg text-gray-900 mb-1">${club.club_name}</h3>
            <div class="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <i class="fas fa-map-marker-alt text-xs"></i>
                <span>${club.location || 'No location set'}</span>
            </div>
            <p class="text-gray-600 text-sm mb-2 line-clamp-2">${club.description || ''}</p>
            <div class="text-sm text-gray-500 mb-2 flex items-center gap-1">
                <i class="fas fa-users"></i> <span class="member-count">Loading members...</span>
            </div>
        </div>
    `;

    // Category badge
    const categoryBadge = document.createElement('span');
    categoryBadge.className = "absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-semibold px-3 py-1 rounded-full text-gray-800";
    const icons = { tech: 'code', sports: 'basketball-ball', arts: 'paint-brush', academic: 'graduation-cap', general: 'star' };
    categoryBadge.innerHTML = `<i class="fas fa-${icons[club.category] || 'star'} mr-1"></i>${club.category || 'General'}`;
    card.querySelector('.relative').appendChild(categoryBadge);

    // Join button
    const button = document.createElement('button');
    const alreadyJoinedThis = userJoinedClub?.club_id === club.id;
    button.className = `join-btn w-full ${alreadyJoinedThis ? 'bg-success hover:bg-green-700' : 'bg-primary hover:bg-secondary'} text-white py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow`;
    button.innerHTML = `<i class="fas ${alreadyJoinedThis ? 'fa-check' : 'fa-user-plus'}"></i><span>${alreadyJoinedThis ? 'Joined' : 'Join Club'}</span>`;
    card.appendChild(button);

    button.addEventListener('click', async () => {
        try {
            const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
            if (userError || !user) throw new Error("Not authenticated");

            if (alreadyJoinedThis) return window.location.href = `joinedClub.html?clubId=${club.id}`;
            if (userJoinedClub) return alertSystem.show("You can only join one club. Leave your current club first.", "warning");

            const { error: joinError } = await supabaseClient
                .from('club_members')
                .insert({ club_id: club.id, user_id: user.id });

            if (joinError) throw joinError;

            alertSystem.show("Successfully joined the club!", "success");
            userJoinedClub = { club_id: club.id };

            await updateMemberCount(club, card);

            button.className = 'join-btn w-full bg-success hover:bg-green-700 text-white py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow';
            button.innerHTML = `<i class="fas fa-check"></i><span>Joined</span>`;

            setTimeout(() => window.location.href = `joinedClub.html?clubId=${club.id}`, 800);
        } catch (err) {
            console.error('Error joining club:', err);
            alertSystem.show(err.message || "Failed to join club", 'error');
        }
    });

    updateMemberCount(club, card);

    return card;
}

// -----------------------------
// Render club list
// -----------------------------
function renderClubs(clubs) {
    const grid = document.getElementById('clubsGrid');
    if (!grid) return;
    grid.innerHTML = '';

    if (!clubs?.length) {
        grid.innerHTML = `<p class="text-gray-500">No clubs found.</p>`;
        return;
    }

    clubs.forEach(club => grid.appendChild(renderClubCard(club)));
}

// -----------------------------
// Render single club info (for joinedClub.html)
// -----------------------------
function renderClubInfo(club) {
    const clubNameEl = document.querySelector('.club-header h1');
    if (clubNameEl) clubNameEl.textContent = club.club_name;

    const clubDescEl = document.querySelector('.club-header p');
    if (clubDescEl) clubDescEl.textContent = club.description || '';

    const membersBadge = document.querySelector('.members-badge');
    if (membersBadge) {
        membersBadge.innerHTML = `<i class="fas fa-users mr-2"></i>${club.members_count || 1} Memb`;
    }

    const categoryBadge = document.querySelector('.category-badge');
    if (categoryBadge) {
        const icons = { tech: 'fa-code', sports: 'fa-basketball-ball', arts: 'fa-paint-brush', academic: 'fa-graduation-cap', general: 'fa-star' };
        categoryBadge.innerHTML = `<i class="fas ${icons[club.category] || 'fa-star'} mr-2"></i>${club.category || 'General'}`;
    }

    const clubHeader = document.querySelector('.club-header');
    if (clubHeader) {
        const imageUrl = club.club_image || 'https://via.placeholder.com/1600x400';
        clubHeader.style.background = `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('${imageUrl}')`;
        clubHeader.style.backgroundSize = 'cover';
        clubHeader.style.backgroundPosition = 'center';
    }
}

// -----------------------------
// Load single club info
// -----------------------------
async function loadClub(clubId) {
    try {
        const { data: club, error } = await supabaseClient
            .from('clubs')
            .select('*')
            .eq('id', clubId)
            .single();

        if (error) throw error;
        if (!club) return alertSystem.show('Club not found', 'error');

        renderClubInfo(club);
    } catch (err) {
        console.error(err);
        alertSystem.show(err.message || 'Failed to load club', 'error');
    }
}

// -----------------------------
// Load clubs list
// -----------------------------
async function loadClubs() {
    const grid = document.getElementById('clubsGrid');
    if (!grid) return;
    grid.innerHTML = "Loading clubs...";

    try {
        const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
        if (userError || !user) throw new Error("Not authenticated");

        const { data: joinedData } = await supabaseClient
            .from('club_members')
            .select('club_id')
            .eq('user_id', user.id)
            .maybeSingle();

        userJoinedClub = joinedData || null;

        if (userJoinedClub && grid) {
            // Redirect if on clubs list page
            return window.location.href = `joinedClub.html?clubId=${userJoinedClub.club_id}`;
        }

        const { data: clubs, error } = await supabaseClient
            .from('clubs')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        renderClubs(clubs);
    } catch (err) {
        console.error('Error loading clubs:', err);
        if (grid) grid.innerHTML = `<p class="text-red-500">Failed to load clubs: ${err.message}</p>`;
        alertSystem.show(err.message || 'Failed to fetch clubs', 'error');
    }
}

// -----------------------------
// DOM Ready
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {
    // Detect page type
    const clubsGrid = document.getElementById('clubsGrid');
    const clubHeader = document.querySelector('.club-header');

    if (clubsGrid) {
        loadClubs();

        const createClubForm = document.getElementById("createClubForm");
        const inputClubPicture = document.getElementById("clubPicture");

        createClubForm?.addEventListener("submit", async (e) => {
            e.preventDefault();
            const clubName = document.getElementById("clubName").value.trim();
            const description = document.getElementById("description").value.trim();
            const location = document.getElementById("location").value.trim();
            const imageFile = inputClubPicture.files[0];
            const categoryInput = document.querySelector('input[name="category"]:checked');
            const category = categoryInput ? categoryInput.value : 'general';

            try {
                const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
                if (userError || !user) throw new Error("Not authenticated");

                let imageUrl = null;
                if (imageFile) {
                    const filePath = `clubs/${user.id}-${Date.now()}-${imageFile.name}`;
                    const { error: uploadError } = await supabaseClient.storage
                        .from("club")
                        .upload(filePath, imageFile, { contentType: imageFile.type });
                    if (uploadError) throw uploadError;

                    const { data } = supabaseClient.storage.from("club").getPublicUrl(filePath);
                    imageUrl = data.publicUrl;
                }

                const { error } = await supabaseClient
                    .from("clubs")
                    .insert({ club_name: clubName, description, location, club_image: imageUrl, owner_id: user.id, category });
                if (error) throw error;

                alertSystem.show("Club created successfully!", 'success');
                createClubForm.reset();
                loadClubs();

            } catch (err) {
                console.error('Error creating club:', err);
                alertSystem.show(err.message || "Failed to create club", 'error');
            }
        });
    }

    if (clubHeader) {
        const params = new URLSearchParams(window.location.search);
        const clubId = params.get('clubId');
        if (!clubId) return alertSystem.show('No club ID provided', 'error');
        loadClub(clubId);
    }
});
