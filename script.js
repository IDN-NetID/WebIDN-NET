document.addEventListener("DOMContentLoaded", () => {
  const ADMIN_WA_NUMBER = "62882005161406";
  const $ = (id) => document.getElementById(id);

  const navToggle = $("navToggle");
  const navLinks = $("navLinks");
  const serviceSelect = $("serviceType");
  const orderForm = $("orderForm");
  const summaryOutput = $("summaryOutput");
  const summaryText = $("summaryText");
  const copySummaryBtn = $("copySummaryBtn");
  const windowsFields = $("windowsFields");
  const generalServiceFields = $("generalServiceFields");
  const packageSelect = $("packageType");
  const packageInfo = $("packageInfo");
  const officeField = $("officeField");
  const officeSelect = $("officeVersion");
  const officeLicenseSelect = $("officeLicense");
  const premiumAppsField = $("premiumAppsField");
  const extraApps = $("extraApps");
  const appsCounter = $("appsCounter");
  const licenseConsentRow = $("licenseConsentRow");
  const licenseConsent = $("licenseConsent");
  const generalDetails = $("generalDetails");

  const packages = {
    Basic: {
      price: 100000,
      label: "Paket Basic",
      subtitle: "Instalasi Dasar",
      features: [
        "Install ulang Windows 10/11",
        "Install driver perangkat",
        "Windows Update",
        "Pengaturan dasar Windows",
        "Pengecekan fungsi perangkat",
        "Pembersihan file sementara"
      ]
    },
    Standard: {
      price: 135000,
      label: "Paket Standard",
      subtitle: "Windows + Office",
      features: [
        "Semua layanan Paket Basic",
        "Install Microsoft Office 2019/2021 jika lisensi tersedia",
        "Google Chrome dan PDF Reader",
        "WinRAR / 7-Zip",
        "Konfigurasi aplikasi dasar"
      ]
    },
    Premium: {
      price: 175000,
      label: "Paket Premium",
      subtitle: "Full Service",
      features: [
        "Semua layanan Paket Standard",
        "Request maksimal 5 aplikasi tambahan",
        "Optimasi Windows",
        "Pengaturan tampilan dan sistem",
        "Pengecekan menyeluruh",
        "Konsultasi penggunaan"
      ]
    }
  };

  const formatRupiah = (amount) => new Intl.NumberFormat("id-ID", {
    style: "currency", currency: "IDR", maximumFractionDigits: 0
  }).format(amount);

  const value = (id, fallback = "Tidak diisi") => {
    const el = $(id);
    if (!el) return fallback;
    const result = typeof el.value === "string" ? el.value.trim() : "";
    return result || fallback;
  };

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
    navLinks.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
      navLinks.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }));
  }

  function updateAppsCounter() {
    if (!extraApps || !appsCounter) return;
    const apps = extraApps.value.split("\n").map((item) => item.trim()).filter(Boolean);
    appsCounter.textContent = `${apps.length}/5 aplikasi`;
    appsCounter.classList.toggle("is-over-limit", apps.length > 5);
    extraApps.setCustomValidity(apps.length > 5 ? "Maksimal 5 aplikasi. Hapus aplikasi yang berlebih." : "");
  }

  function updatePackageFields() {
    if (!packageSelect || !packageInfo) return;
    const selectedPackage = packageSelect.value;
    const packageData = packages[selectedPackage] || packages.Basic;
    const isWindowsOrder = serviceSelect.value === "Install Ulang Laptop";
    const includesOffice = selectedPackage === "Standard" || selectedPackage === "Premium";
    const isPremium = selectedPackage === "Premium";

    // Selalu render ulang spesifikasi berdasarkan nilai dropdown TERKINI.
    packageInfo.replaceChildren();
    const heading = document.createElement("strong");
    heading.textContent = `${packageData.label} — ${formatRupiah(packageData.price)} (${packageData.subtitle})`;
    const list = document.createElement("ul");
    packageData.features.forEach((feature) => {
      const item = document.createElement("li");
      item.textContent = feature;
      list.appendChild(item);
    });
    packageInfo.append(heading, list);

    officeField.hidden = !includesOffice || !isWindowsOrder;
    officeSelect.required = includesOffice && isWindowsOrder;
    officeSelect.disabled = !includesOffice || !isWindowsOrder;
    officeLicenseSelect.required = includesOffice && isWindowsOrder;
    officeLicenseSelect.disabled = !includesOffice || !isWindowsOrder;

    premiumAppsField.hidden = !isPremium || !isWindowsOrder;
    extraApps.disabled = !isPremium || !isWindowsOrder;
    extraApps.required = isPremium && isWindowsOrder;
    updateAppsCounter();
  }

  function updateServiceFields() {
    const isWindowsOrder = serviceSelect.value === "Install Ulang Laptop";
    windowsFields.hidden = !isWindowsOrder;
    generalServiceFields.hidden = isWindowsOrder;
    windowsFields.querySelectorAll("input, select, textarea").forEach((control) => {
      if (control === licenseConsent) return;
      control.disabled = !isWindowsOrder ||
        ((control === officeSelect || control === officeLicenseSelect) && !(packageSelect.value === "Standard" || packageSelect.value === "Premium")) ||
        (control === extraApps && packageSelect.value !== "Premium");
    });
    licenseConsentRow.hidden = !isWindowsOrder;
    licenseConsent.required = isWindowsOrder;
    licenseConsent.disabled = !isWindowsOrder;
    generalDetails.required = !isWindowsOrder;
    generalDetails.disabled = isWindowsOrder;
    updatePackageFields();
  }

  document.querySelectorAll(".select-service").forEach((button) => {
    button.addEventListener("click", () => {
      const chosenService = button.getAttribute("data-service");
      if (chosenService) {
        serviceSelect.value = chosenService;
        updateServiceFields();
      }
      $("order")?.scrollIntoView({ behavior: "smooth" });
    });
  });

  serviceSelect.addEventListener("change", updateServiceFields);
  // Delegasi change menjaga dropdown tetap terpantau jika markup diubah.
  orderForm.addEventListener("change", (event) => {
    if (event.target === packageSelect) updatePackageFields();
  });
  extraApps.addEventListener("input", updateAppsCounter);

  function buildSummary() {
    const lines = [
      "HALO IDN-NET (@est2025), SAYA INGIN MEMESAN LAYANAN",
      "================================",
      `Nama lengkap: ${value("clientName")}`,
      `Jenis layanan: ${serviceSelect.value}`
    ];

    if (serviceSelect.value === "Install Ulang Laptop") {
      const chosenPackage = packageSelect.value;
      const packageData = packages[chosenPackage] || packages.Basic;
      lines.push(
        "", "DETAIL PESANAN INSTALL ULANG WINDOWS",
        `Paket dipilih: ${packageData.label}`,
        `Harga jasa paket: ${formatRupiah(packageData.price)}`,
        `Spesifikasi paket: ${packageData.features.join("; ")}`,
        `Windows yang diinginkan: ${value("windowsVersion")}`,
        `Jenis perangkat: ${value("deviceType")}`,
        `Merek dan tipe perangkat: ${value("deviceModel")}`,
        `Spesifikasi perangkat: ${value("deviceSpecs", "Tidak diinformasikan")}`
      );
      if (chosenPackage === "Standard" || chosenPackage === "Premium") {
        lines.push(
          `Microsoft Office yang diminta: ${value("officeVersion")}`,
          `Status lisensi Office: ${value("officeLicense")}`
        );
      } else {
        lines.push("Microsoft Office: Tidak termasuk Paket Basic");
      }
      if (chosenPackage === "Premium") {
        lines.push(`Request aplikasi tambahan (maks. 5):\n${value("extraApps", "Tidak ada aplikasi yang diminta")}`);
      } else {
        lines.push("Request aplikasi tambahan: Tidak termasuk paket yang dipilih");
      }
      lines.push(
        `Backup data: ${value("backupChoice")}`,
        `Persetujuan ketentuan lisensi: ${licenseConsent.checked ? "Ya, saya memahami dan menyetujui" : "Belum disetujui"}`,
        "Catatan lisensi: Biaya paket adalah jasa instalasi. Lisensi/aktivasi Windows dan Office tidak termasuk dan harus menggunakan lisensi resmi pelanggan."
      );
    } else {
      lines.push("", "DETAIL KEBUTUHAN", `Detail: ${value("generalDetails")}`);
    }

    lines.push(
      "", "INFORMASI TAMBAHAN",
      `Target waktu pengerjaan: ${value("deadline", "Menyesuaikan")}`,
      `Catatan tambahan: ${value("notes", "Tidak ada")}`,
      "================================",
      "Mohon konfirmasi jadwal pengerjaan dan total biaya. Terima kasih."
    );
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
    updatePackageFields();
    if (!orderForm.reportValidity()) return;
    const message = showSummary();
    const waUrl = `https://wa.me/${ADMIN_WA_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  });

  if (copySummaryBtn) {
    copySummaryBtn.addEventListener("click", async () => {
      updateAppsCounter();
      updatePackageFields();
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
