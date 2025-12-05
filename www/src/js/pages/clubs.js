import supabaseClient from '../supabase.js';
import { lost_found } from '../render/post.js';
import AlertSystem from '../render/Alerts.js';

/* -------------------------------------------
    MAIN SCRIPT - RUNS AFTER DOM IS READY
------------------------------------------- */
document.addEventListener('DOMContentLoaded', async () => {

    /* -------------------------------------------
        CHECK USER LOGIN
    ------------------------------------------- */
    const alertSystem = new AlertSystem();

    try {
        const { data, error } = await supabaseClient.auth.getUser();

        if (error || !data?.user) {
            alertSystem.show("You must be logged in.", "error");
            setTimeout(() => {
                window.location.href = "../../index.html";
            }, 1500);
            return;
        }
    } catch (err) {
        console.error("Error fetching user:", err);
        alertSystem.show("An unexpected error occurred.", "error");
        return;
    }

    /* -------------------------------------------
        ELEMENT REFERENCES
    ------------------------------------------- */
    const modal = document.getElementById("createClubModal");
    const openBtn = document.getElementById("openCreateClubBtn");
    const closeBtn = document.getElementById("closeModalBtn");
    const cancelBtn = document.getElementById("cancelBtn");

    const uploadImageBtn = document.getElementById("uploadImageBtn");
    const inputClubPicture = document.getElementById("clubPicture");

    const emptyPreview = document.getElementById("emptyPreviewContainer");
    const previewContainer = document.getElementById("imagePreviewContainer");
    const imagePreview = document.getElementById("imagePreview");
    const removeImageBtn = document.getElementById("removeImageBtn");

    const fileNameWrapper = document.getElementById("fileName");
    const fileNameText = document.getElementById("fileNameText");

    /* -------------------------------------------
        MODAL CONTROL FUNCTIONS
    ------------------------------------------- */
    const openModal = () => {
        modal.classList.remove("hidden");
        document.body.style.overflow = "hidden"; // Lock scroll
    };

    const closeModal = () => {
        modal.classList.add("hidden");
        document.body.style.overflow = ""; // Restore scroll
    };

    /* -------------------------------------------
        MODAL EVENT LISTENERS
    ------------------------------------------- */
    openBtn.addEventListener("click", openModal);
    closeBtn.addEventListener("click", closeModal);
    cancelBtn.addEventListener("click", closeModal);

    // Close when clicking outside modal content
    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });

    // Close using Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !modal.classList.contains("hidden")) {
            closeModal();
        }
    });

    /* -------------------------------------------
        IMAGE UPLOAD HANDLERS
    ------------------------------------------- */

    // Opens file picker
    const openFileDialog = () => inputClubPicture.click();
    uploadImageBtn.addEventListener("click", openFileDialog);
    emptyPreview.addEventListener("click", openFileDialog);

    // Image selection & validation
    inputClubPicture.addEventListener("change", function () {
        const file = this.files[0];
        if (!file) return;

        // Ensure file is an image
        if (!file.type.startsWith("image/")) {
            alert("Please select an image file.");
            this.value = "";
            return;
        }

        // File size limit: 5MB
        if (file.size > 5 * 1024 * 1024) {
            alert("Image must be smaller than 5MB.");
            this.value = "";
            return;
        }

        // Display preview
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;

            previewContainer.classList.remove("hidden");
            emptyPreview.classList.add("hidden");
        };
        reader.readAsDataURL(file);

        // Show file name
        fileNameText.textContent = file.name;
        fileNameWrapper.classList.remove("hidden");
    });

    /* -------------------------------------------
        REMOVE IMAGE
    ------------------------------------------- */
    removeImageBtn.addEventListener("click", () => {
        inputClubPicture.value = "";
        imagePreview.src = "";

        previewContainer.classList.add("hidden");
        emptyPreview.classList.remove("hidden");
        fileNameWrapper.classList.add("hidden");
    });

    // Clicking preview also opens file selection
    imagePreview.addEventListener("click", openFileDialog);
});
