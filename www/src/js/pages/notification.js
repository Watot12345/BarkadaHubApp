import supabaseClient from '../supabase.js';
import { lost_found } from '../render/post.js';
import AlertSystem from '../render/Alerts.js';

document.addEventListener('DOMContentLoaded', () => {
    const markAllReadBtn = document.getElementById('markAllRead');
    const notificationItems = document.querySelectorAll('.notification-item');
    const unreadDots = document.querySelectorAll('.unread-dot');
    const filterButtons = document.querySelectorAll('.notification-filter');

    /* -------------------------------------------
    MARK ALL AS READ
    ------------------------------------------- */
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', () => {
            notificationItems.forEach(item => item.classList.remove('unread'));

            unreadDots.forEach(dot => dot.remove());

            // Update button UI
            markAllReadBtn.innerHTML = `<i class="fas fa-check"></i> All marked as read`;
            markAllReadBtn.disabled = true;
            markAllReadBtn.classList.remove('bg-blue-600', 'hover:bg-blue-700');
            markAllReadBtn.classList.add('bg-gray-400');
        });
    }

    /* -------------------------------------------
    FILTER BUTTONS (All, Unread, Friend Requests)
    ------------------------------------------- */
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Reset all
            filterButtons.forEach(btn => {
                btn.classList.remove('active', 'border-blue-600', 'text-blue-600');
                btn.classList.add('text-gray-500');
            });

            // Set active
            button.classList.add('active', 'border-blue-600', 'text-blue-600');
            button.classList.remove('text-gray-500');

            // Filtering logic placeholder (you can add later)
            notificationItems.forEach(item => item.style.display = 'block');
        });
    });

    /* -------------------------------------------
    FRIEND REQUEST: CONFIRM
    ------------------------------------------- */
    document.querySelectorAll('.confirm-friend').forEach(button => {
        button.addEventListener('click', () => {
            const notification = button.closest('.notification-item');
            if (!notification) return;

            notification.style.opacity = '0.6';
            button.textContent = 'Confirmed';
            button.disabled = true;

            button.classList.remove('bg-blue-600', 'hover:bg-blue-700');
            button.classList.add('bg-gray-400');
        });
    });

    /* -------------------------------------------
    FRIEND REQUEST: DELETE
    ------------------------------------------- */
    document.querySelectorAll('.delete-friend').forEach(button => {
        button.addEventListener('click', () => {
            const notification = button.closest('.notification-item');
            if (notification) {
                notification.style.display = 'none';
            }
        });
    });
});
