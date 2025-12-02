document.addEventListener("DOMContentLoaded", () => {
    const backIcon = document.getElementById("backIcon");
    if (!backIcon) return;

    backIcon.addEventListener("click", (e) => {
        e.preventDefault();

        const from = localStorage.getItem("messages_from");

        if (from) {
            window.location.href = from;
        } else {
            window.location.href = "./home.html";
        }
    });
});
