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

  const windowsFields = document.getElementById("windowsFields");
  const generalServiceFields = document.getElementById("generalServiceFields");
  const packageSelect = document.getElementById("packageType");
  const packageInfo = document.getElementById("packageInfo");
  const officeField = document.getElementById("officeField");
  const officeSelect = document.getElementById("officeVersion");
  const officeLicenseSelect = document.getElementById("officeLicense");
  const premiumAppsField = document.getElementById("premiumAppsField");
  const extraApps = document.getElementById("extraApps");
  const appsCounter = document.getElementById("appsCounter");
  const licenseConsentRow = document.getElementById("licenseConsentRow");
  const licenseConsent = document.getElementById("licenseConsent");
  const generalDetails = document.getElementById("generalDetails");

  const packages = {
    Basic: {
      price: 100000,
      label: "Paket Basic",
      description: "Install Windows 10/11, install driver, Windows Update, pengaturan dasar Windows, pengecekan fungsi perangkat, dan pembersihan file sementara."
    },
    Standard: {
      price: 135000,
      label: "Paket Standard",
      description: "Semua layanan Basic, instalasi Microsoft Office 2019/2021 (jika tersedia lisensi), Google Chrome, PDF Reader, WinRAR/7-Zip, dan konfigurasi aplikasi dasar."
    },
    Premium: {
      price: 175000,
      label: "Paket Premium",
      description: "Semua layanan Standard, request maksimal 5 aplikasi tambahan, optimasi Windows, pengaturan tampilan dan sistem, pengecekan menyeluruh, serta konsultasi penggunaan."
    }
  };

  const formatRupiah = (amount) => new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(amount);

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

  function updateServiceFields() {
    const isWindowsOrder = serviceSelect.value === "Install Ulang Laptop";
    windowsFields.hidden = !isWindowsOrder;
    generalServiceFields.hidden = isWindowsOrder;
    windowsFields.querySelectorAll("input, select, textarea").forEach((control) => {
      control.disabled = !isWindowsOrder;
    });
    licenseConsentRow.hidden = !isWindowsOrder;
    licenseConsent.required = isWindowsOrder;
    licenseConsent.disabled = !isWindowsOrder;
    generalDetails.required = !isWindowsOrder;
    generalDetails.disabled = isWindowsOrder;
    updatePackageFields();
  }

  function updatePackageFields() {
    const selectedPackage = packageSelect.value;
    const packageData = packages[selectedPackage];
    const includesOffice = selectedPackage === "Standard" || selectedPackage === "Premium";
    const isPremium = selectedPackage === "Premium";

    packageInfo.innerHTML = `<strong>${packageData.label} — ${formatRupiah(packageData.price)}</strong><p>${packageData.description}</p>`;
    const isWindowsOrder = serviceSelect.value === "Install Ulang Laptop";
    officeField.hidden = !includesOffice;
    officeSelect.required = includesOffice && isWindowsOrder;
    officeSelect.disabled = !includesOffice || !isWindowsOrder;
    officeLicenseSelect.required = includesOffice && isWindowsOrder;
    officeLicenseSelect.disabled = !includesOffice || !isWindowsOrder;
    premiumAppsField.hidden = !isPremium;
    extraApps.disabled = !isPremium || !isWindowsOrder;
    updateAppsCounter();
  }

  function updateAppsCounter() {
    const apps = extraApps.value.split("\n").map((item) => item.trim()).filter(Boolean);
    appsCounter.textContent = `${apps.length}/5 aplikasi`;
    appsCounter.classList.toggle("is-over-limit", apps.length > 5);
    extraApps.setCustomValidity(apps.length > 5 ? "Maksimal 5 aplikasi. Hapus aplikasi yang berlebih." : "");
  }

  // Pilih layanan dari kartu lalu arahkan ke form pemesanan
  selectButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const chosenService = btn.getAttribute("data-service");
      if (chosenService && serviceSelect) {
        serviceSelect.value = chosenService;
        updateServiceFields();
      }
      const orderSection = document.getElementById("order");
      if (orderSection) orderSection.scrollIntoView({ behavior: "smooth" });
    });
  });

  serviceSelect.addEventListener("change", updateServiceFields);
  packageSelect.addEventListener("change", updatePackageFields);
  extraApps.addEventListener("input", updateAppsCounter);

  function buildSummary() {
    const nama = document.getElementById("clientName").value.trim();
    const nomor = document.getElementById("clientPhone").value.trim();
    const layanan = serviceSelect.value;
    const target = document.getElementById("deadline").value.trim() || "Menyesuaikan";
    const catatan = document.getElementById("notes").value.trim() || "-";
    const lines = [
      "Halo IDN-NET (@est2025), saya ingin memesan layanan:",
      `Nama: ${nama}`,
      `Nomor WhatsApp: ${nomor}`,
      `Layanan: ${layanan}`
    ];

    if (layanan === "Install Ulang Laptop") {
      const chosenPackage = packageSelect.value;
      const packageData = packages[chosenPackage];
      lines.push(
        `Paket: ${packageData.label}`,
        `Harga jasa: ${formatRupiah(packageData.price)}`,
        `Windows: ${document.getElementById("windowsVersion").value}`,
        `Perangkat: ${document.getElementById("deviceType").value}`,
        `Merek/tipe: ${document.getElementById("deviceModel").value.trim()}`,
        `Spesifikasi: ${document.getElementById("deviceSpecs").value.trim() || "Belum diinformasikan"}`
      );

      if (chosenPackage !== "Basic") {
        lines.push(
          `Microsoft Office: ${officeSelect.value}`,
          `Status lisensi Office: ${officeLicenseSelect.value}`
        );
      }
      if (chosenPackage === "Premium") {
        const requestedApps = extraApps.value.trim() || "Tidak ada request aplikasi tambahan";
        lines.push(`Request aplikasi tambahan (maks. 5):\n${requestedApps}`);
      }
      lines.push(`Backup data: ${document.getElementById("backupChoice").value}`);
      lines.push("Catatan lisensi: Lisensi/aktivasi Windows dan Office tidak termasuk biaya jasa.");
    } else {
      lines.push(`Detail kebutuhan: ${generalDetails.value.trim()}`);
    }

    lines.push(`Target waktu: ${target}`, `Catatan tambahan: ${catatan}`);
    lines.push("Mohon konfirmasi ketersediaan jadwal dan total biaya. Terima kasih.");
    return lines.join("\n");
  }

  function showSummary() {
    const message = buildSummary();
    summaryText.textContent = message;
    summaryOutput.hidden = false;
    return message;
  }

  orderForm.addEventListener("submit", (event) => {
    event.preventDefault();
    updateAppsCounter();
    if (!orderForm.reportValidity()) return;

    const message = showSummary();
    const waUrl = `https://wa.me/${ADMIN_WA_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  });

  if (copySummaryBtn) {
    copySummaryBtn.addEventListener("click", async () => {
      updateAppsCounter();
      if (!orderForm.reportValidity()) return;
      const message = showSummary();

      try {
        await navigator.clipboard.writeText(message);
        const originalLabel = copySummaryBtn.textContent;
        copySummaryBtn.textContent = "Tersalin";
        setTimeout(() => { copySummaryBtn.textContent = originalLabel; }, 1600);
      } catch {
        copySummaryBtn.textContent = "Ringkasan tampil di bawah";
        setTimeout(() => { copySummaryBtn.textContent = "Salin Ringkasan"; }, 1800);
      }
    });
  }

  updateServiceFields();

  // Animasi muncul saat di-scroll
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealItems.forEach((el) => observer.observe(el));
  } else {
    revealItems.forEach((el) => el.classList.add("is-visible"));
  }
});
