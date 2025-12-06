// video.js - Video template functions
export function createVideoItem(videoData, userDisplayName = "User", username = "user") {
    const { id, video_url, caption, created_at, user_id } = videoData;
    
    // Use provided display name or fallback
    const displayName = userDisplayName || `User ${user_id?.substring(0, 8)}`;
    const userHandle = username || `user_${user_id?.substring(0, 8)}`;
    
    return `
        <div class="w-screen h-screen bg-black flex items-center justify-center">
            <video class="w-full h-full object-contain" loop autoplay muted controls>
                <source src="${video_url}" type="video/mp4">
                Your browser does not support the video tag.
            </video>
        </div>

        <!-- Video Overlay -->
        <div class="absolute inset-0 video-barkadahub-overlay"></div>

        <!-- Video Info -->
        <div class="absolute bottom-10 left-0 right-0 p-6 z-30">
            <div class="flex items-center gap-3 mb-4">
                <div class="w-12 h-12 rounded-full overflow-hidden border-2 border-white">
                    <img src="../images/image.png" alt="${displayName}" class="w-full h-full object-cover">
                </div>
                <div class="text-white">
                    <h3 class="font-bold text-lg">${displayName}</h3>
                    <p class="text-sm opacity-90">@${userHandle}</p>
                </div>
                <button class="ml-4 bg-none text-white border border-white px-4 py-1 rounded-full text-sm font-semibold hover:bg-white hover:text-black transition-all duration-200 follow-btn">
                    Follow
                </button>
            </div>
            <p class="text-white text-sm mb-2">${caption || 'No caption'}</p>
            <p class="text-gray-400 text-xs">${new Date(created_at).toLocaleDateString()}</p>
        </div>

        <!-- Sidebar Actions -->
        <div class="absolute right-4 bottom-32 z-30 flex flex-col items-center gap-6">
            <div class="action-button">
                <div class="action-icon like-btn">
                    <i class="fas fa-heart text-xl"></i>
                </div>
                <span class="action-count">0</span>
            </div>
            <div class="action-button">
                <div class="action-icon openCommentBtn">
                    <i class="fas fa-comment text-xl"></i>
                </div>
                <span class="action-count">0</span>
            </div>

            <div class="action-button">
                <div class="action-icon ellipsis-btn" data-video-id="${id}">
                    <i class="fas fa-ellipsis-h text-xl"></i>
                </div>
            </div>
        </div>
    `;
}

// Empty state template
export function createEmptyVideoState() {
    return `
        <div class="flex flex-col items-center justify-center h-screen text-white">
            <i class="fas fa-video-slash text-6xl mb-4 opacity-50"></i>
            <h3 class="text-xl font-bold mb-2">No Videos Yet</h3>
            <p class="text-gray-400 mb-6">Be the first to share a video!</p>
            <button id="emptyStateCreateBtn" 
                class="px-6 py-3 bg-primary hover:bg-secondary text-white rounded-xl font-medium transition-colors duration-200">
                <i class="fas fa-plus mr-2"></i>Upload First Video
            </button>
        </div>
    `;
}