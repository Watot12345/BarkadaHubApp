import supabaseClient from '../supabase.js';
import AlertSystem from '../render/Alerts.js';

document.addEventListener('DOMContentLoaded', async () => {
    const alertSystem = new AlertSystem();

    /* -------------------------------
       CHECK USER LOGIN
    ------------------------------- */
    try {
        const { data, error } = await supabaseClient.auth.getUser();
        if (error || !data?.user) {
            alertSystem.show("You must be logged in.", "error");
            setTimeout(() => window.location.href = "../../index.html", 1500);
            return;
        }
    } catch (err) {
        console.error("Error fetching user:", err);
        alertSystem.show("An unexpected error occurred.", "error");
        return;
    }

    /* -------------------------------
       ELEMENT REFERENCES
    ------------------------------- */
    const modal = document.getElementById("createClubModal");
    const openBtn = document.getElementById("openCreateClubBtn");
    const closeBtn = document.getElementById("closeModalBtn");
    const cancelBtn = document.getElementById("cancelBtn");
    const createClubForm = document.getElementById("createClubForm");

    const uploadImageBtn = document.getElementById("uploadImageBtn");
    const inputClubPicture = document.getElementById("clubPicture");
    const emptyPreview = document.getElementById("emptyPreviewContainer");
    const previewContainer = document.getElementById("imagePreviewContainer");
    const imagePreview = document.getElementById("imagePreview");
    const removeImageBtn = document.getElementById("removeImageBtn");
    const fileNameWrapper = document.getElementById("fileName");
    const fileNameText = document.getElementById("fileNameText");

    /* -------------------------------
       MODAL FUNCTIONS
    ------------------------------- */
    const openModal = () => {
        if (!modal) return;
        modal.classList.remove("hidden");
        document.body.style.overflow = "hidden";
    };

    const closeModal = () => {
        if (!modal) return;
        modal.classList.add("hidden");
        document.body.style.overflow = "";
    };

    /* -------------------------------
       MODAL EVENT LISTENERS
    ------------------------------- */
    if (openBtn) openBtn.addEventListener("click", openModal);
    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (cancelBtn) cancelBtn.addEventListener("click", closeModal);
    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) closeModal();
        });
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal && !modal.classList.contains("hidden")) {
            closeModal();
        }
    });

    /* -------------------------------
       IMAGE UPLOAD HANDLERS
    ------------------------------- */
    const openFileDialog = () => inputClubPicture?.click();

    if (uploadImageBtn) uploadImageBtn.addEventListener("click", openFileDialog);
    if (emptyPreview) emptyPreview.addEventListener("click", openFileDialog);

    if (inputClubPicture) {
        inputClubPicture.addEventListener("change", function () {
            const file = this.files[0];
            if (!file) return;

            if (!file.type.startsWith("image/")) {
                alert("Please select an image file.");
                this.value = "";
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                alert("Image must be smaller than 5MB.");
                this.value = "";
                return;
            }

            if (imagePreview && previewContainer && emptyPreview) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    imagePreview.src = e.target.result;
                    previewContainer.classList.remove("hidden");
                    emptyPreview.classList.add("hidden");
                };
                reader.readAsDataURL(file);
            }

            if (fileNameText && fileNameWrapper) {
                fileNameText.textContent = file.name;
                fileNameWrapper.classList.remove("hidden");
            }
        });
    }

    if (removeImageBtn) {
        removeImageBtn.addEventListener("click", () => {
            if (inputClubPicture) inputClubPicture.value = "";
            if (imagePreview) imagePreview.src = "";
            if (previewContainer && emptyPreview && fileNameWrapper) {
                previewContainer.classList.add("hidden");
                emptyPreview.classList.remove("hidden");
                fileNameWrapper.classList.add("hidden");
            }
        });
    }

    if (imagePreview) imagePreview.addEventListener("click", openFileDialog);

    /* -------------------------------
       FORM SUBMISSION
    ------------------------------- */
    if (createClubForm) {
        createClubForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const clubName = document.getElementById("clubName")?.value.trim();
            const description = document.getElementById("description")?.value.trim();
            const location = document.getElementById("location")?.value.trim();
            const imageFile = inputClubPicture?.files[0];

            try {
                const { data: { user } } = await supabaseClient.auth.getUser();
                if (!user) return;

                let imageUrl = null;

                if (imageFile) {
                    const filePath = `clubs/${user.id}-${Date.now()}-${imageFile.name}`;
                    const { error: uploadError } = await supabaseClient.storage
                        .from("club_images")
                        .upload(filePath, imageFile);

                    if (uploadError) throw uploadError;

                    const { data } = supabaseClient.storage
                        .from("club_images")
                        .getPublicUrl(filePath);

                    imageUrl = data.publicUrl;
                }

                const { error } = await supabaseClient
                    .from("clubs")
                    .insert({
                        club_name: clubName,
                        description,
                        location,
                        club_image: imageUrl,
                        owner_id: user.id
                    });

                if (error) throw error;

                alertSystem.show("Club created successfully!", "success");
                createClubForm.reset();
                if (previewContainer && emptyPreview && fileNameWrapper) {
                    previewContainer.classList.add("hidden");
                    emptyPreview.classList.remove("hidden");
                    fileNameWrapper.classList.add("hidden");
                }
                closeModal();
            } catch (err) {
                console.error(err);
                alertSystem.show("Error creating club", "error");
            }
        });
    }
});
