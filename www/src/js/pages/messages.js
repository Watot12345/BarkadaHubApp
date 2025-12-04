import supabaseClient from '../supabase.js';
import { lost_found } from '../render/post.js';
import AlertSystem from '../render/Alerts.js';


document.addEventListener("DOMContentLoaded", () => {
    const backIcon = document.getElementById("backIcon");
    if (!backIcon) return;

    backIcon.addEventListener("click", (e) => {
        e.preventDefault();

        const from = localStorage.getItem("messages_from");

        if (from) {
            window.location.href = from;
        } else {
            window.location.href = "./home.html";
        }
    });
});
