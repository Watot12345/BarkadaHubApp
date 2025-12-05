/* -------------------------------------------
   CACHED DOM ELEMENTS
------------------------------------------- */
const avatarUpload = document.getElementById('avatar-upload');
const avatarPreview = document.getElementById('avatar-preview');
const bioTextarea = document.getElementById('bio');
const charCount = document.getElementById('char-count');
const form = document.querySelector('form');
const toast = document.getElementById('successToast');
const closeToastBtn = document.getElementById('closeToast');


/* -------------------------------------------
    AVATAR UPLOAD PREVIEW
------------------------------------------- */
avatarUpload?.addEventListener('change', e => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = evt => avatarPreview.src = evt.target.result;
    reader.readAsDataURL(file);
});


/* -------------------------------------------
    BIO CHARACTER COUNTER
------------------------------------------- */
function updateCharCount() {
    const remaining = 500 - (bioTextarea?.value.length || 0);
    charCount.textContent = remaining;

    charCount.classList.toggle('text-red-500', remaining < 50);
    charCount.classList.toggle('text-gray-500', remaining >= 50);
}

bioTextarea?.addEventListener('input', updateCharCount);
updateCharCount(); // initialize on page load


/* -------------------------------------------
    TOAST HANDLING
------------------------------------------- */
function showToast() {
    toast.classList.remove('hidden', 'translate-y-10', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');

    setTimeout(hideToast, 5000); // auto-hide after 5s
}

function hideToast() {
    toast.classList.add('translate-y-10', 'opacity-0');
    setTimeout(() => toast.classList.add('hidden'), 300);
}

closeToastBtn?.addEventListener('click', hideToast);


/* -------------------------------------------
    FORM SUBMIT
------------------------------------------- */
form?.addEventListener('submit', e => {
    e.preventDefault();

    // TODO: Add actual form submission logic here (e.g., Supabase or API call)
    showToast();
});
