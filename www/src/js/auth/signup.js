import supabaseClient from '../supabase.js';

document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const signupName = document.getElementById('signupName').value.trim();
        const signupEmail = document.getElementById('signupEmail').value.trim();
        const signupPassword = document.getElementById('signupPassword').value;
        const signupConfirmPassword = document.getElementById('signupConfirmPassword').value;

        if (!signupName || !signupEmail || !signupPassword || !signupConfirmPassword) {
            alert('Please fill out all fields');
            return;
        }

        if (signupPassword !== signupConfirmPassword) {
            alert("Passwords don't match");
            return;
        }

        // Create account
        const { data, error } = await supabaseClient.auth.signUp({
            email: signupEmail,
            password: signupPassword,
            options: {
                data: { display_name: signupName }
            }
        });

        if (error) {
            alert(error.message);
            return;
        }

        await supabaseClient.auth.signInWithPassword({
            email: signupEmail,
            password: signupPassword
        });

        alert('Account created & logged in!');
        //window.location.href = "src/html/profile.html";
    });
});
