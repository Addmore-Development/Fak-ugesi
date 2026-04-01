document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("awardSubmitForm");
  if (!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = form.querySelector(".submit-btn");
    const orig = btn ? btn.textContent : "";
    const payload = {
      name: document.getElementById("fName")?.value?.trim(),
      email: document.getElementById("fEmail")?.value?.trim(),
      category: document.getElementById("fCategory")?.value,
      project_title: document.getElementById("fTitle")?.value?.trim(),
      description: document.getElementById("fDesc")?.value?.trim() || ""
    };
    if (!payload.name || !payload.email || !payload.category || !payload.project_title) { API.showToast("Please fill in all required fields.", "error"); return; }
    if (btn) { btn.textContent = "Submitting..."; btn.disabled = true; }
    try {
      await API.submitAward(payload);
      const s = document.getElementById("formSuccess");
      if (s) s.style.display = "block";
      form.reset();
      API.showToast("Application submitted!", "success");
    } catch (err) { API.showToast(err.message || "Submission failed.", "error"); }
    finally { if (btn) { btn.textContent = orig; btn.disabled = false; } }
  });
});
