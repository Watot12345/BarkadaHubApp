import supabaseClient from '../supabase.js';
import { lost_found } from '../render/post.js';
import AlertSystem from '../render/Alerts.js';


/* -------------------------------------------
    REPLY INPUT HANDLER
------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {

    /* -------------------------------------------
        FUNCTION: Close all reply input containers
    ------------------------------------------- */
    function closeAllReplyInputs() {
        document.querySelectorAll('.reply-input-container').forEach(input => {
            input.classList.remove('active');
        });
    }


    /* -------------------------------------------
        EVENT: Open reply input
    ------------------------------------------- */
    document.querySelectorAll('.reply-btn').forEach(button => {
        button.addEventListener('click', () => {
            const commentId = button.dataset.comment;
            const replyId = button.dataset.reply;

            // Close any currently open inputs
            closeAllReplyInputs();

            // Determine the correct input ID
            const inputId = `reply-input-${commentId || replyId}`;
            const inputContainer = document.getElementById(inputId);
            if (inputContainer) {
                inputContainer.classList.add('active');
                inputContainer.querySelector('textarea')?.focus();
            }
        });
    });


    /* -------------------------------------------
        EVENT: Cancel reply
    ------------------------------------------- */
    document.querySelectorAll('.cancel-reply-btn').forEach(button => {
        button.addEventListener('click', () => {
            const commentId = button.dataset.comment;
            const replyId = button.dataset.reply;

            const inputId = `reply-input-${commentId || replyId}`;
            const inputContainer = document.getElementById(inputId);
            inputContainer?.classList.remove('active');
        });
    });


    /* -------------------------------------------
        EVENT: Post reply (placeholder)
        You can add actual reply submission logic here
    ------------------------------------------- */
    document.querySelectorAll('.post-reply-btn').forEach(button => {
        button.addEventListener('click', () => {
            const commentId = button.dataset.comment;
            const replyId = button.dataset.reply;

            const inputId = `reply-input-${commentId || replyId}`;
            const textarea = document.querySelector(`#${inputId} textarea`);

            if (textarea) {
                const replyText = textarea.value.trim();
                if (replyText) {
                    console.log("Reply submitted:", replyText);
                    // TODO: Add actual Supabase insert or API call here

                    // Clear and close input after submission
                    textarea.value = '';
                    document.getElementById(inputId).classList.remove('active');
                }
            }
        });
    });

});
