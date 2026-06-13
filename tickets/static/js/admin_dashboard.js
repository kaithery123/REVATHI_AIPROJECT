const token = localStorage.getItem("access");

if (!token) {
    window.location.href = "/login.html";
}


async function protectAdmin() {

    const res = await fetch("/api/admin-check/", {
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    const data = await res.json();

    if (!data.is_admin) {
        alert("Access Denied: Admin Only");
        window.location.href = "/login.html";
        return false;
    }

    return true;
}
let allTickets = [];
async function loadAdminTickets() {

    const response = await fetch("/api/admin-tickets/", {
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    allTickets = await response.json();  // store globally

    renderTickets(allTickets);
}
function renderTickets(data) {

    const grouped = {};

    data.forEach(ticket => {
        const user = ticket.user;

        if (!grouped[user]) {
            grouped[user] = [];
        }

        grouped[user].push(ticket);
    });

    let html = "";

    Object.keys(grouped).forEach(user => {

        html += `
        <div class="user-group">
            <h3>👤 ${user}</h3>
        `;

        grouped[user].forEach(ticket => {

            html += `
            <div class="ticket-card">

        <div class="ticket-title">${ticket.title}</div>
        <div class="ticket-desc">${ticket.description}</div>

        <b>Status:</b> ${ticket.status}<br>
        <b>Category:</b> ${ticket.category}<br>

        <button class="btn-delete" onclick="deleteTicket(${ticket.id})">
            Delete
        </button>

        </div>
`;
        });

        html += `</div>`;
    });

    document.getElementById("adminTickets").innerHTML = html;
}
function filterTickets() {

    const value = document.getElementById("searchBox").value.toLowerCase();

    const filtered = allTickets.filter(ticket =>
        ticket.user.toLowerCase().includes(value)
    );

    renderTickets(filtered);
}
async function deleteTicket(id) {

    const response = await fetch(`/api/tickets/${id}/`, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    if (response.ok) {
        alert("Ticket deleted");

        
        loadAdminTickets();
    } else {
        alert("Failed to delete");
    }
}
window.onload = loadAdminTickets;