
document.addEventListener('DOMContentLoaded', () => {

    // DOM Elements
    const videoBtn = document.getElementById('videoBtn');
    const cameraBtn = document.getElementById('cameraBtn');
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    const mediaPreviewArea = document.getElementById('mediaPreviewArea');
    const previewContainer = document.getElementById('previewContainer');
    const messagesContainer = document.getElementById('messagesContainer');

    // Current media file
    let currentMediaFile = null;
    let currentMediaType = null; // 'image' or 'video'

    // Camera button click handler
    cameraBtn.addEventListener('click', function () {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.capture = 'environment';

        input.onchange = function (e) {
            if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                currentMediaFile = file;
                currentMediaType = 'image';
                showMediaPreview(file, 'image');
            }
        };

        input.click();
    });

    // Video button click handler
    videoBtn.addEventListener('click', function () {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'video/*';

        input.onchange = function (e) {
            if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                currentMediaFile = file;
                currentMediaType = 'video';
                showMediaPreview(file, 'video');
            }
        };

        input.click();
    });

    // Show media preview
    function showMediaPreview(file, type) {
        // Clear previous preview
        previewContainer.innerHTML = '';

        // Create preview element based on type
        if (type === 'image') {
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            img.className = 'w-40 h-40 object-cover rounded-lg';
            previewContainer.appendChild(img);
        } else if (type === 'video') {
            const video = document.createElement('video');
            video.src = URL.createObjectURL(file);
            video.className = 'w-40 h-40 object-cover rounded-lg';
            video.controls = true;
            video.muted = true;
            previewContainer.appendChild(video);
        }

        // Create remove button
        const removeBtn = document.createElement('button');
        removeBtn.className = 'absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors';
        removeBtn.innerHTML = '<i class="fas fa-times text-xs"></i>';
        removeBtn.onclick = function () {
            removeMediaPreview();
        };
        previewContainer.appendChild(removeBtn);

        // Show preview area
        mediaPreviewArea.classList.remove('hidden');
    }

    // Remove media preview
    function removeMediaPreview() {
        previewContainer.innerHTML = '';
        mediaPreviewArea.classList.add('hidden');
        currentMediaFile = null;
        currentMediaType = null;
    }

    // Send message handler
    sendBtn.addEventListener('click', function () {
        const messageText = messageInput.value.trim();

        // If there's media or text to send
        if (currentMediaFile || messageText) {
            // Create message object
            const message = {
                text: messageText,
                media: currentMediaFile ? {
                    file: currentMediaFile,
                    type: currentMediaType,
                    url: URL.createObjectURL(currentMediaFile)
                } : null,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isOutgoing: true
            };

            // Add message to UI
            addMessageToUI(message);

            // Clear inputs
            messageInput.value = '';
            if (currentMediaFile) {
                removeMediaPreview();
            }

            // Scroll to bottom
            scrollToBottom();

            // In a real app, you would upload the media to your server here
            // and send the message through WebSocket or API
            console.log('Message sent:', message);
        }
    });


    // Scroll to bottom of messages
    function scrollToBottom() {
        const chatBody = document.querySelector('.overflow-y-auto');
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    // Send message on Enter key (but not Shift+Enter)
    messageInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendBtn.click();
        }
    });
});
