import supabaseClient from '../supabase.js';
import { lost_found } from '../render/post.js';
import AlertSystem from '../render/Alerts.js';

document.addEventListener('DOMContentLoaded', () => {

    /* ------------------------------------------------------
    COMMENT MODAL
    ------------------------------------------------------ */
    const commentModal = document.getElementById('commentModal');
    const commentSection = document.getElementById('commentSection');
    const openCommentBtns = document.querySelectorAll('[id^="openCommentBtn"]');
    const closeCommentBtn = document.getElementById('closeCommentBtn');
    const commentInput = document.getElementById('commentInput');
    const sendCommentBtn = document.getElementById('sendCommentBtn');

    const openCommentModal = () => {
        commentModal.classList.remove('hidden');
        commentSection.classList.add('comment-section-enter');
    };

    const closeCommentModal = () => {
        commentSection.classList.remove('comment-section-enter');
        commentSection.classList.add('comment-section-exit');

        setTimeout(() => {
            commentModal.classList.add('hidden');
            commentSection.classList.remove('comment-section-exit');
        }, 300);
    };

    openCommentBtns.forEach(btn => btn.addEventListener('click', openCommentModal));
    closeCommentBtn?.addEventListener('click', closeCommentModal);
    commentModal?.addEventListener('click', e => e.target === commentModal && closeCommentModal());

    const sendComment = () => {
        if (!commentInput.value.trim()) return;
        alert('In a real app, this would post your comment.');
        commentInput.value = '';
    };

    sendCommentBtn?.addEventListener('click', sendComment);
    commentInput?.addEventListener('keypress', e => e.key === 'Enter' && sendComment());

    // Comment events (like/reply)
    commentSection?.addEventListener('click', e => {
        // Like button
        const likeBtn = e.target.closest('.comment-like-btn');
        if (likeBtn) {
            const icon = likeBtn.querySelector('i');
            const countSpan = likeBtn.querySelector('span');
            let count = parseInt(countSpan.textContent);

            if (icon.classList.contains('fas')) {
                icon.classList.replace('fas', 'far');
                icon.classList.replace('text-red-400', 'text-gray-400');
                countSpan.textContent = Math.max(0, count - 1);
            } else {
                icon.classList.replace('far', 'fas');
                icon.classList.replace('text-gray-400', 'text-red-400');
                likeBtn.classList.add('like-comment-animation');
                setTimeout(() => likeBtn.classList.remove('like-comment-animation'), 400);
                countSpan.textContent = count + 1;
            }
        }

        // Reply button
        if (e.target.closest('.reply-btn')) {
            alert('In a real app, this would allow replying.');
        }
    });

    /* ------------------------------------------------------
    CREATE VIDEO MODAL
    ------------------------------------------------------ */
    const createModal = document.getElementById('createVideoModal');
    const openCreateBtn = document.getElementById('openCreateVideoBtn');
    const closeModalBtn = document.getElementById('closeCreateModalBtn');
    const cancelBtn = document.getElementById('cancelCreateBtn');
    const videoFileInput = document.getElementById('videoFile');
    const selectVideoBtn = document.getElementById('selectVideoBtn');
    const videoPreview = document.getElementById('videoPreview');
    const videoPreviewPlayer = document.getElementById('videoPreviewPlayer');
    const removeVideoBtn = document.getElementById('removeVideoBtn');
    const videoCaption = document.getElementById('videoCaption');
    const charCount = document.getElementById('charCount');
    const postVideoBtn = document.getElementById('postVideoBtn');
    const createVideoForm = document.getElementById('createVideoForm');

    const resetVideoModal = () => {
        videoFileInput.value = '';
        videoPreviewPlayer.src = '';
        videoPreview.classList.add('hidden');
        videoCaption.value = '';
        charCount.textContent = '0/150';
        postVideoBtn.disabled = true;
    };

    const openVideoModal = () => {
        createModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    };

    const closeVideoModal = () => {
        createModal.classList.add('hidden');
        document.body.style.overflow = '';
        resetVideoModal();
    };

    openCreateBtn?.addEventListener('click', openVideoModal);
    closeModalBtn?.addEventListener('click', closeVideoModal);
    cancelBtn?.addEventListener('click', closeVideoModal);
    createModal?.addEventListener('click', e => e.target === createModal && closeVideoModal());

    selectVideoBtn?.addEventListener('click', () => videoFileInput.click());

    videoFileInput?.addEventListener('change', e => {
        const file = e.target.files[0];
        if (!file) return;
        videoPreviewPlayer.src = URL.createObjectURL(file);
        videoPreview.classList.remove('hidden');
        postVideoBtn.disabled = false;
    });

    removeVideoBtn?.addEventListener('click', resetVideoModal);

    videoCaption?.addEventListener('input', () => {
        const len = videoCaption.value.length;
        charCount.textContent = `${len}/150`;
        postVideoBtn.disabled = !(len > 0 || videoFileInput.files.length > 0);
    });

    createVideoForm?.addEventListener('submit', e => {
        e.preventDefault();
        if (!videoCaption.value.trim() && !videoFileInput.files.length) return;

        console.log('Video ready to post:', {
            file: videoFileInput.files[0],
            caption: videoCaption.value.trim()
        });

        alert('Video posted successfully (mock)!');
        closeVideoModal();
    });

    /* ------------------------------------------------------
    VIDEO PLAY / PAUSE ON CLICK
    ------------------------------------------------------ */
    document.addEventListener('click', e => {
        if (e.target.closest('.action-icon') || e.target.closest('button')) return;

        const videoItem = e.target.closest('.video-barkadahub-item');
        if (!videoItem) return;

        const video = videoItem.querySelector('video');
        video.paused ? video.play() : video.pause();
    });

    /* ------------------------------------------------------
    AUTOPLAY VIDEOS IN VIEW
    ------------------------------------------------------ */
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const video = entry.target.querySelector('video');
            entry.isIntersecting ? video.play() : video.pause();
        });
    }, { threshold: 0.8 });

    document.querySelectorAll('.video-item').forEach(item => observer.observe(item));

    /* ------------------------------------------------------
    ELLIPSIS MENU (ATTACHED TO NEW POSTS)
    ------------------------------------------------------ */
    function initEllipsisButtons() {
        const ellipsisButtons = document.querySelectorAll('.ellipsis-btn');
        const ellipsisMenuModal = document.getElementById('ellipsisMenuModal');
        const app = document.getElementById('app');
        const closeBtn = document.getElementById('closeEllipsisMenu');
        const deletePostBtn = document.getElementById('deletePostBtn');
        const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');

        ellipsisButtons.forEach(btn => {
            if (!btn.dataset.bound) {
                btn.dataset.bound = "true";
                btn.addEventListener('click', () => {
                    ellipsisMenuModal.classList.remove('hidden');
                    app.classList.add('opacity-50');
                    document.body.classList.add('overflow-hidden');
                });
            }
        });

        closeBtn.onclick = hideEllipsisMenu;
        deletePostBtn.onclick = showDeleteConfirmation;
        cancelDeleteBtn.onclick = hideDeleteConfirmation;
    }

    function hideEllipsisMenu() {
        const ellipsisMenuModal = document.getElementById('ellipsisMenuModal');
        const app = document.getElementById('app');
        ellipsisMenuModal.classList.add('hidden');
        app.classList.remove('opacity-50');
        document.body.classList.remove('overflow-hidden');
    }

    function showDeleteConfirmation() {
        const modal = document.getElementById('deleteConfirmationModal');
        const card = modal.querySelector('.delete-card');

        modal.classList.remove('hidden');
        setTimeout(() => card.classList.add('scale-100'));
    }

    function hideDeleteConfirmation() {
        const modal = document.getElementById('deleteConfirmationModal');
        const card = modal.querySelector('.delete-card');

        card.classList.remove('scale-100');
        setTimeout(() => modal.classList.add('hidden'), 150);
    }

});
