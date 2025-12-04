// Cached DOM elements
const avatarUpload = document.getElementById('avatar-upload');
const avatarPreview = document.getElementById('avatar-preview');
const bioTextarea = document.getElementById('bio');
const charCount = document.getElementById('char-count');
const form = document.querySelector('form');
const toast = document.getElementById('successToast');
const closeToastBtn = document.getElementById('closeToast');


// ========== Avatar Upload Preview ==========
avatarUpload?.addEventListener('change', e => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = evt => (avatarPreview.src = evt.target.result);
    reader.readAsDataURL(file);
});


// ========== Bio Character Counter ==========
function updateCharCount() {
    const remaining = 500 - bioTextarea.value.length;
    charCount.textContent = remaining;

    charCount.classList.toggle('text-red-500', remaining < 50);
    charCount.classList.toggle('text-gray-500', remaining >= 50);
}

bioTextarea?.addEventListener('input', updateCharCount);
updateCharCount();


// ========== Toast Handling ==========
function showToast() {
    toast.classList.remove('hidden', 'translate-y-10', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');

    // Auto-hide after 5 seconds
    setTimeout(hideToast, 5000);
}

function hideToast() {
    toast.classList.add('translate-y-10', 'opacity-0');
    setTimeout(() => toast.classList.add('hidden'), 300);
}

closeToastBtn?.addEventListener('click', hideToast);


// ========== Form Submit ==========
form?.addEventListener('submit', e => {
    e.preventDefault();
    showToast();
});
