export default function mobileNavigations() {
    return `
    <div class="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg flex justify-around py-2 z-30">
        <a href="./home.html" class="mobile-nav-item active flex flex-col items-center text-primary"
            data-page="home">
            <i class="fas fa-home text-xl mb-1"></i>
            <span class="text-xs">Home</span>
        </a>
        <a href="./clubs.html" class="mobile-nav-item flex flex-col items-center text-gray-500"
            data-page="clubs">
            <i class="fas fa-users text-xl mb-1"></i>
            <span class="text-xs">Clubs</span>
        </a>
        <a href="./lost-found.html" class="mobile-nav-item flex flex-col items-center text-gray-500"
            data-page="lost-found">
            <i class="fas fa-search text-xl mb-1"></i>
            <span class="text-xs">Lost & Found</span>
        </a>
        <a href="./messages.html" class="mobile-nav-item flex flex-col items-center text-gray-500"
            data-page="messages">
            <i class="fas fa-comment-dots text-xl mb-1"></i>
            <span class="text-xs">Messages</span>
        </a>
        <a href="./profile.html" class="mobile-nav-item flex flex-col items-center text-gray-500"
            data-page="profile">
            <i class="fas fa-user text-xl mb-1"></i>
            <span class="text-xs">Profile</span>
        </a>
    </div>
    `;
};