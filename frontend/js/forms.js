document.addEventListener("DOMContentLoaded", () => {
  const contact = document.getElementById("contactForm");
  if (contact) {
    contact.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = contact.querySelector("button[type=submit], .submit-btn");
      const orig = btn ? btn.textContent : "";
      const payload = {
        name: contact.querySelector("[name=name], #contactName")?.value?.trim(),
        email: contact.querySelector("[name=email], #contactEmail")?.value?.trim(),
        subject: contact.querySelector("[name=subject], #contactSubject")?.value?.trim() || "General Inquiry",
        message: contact.querySelector("[name=message], #contactMessage")?.value?.trim()
      };
      if (!payload.name || !payload.email || !payload.message) { API.showToast("Please fill in all required fields.", "error"); return; }
      if (btn) { btn.textContent = "Sending..."; btn.disabled = true; }
      try { await API.submitContact(payload); API.showToast("Message sent!", "success"); contact.reset(); }
      catch (err) { API.showToast(err.message || "Failed to send.", "error"); }
      finally { if (btn) { btn.textContent = orig; btn.disabled = false; } }
    });
  }
  document.querySelectorAll(".newsletter-form, #newsletterForm").forEach(form => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const emailEl = form.querySelector("input[type=email]");
      if (!emailEl || !emailEl.value.trim()) { API.showToast("Please enter your email.", "error"); return; }
      try { await API.subscribeNewsletter(emailEl.value.trim()); API.showToast("Subscribed!", "success"); emailEl.value = ""; }
      catch (err) { API.showToast(err.message || "Failed.", "error"); }
    });
  });
});
