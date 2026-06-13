const token = localStorage.getItem("access");

if (!token) {
    window.location.href = "/login.html";
}

async function loadTickets() {

    try {

        const response = await fetch("/api/tickets/", {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        const data = await response.json();

        console.log("API DATA:", data);

        let tickets = data;

        // If DRF pagination is enabled
        if (data.results) {
            tickets = data.results;
        }

        if (!Array.isArray(tickets)) {
            document.getElementById("ticketList").innerHTML =
                "<h3>No tickets found.</h3>";
            return;
        }

        let html = "";

        tickets.forEach(ticket => {

            html += `
<div class="ticket-card">

    <div class="ticket-top">
        <div class="ticket-title">${ticket.title}</div>

        <span class="status ${ticket.status.toLowerCase()}">
            
        <strong>Status:</strong>${ticket.status}
        </span>
    </div>

    <div class="ticket-desc">

        <strong>Description:</strong> ${ticket.description}
    </div>

    <div class="ticket-info">
        <div><strong>Category:</strong> ${ticket.category}</div>
    </div>

    <div class="ai-response">
        <h4>AI Suggested Solution</h4>
        <p>${ticket.ai_response}</p>
    </div>

    <button class="delete-btn"
            onclick="deleteTicket(${ticket.id})">
        Delete Ticket
    </button>

</div>
`;
        });

        document.getElementById("ticketList").innerHTML = html;

    } catch (error) {

        console.error(error);

        document.getElementById("ticketList").innerHTML =
            "<h3>Error loading tickets.</h3>";
    }
}

window.onload = loadTickets;
async function deleteTicket(id) {

    const confirmDelete =
        confirm("Are you sure you want to delete this ticket?");

    if (!confirmDelete) return;

    const response = await fetch(`/api/tickets/${id}/`, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    if (response.ok) {

        alert("Ticket deleted successfully");

        loadTickets(); // refresh list

    } else {

        alert("Failed to delete ticket");
    }
}