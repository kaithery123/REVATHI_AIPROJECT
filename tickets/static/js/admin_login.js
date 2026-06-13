async function adminLogin() {

    const username = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch("/api/token/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    });

    const data = await response.json();

    if (!data.access) {
        document.getElementById("error").innerText = "Invalid username or password";
        return;
    }

    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);

    // ✅ check admin from backend (IMPORTANT)
    const check = await fetch("/api/admin-check/", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + data.access
        }
    });

    const result = await check.json();

    if (!result.is_admin) {
        alert("Only admin can access this page");

        localStorage.removeItem("access");
        localStorage.removeItem("refresh");

        return;
    }

    // ✅ success
    window.location.href = "/admin-dashboard.html";
}