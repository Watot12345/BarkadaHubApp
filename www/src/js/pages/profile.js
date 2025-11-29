import supabaseClient from '../supabase.js';


async function loadUserName() {
    const { data, error } = await supabaseClient.auth.getUser();

    if (!error && data?.user) {
        const name = data.user.user_metadata?.display_name || "User";

        const usernameElement = document.getElementById("username");
        if (usernameElement) {
            usernameElement.textContent = name;
        }
    } else {
        console.log("User not logged in");
    }
}

loadUserName();