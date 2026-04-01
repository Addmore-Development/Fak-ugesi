document.addEventListener("DOMContentLoaded", async () => {
  try {
    const tickets = await API.getTickets();
    if (!tickets || !tickets.length) return;
    tickets.forEach(ticket => {
      document.querySelectorAll(".ticket-row").forEach(row => {
        const nameEl = row.querySelector(".stub-name, .ticket-title");
        if (!nameEl) return;
        const name = nameEl.textContent.toLowerCase();
        const type = (ticket.pass_type || "").toLowerCase();
        if (name.includes(type.replace(" pass","")) || type.includes(name.replace(" pass",""))) {
          const priceEl = row.querySelector(".price-main");
          if (priceEl && ticket.price) priceEl.innerHTML = `<span class="price-curr">R</span>${ticket.price}`;
          const stuEl = row.querySelector(".price-stu-val");
          if (stuEl && ticket.student_price) stuEl.textContent = `R${ticket.student_price}`;
        }
      });
    });
  } catch (err) { console.log("Using static ticket data"); }
});
