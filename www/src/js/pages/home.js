document.addEventListener('DOMContentLoaded', function () {
    const postForm = document.getElementById('postForm');
    const postContent = document.getElementById('postContent');
    const charCount = document.getElementById('charCount');
    const photoUpload = document.getElementById('photoUpload');
    const videoUpload = document.getElementById('videoUpload');
    const mediaPreview = document.getElementById('mediaPreview');
    const previewContainer = document.getElementById('previewContainer');
    const removeMedia = document.getElementById('removeMedia');
    const locationBtn = document.getElementById('locationBtn');
    const locationSelector = document.getElementById('locationSelector');
    const closeLocation = document.getElementById('closeLocation');
    const locationInput = document.getElementById('locationInput');
    const feelingBtn = document.getElementById('feelingBtn');
    const feelingSelector = document.getElementById('feelingSelector');
    const closeFeeling = document.getElementById('closeFeeling');
    const feelingOptions = document.querySelectorAll('.feeling-option');
    const postButton = document.getElementById('postButton');

    let selectedMedia = null;
    let selectedLocation = null;
    let selectedFeeling = null;

    // Character counter
    postContent.addEventListener('input', function () {
        const count = this.value.length;
        charCount.textContent = count;

        // Disable post button if content is empty
        if (count === 0 && !selectedMedia) {
            postButton.disabled = true;
        } else {
            postButton.disabled = false;
        }
    });

    // Photo upload
    photoUpload.addEventListener('change', function (e) {
        if (this.files && this.files[0]) {
            handleMediaUpload(this.files[0], 'image');
        }
    });

    // Video upload
    videoUpload.addEventListener('change', function (e) {
        if (this.files && this.files[0]) {
            handleMediaUpload(this.files[0], 'video');
        }
    });

    // Handle media upload and preview
    function handleMediaUpload(file, type) {
        selectedMedia = {
            file: file,
            type: type
        };

        const reader = new FileReader();

        reader.onload = function (e) {
            previewContainer.innerHTML = '';

            if (type === 'image') {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.className = 'max-h-64 rounded-lg';
                previewContainer.appendChild(img);
            } else if (type === 'video') {
                const video = document.createElement('video');
                video.src = e.target.result;
                video.controls = true;
                video.className = 'max-h-64 rounded-lg';
                previewContainer.appendChild(video);
            }

            mediaPreview.classList.remove('hidden');

            // Enable post button if content is empty but media is selected
            if (postContent.value.length === 0) {
                postButton.disabled = false;
            }
        };

        reader.readAsDataURL(file);
    }

    // Remove media
    removeMedia.addEventListener('click', function () {
        selectedMedia = null;
        mediaPreview.classList.add('hidden');
        photoUpload.value = '';
        videoUpload.value = '';

        // Disable post button if content is also empty
        if (postContent.value.length === 0) {
            postButton.disabled = true;
        }
    });

    // Location selector
    locationBtn.addEventListener('click', function () {
        locationSelector.classList.toggle('hidden');
        feelingSelector.classList.add('hidden');
    });

    closeLocation.addEventListener('click', function () {
        locationSelector.classList.add('hidden');
    });

    locationInput.addEventListener('input', function () {
        selectedLocation = this.value;
    });

    // Feeling selector
    feelingBtn.addEventListener('click', function () {
        feelingSelector.classList.toggle('hidden');
        locationSelector.classList.add('hidden');
    });

    closeFeeling.addEventListener('click', function () {
        feelingSelector.classList.add('hidden');
    });

    feelingOptions.forEach(option => {
        option.addEventListener('click', function () {
            selectedFeeling = this.getAttribute('data-feeling');

            // Update feeling button text
            const feelingText = this.querySelector('.text-xs').textContent;
            feelingBtn.innerHTML = `<i class="fas fa-smile text-md"></i><span class="text-xs">${feelingText}</span>`;

            feelingSelector.classList.add('hidden');
        });
    });

    // Form submission
    postForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // In a real application, you would send this data to your backend
        const formData = new FormData();
        formData.append('content', postContent.value);

        if (selectedMedia) {
            formData.append('media', selectedMedia.file);
        }

        if (selectedLocation) {
            formData.append('location', selectedLocation);
        }

        if (selectedFeeling) {
            formData.append('feeling', selectedFeeling);
        }

        // Simulate successful post submission
        alert('Post created successfully!');

        // Reset form
        postForm.reset();
        postContent.value = '';
        charCount.textContent = '0';
        mediaPreview.classList.add('hidden');
        selectedMedia = null;
        selectedLocation = null;
        selectedFeeling = null;

        // Reset feeling button
        feelingBtn.innerHTML = `<i class="fas fa-smile text-md"></i><span class="text-xs">Feeling</span>`;

        // Disable post button
        postButton.disabled = true;
    });

    // Initialize post button as disabled
    postButton.disabled = true;




    document.addEventListener('DOMContentLoaded', function() {
    LoadHome();
});

     async function LoadHome() {
    const { data, error } = await supabaseClient.auth.getUser();

    if (!error && data?.user) {
        const name = data.user.user_metadata?.display_name || "User";

        const FeedElement = document.getElementById("postContent");
        
          
        if (FeedElement ) {
            FeedElement.placeholder= `What's on your mind, ${name}?`;
        }
    } else {
        console.log("User not logged in");
    }
}
});
