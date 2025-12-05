import supabaseClient from '../supabase.js';
import uploadedPost from '../render/post.js';
import AlertSystem from '../render/Alerts.js';

document.addEventListener('DOMContentLoaded', async () => {

    // ELEMENTS
    const postForm = document.getElementById('postForm');
    const postContent = document.getElementById('postContent');
    const charCount = document.getElementById('charCount');
    const photoUpload = document.getElementById('photoUpload');
    const videoUpload = document.getElementById('videoUpload');
    const mediaPreview = document.getElementById('mediaPreview');
    const previewContainer = document.getElementById('previewContainer');
    const removeMedia = document.getElementById('removeMedia');
    const postButton = document.getElementById('postButton');
    const postsContainer = document.getElementById('dynamic-posts');

    // STATE
    let selectedMedia = null;
    const displayedPostIds = new Set();
    const alertSystem = new AlertSystem();

    /* -------------------------------------------
    LOAD USER
    ------------------------------------------- */
    async function loadUser() {
        const { data, error } = await supabaseClient.auth.getUser();
        if (error || !data?.user) {
            alertSystem.show("You must be logged in.", 'error');
            setTimeout(() => window.location.href = '../../index.html', 1500);
            return;
        }
        const name = data.user.user_metadata?.display_name || "User";
        postContent.placeholder = `What's on your mind, ${name}?`;
    }

    /* -------------------------------------------
    CHARACTER COUNT
    ------------------------------------------- */
    postContent.addEventListener('input', () => {
        charCount.textContent = postContent.value.length;
        postButton.disabled = (postContent.value.length === 0 && !selectedMedia);
    });

    /* -------------------------------------------
    MEDIA UPLOAD HANDLER
    ------------------------------------------- */
    function handleMediaUpload(file, type) {
        selectedMedia = { file, type };

        const reader = new FileReader();
        reader.onload = (e) => {
            previewContainer.innerHTML = '';

            const element = type === 'image'
                ? Object.assign(document.createElement('img'), {
                    src: e.target.result, className: 'max-h-64 rounded-lg'
                })
                : Object.assign(document.createElement('video'), {
                    src: e.target.result, controls: true, className: 'max-h-64 rounded-lg'
                });

            previewContainer.appendChild(element);
            mediaPreview.classList.remove('hidden');

            if (postContent.value.length === 0) postButton.disabled = false;
        };

        reader.readAsDataURL(file);
    }

    photoUpload.addEventListener('change', () => {
        if (photoUpload.files[0]) handleMediaUpload(photoUpload.files[0], 'image');
    });

    videoUpload.addEventListener('change', () => {
        if (videoUpload.files[0]) handleMediaUpload(videoUpload.files[0], 'video');
    });

    removeMedia.addEventListener('click', () => {
        selectedMedia = null;
        mediaPreview.classList.add('hidden');
        photoUpload.value = '';
        videoUpload.value = '';
        postButton.disabled = (postContent.value.length === 0);
    });

    /* -------------------------------------------
    ELLIPSIS MENU INIT
    ------------------------------------------- */
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

        closeBtn.onclick = () => {
            ellipsisMenuModal.classList.add('hidden');
            app.classList.remove('opacity-50');
            document.body.classList.remove('overflow-hidden');
        };

        deletePostBtn.onclick = showDeleteConfirmation;
        cancelDeleteBtn.onclick = hideDeleteConfirmation;
    }

    /* -------------------------------------------
    DELETE CONFIRMATION
    ------------------------------------------- */
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

    /* -------------------------------------------
    RENDER POST
    ------------------------------------------- */
    function renderPost(post, position = "beforeend") {
        if (!post.id || displayedPostIds.has(post.id)) return;

        const html = uploadedPost(
            post.user_name,
            post.content,
            post.media_url,
            post.media_type,
            post.id
        );

        postsContainer.insertAdjacentHTML(position, html);
        displayedPostIds.add(post.id);

        initEllipsisButtons();
    }

    /* -------------------------------------------
    SUBMIT / CREATE POST
    ------------------------------------------- */
    postForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const { data: userData } = await supabaseClient.auth.getUser();
        const userId = userData?.user?.id;
        const userName = userData?.user.user_metadata.display_name;

        if (!userId) return alertSystem.show("You must be logged in.", 'error');

        const loadingId = alertSystem.show("Posting...", 'loading');

        let mediaUrl = null;
        let mediaType = null;

        if (selectedMedia) {
            const file = selectedMedia.file;
            const ext = file.name.split('.').pop();
            const fileName = `${userId}-${Date.now()}.${ext}`;

            const { error: uploadError } = await supabaseClient
                .storage
                .from("post-media")
                .upload(fileName, file);

            if (uploadError) {
                alertSystem.hide(loadingId);
                return alertSystem.show("Media upload failed!", 'error');
            }

            const { data } = supabaseClient
                .storage
                .from("post-media")
                .getPublicUrl(fileName);

            mediaUrl = data.publicUrl;
            mediaType = selectedMedia.type;
        }

        // Insert and get inserted row
        const { data: newPost, error } = await supabaseClient
            .from("posts")
            .insert({
                user_id: userId,
                user_name: userName,
                content: postContent.value,
                media_url: mediaUrl,
                media_type: mediaType
            })
            .select()
            .single();

        alertSystem.hide(loadingId);

        if (error) return alertSystem.show("Failed to publish post!", 'error');

        renderPost(newPost, "afterbegin");

        // Reset form
        postForm.reset();
        selectedMedia = null;
        mediaPreview.classList.add('hidden');
        charCount.textContent = "0";
        postButton.disabled = true;

        alertSystem.show("Post created successfully!", 'success');
    });

    /* -------------------------------------------
    GET POSTS
    ------------------------------------------- */
    async function getPosts() {
        const { data } = await supabaseClient
            .from('posts')
            .select('*')
            .order("created_at", { ascending: false });

        if (!data) return;
        data.forEach(post => renderPost(post, "beforeend"));
    }

    /* -------------------------------------------
    FULL IMAGE VIEW
    ------------------------------------------- */
    window.viewFullImage = (url) => {
        const modal = document.getElementById('fullImageModal');
        document.getElementById('fullImageContent').src = url;
        modal.classList.remove('hidden');
    };

    document.getElementById('closeFullImage').onclick =
        () => document.getElementById('fullImageModal').classList.add('hidden');

    /* -------------------------------------------
    INITIAL LOAD
    ------------------------------------------- */
    loadUser();
    getPosts();

});
