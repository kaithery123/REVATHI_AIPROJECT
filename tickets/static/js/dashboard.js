const token = localStorage.getItem("access");

if (!token) {
    window.location.href = "/login.html";
}

function logout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    window.location.href = "/login.html";
}

// CREATE TICKET
async function createTicket() {

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;

    const response = await fetch("/api/tickets/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
            title,
            description
        })
    });

    const data = await response.json();

    if (response.ok) {

        alert("Ticket Created");

        document.getElementById("title").value = "";
        document.getElementById("description").value = "";

        loadLatestTicket();

    } else {

        alert(JSON.stringify(data));
    }
}

// GENERATE AI RESPONSE
async function generateAI(id) {

    const response = await fetch(
        `/api/tickets/${id}/generate-ai/`,
        {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token
            }
        }
    );

    if (response.ok) {

        alert("AI Solution Generated");

        loadLatestTicket();

    } else {

        const error = await response.text();

        alert(error);
    }
}

// LOAD LATEST TICKET
async function loadLatestTicket() {

    const response = await fetch("/api/tickets/", {
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
        return;
    }

    const latest = data[data.length - 1];

    document.getElementById("latestTicket").innerHTML = `
<div class="ticket-card">

    <div class="ticket-top">

        <div class="ticket-title">
            ${latest.title}
        </div>

        <span class="status ${latest.status.toLowerCase()}">
            <strong>Status:</strong><br>${latest.status}
        </span>

    </div>

    <div class="ticket-desc">
        <strong>Description:</strong><br>
        ${latest.description}
    </div>

    <div class="ticket-info">
        <div><strong>ID:</strong> #${latest.id}</div>
        <div><strong>Category:</strong> ${latest.category}</div>
    </div>

    <div class="ai-response">
        <h4>AI Suggested Solution</h4>
        <p>
            ${latest.ai_response || "No AI solution generated yet."}
        </p>
    </div>

    ${
        latest.status !== "RESOLVED"
        ?
        `
        <button
            class="btn btn-create"
            onclick="generateAI(${latest.id})">
            Get AI Solution
        </button>
        `
        :
        ""
    }

</div>
`;

    document.getElementById("latestTitle").style.display = "block";
}

// DON'T SHOW OLD TICKETS ON PAGE LOAD
window.onload = function () {
};
function goAdmin() {
    const token = localStorage.getItem("access");
    const user = JSON.parse(atob(token.split(".")[1]));

    if (!user.is_superuser) {
        alert("Only admin can access this page");
        return;
    }

    window.location.href = "/admin-dashboard.html";
}