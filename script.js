document.addEventListener("DOMContentLoaded", () => {
  const ADMIN_WA_NUMBER = "62882005161406";

  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  const serviceSelect = document.getElementById("serviceType");
  const selectButtons = document.querySelectorAll(".select-service");
  const orderForm = document.getElementById("orderForm");
  const summaryOutput = document.getElementById("summaryOutput");
  const summaryText = document.getElementById("summaryText");
  const copySummaryBtn = document.getElementById("copySummaryBtn");

  // Toggle menu mobile
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Pilih layanan dari kartu lalu arahkan ke form pemesanan
  selectButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const chosenService = btn.getAttribute("data-service");
      if (chosenService && serviceSelect) {
        serviceSelect.value = chosenService;
      }
      const orderSection = document.getElementById("order");
      if (orderSection) {
        orderSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Menyusun format ringkasan pesan
  function buildSummary() {
    const nama = document.getElementById("clientName").value.trim() || "-";
    const layanan = serviceSelect.value;
    const target = document.getElementById("deadline").value.trim() || "Menyesuaikan";
    const catatan = document.getElementById("notes").value.trim() || "-";

    return [
      "Halo IDN - NET (@est2025), saya ingin konsultasi/order:",
      `• Nama: ${nama}`,
      `• Layanan: ${layanan}`,
      `• Target waktu: ${target}`,
      `• Detail: ${catatan}`
    ].join("\n");
  }

  // Submit form: tampilkan ringkasan & langsung arahkan ke WhatsApp admin
  orderForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = buildSummary();
    summaryText.textContent = message;
    summaryOutput.hidden = false;

    const waUrl = `https://wa.me/${ADMIN_WA_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  });

  // Tombol salin ringkasan teks
  copySummaryBtn.addEventListener("click", async () => {
    const message = buildSummary();
    summaryText.textContent = message;
    summaryOutput.hidden = false;

    try {
      await navigator.clipboard.writeText(message);
      const originalLabel = copySummaryBtn.textContent;
      copySummaryBtn.textContent = "Tersalin";
      setTimeout(() => {
        copySummaryBtn.textContent = originalLabel;
      }, 1600);
    } catch {
      copySummaryBtn.textContent = "Lihat di bawah";
      setTimeout(() => {
        copySummaryBtn.textContent = "Salin Teks";
      }, 1600);
    }
  });

  // Animasi muncul saat di-scroll
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealItems.forEach((el) => observer.observe(el));
  } else {
    revealItems.forEach((el) => el.classList.add("is-visible"));
  }
});