import supabaseClient from '../supabase.js';


async function loadUserName() {
    const { data, error } = await supabaseClient.auth.getUser();

    if (!error && data?.user) {
        const name = data.user.user_metadata?.display_name || "User";

        const usernameElement = document.getElementById("username");
          const nameElement = document.getElementById("name");
            const namepost = document.getElementById("Name_post");
          
        if (usernameElement ||nameElement || namepost ) {
            usernameElement.textContent = name;
            nameElement.textContent = name;
            namepost.textContent = name + "'s Posts";

        }
    } else {
        console.log("User not logged in");
    }
}

loadUserName();