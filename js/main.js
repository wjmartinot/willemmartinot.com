(() => {
  const header = document.querySelector("[data-site-header]");
  if (header) {
    const path = window.location.pathname.replace(/\/$/, "") || "/";
    const isFilms =
      path === "/" || path === "/index.html" || path.startsWith("/films");
    const isPhoto = path.startsWith("/photo");
    const isAbout = path.startsWith("/about");
    const isContact = path.startsWith("/contact");

    header.innerHTML = `
      <nav aria-label="Primary">
        <ul class="nav">
          <li><a href="/" ${isFilms ? 'aria-current="page"' : ""}>Films</a></li>
          <li><a href="/photo/" ${isPhoto ? 'aria-current="page"' : ""}>Photo</a></li>
          <li><a href="/about/" ${isAbout ? 'aria-current="page"' : ""}>About</a></li>
          <li><a href="/contact/" ${isContact ? 'aria-current="page"' : ""}>Contact</a></li>
        </ul>
      </nav>
      <a class="brand" href="/" aria-label="Willem Martinot home">
        <span class="brand__name">Willem Martinot</span>
        <span class="brand__title">Photographer</span>
      </a>
    `;
  }

  const heroVideo = document.querySelector(".hero__media video");
  if (heroVideo) {
    const markReady = () => heroVideo.classList.add("is-ready");
    if (heroVideo.readyState >= 2) markReady();
    heroVideo.addEventListener("loadeddata", markReady);
    heroVideo.addEventListener("error", () => {
      heroVideo.style.display = "none";
    });
    heroVideo.play?.().catch(() => {});
  }

  const scrollBtn = document.querySelector("[data-scroll-to]");
  if (scrollBtn) {
    scrollBtn.addEventListener("click", () => {
      const target = document.querySelector(scrollBtn.getAttribute("data-scroll-to"));
      target?.scrollIntoView({ behavior: "smooth" });
    });
  }

  const tiles = document.querySelectorAll(".film-tile");
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  tiles.forEach((tile) => {
    const video = tile.querySelector("video");

    const startPreview = () => {
      tile.classList.add("is-previewing");
      if (!video) return;
      const source = video.querySelector("source");
      if (!source?.getAttribute("src")) return;
      const reveal = () => video.classList.add("is-ready");
      video.addEventListener("loadeddata", reveal, { once: true });
      video.currentTime = 0;
      video.play?.().then(reveal).catch(() => {
        video.classList.remove("is-ready");
      });
    };

    const stopPreview = () => {
      tile.classList.remove("is-previewing");
      if (!video) return;
      video.pause?.();
      video.currentTime = 0;
    };

    if (canHover) {
      tile.addEventListener("mouseenter", startPreview);
      tile.addEventListener("mouseleave", stopPreview);
      tile.addEventListener("focusin", startPreview);
      tile.addEventListener("focusout", stopPreview);
    } else {
      tile.addEventListener("click", (e) => {
        if (!tile.classList.contains("is-previewing") && video?.querySelector("source")?.src) {
          e.preventDefault();
          tiles.forEach((t) => {
            t.classList.remove("is-previewing");
            t.querySelector("video")?.pause?.();
          });
          startPreview();
        }
      });
    }
  });

  const lightbox = document.getElementById("lightbox");
  if (lightbox) {
    const lightboxImg = lightbox.querySelector("img");
    const items = Array.from(document.querySelectorAll(".fashion-masonry__item img"));
    let current = 0;

    function show(i) {
      current = i;
      const img = items[current];
      lightboxImg.src = img.currentSrc || img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add("active");
    }

    items.forEach((img, i) => {
      img.addEventListener("click", () => show(i));
    });

    lightbox.addEventListener("click", () => lightbox.classList.remove("active"));

    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("active")) return;
      if (e.key === "Escape") lightbox.classList.remove("active");
      if (e.key === "ArrowRight") show((current + 1) % items.length);
      if (e.key === "ArrowLeft") show((current - 1 + items.length) % items.length);
    });
  }
})();
