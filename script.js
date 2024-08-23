document.addEventListener("DOMContentLoaded", function () {
  const surahContainer = document
    .getElementById("surah-container")
    .querySelector("ul");
  const ayatContainer = document.getElementById("ayat-container");
  const surahTitle = document.getElementById("surah-title");
  const surahInfo = document.getElementById("surah-info");

  fetch("https://equran.id/api/v2/surat")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      if (data && data.data) {
        data.data.forEach((surah) => {
          const listItem = document.createElement("li");
          listItem.textContent = `${surah.nomor}. ${surah.namaLatin}`;
          listItem.addEventListener("click", () => {
            loadSurah(surah.nomor);
          });
          surahContainer.appendChild(listItem);
        });
      } else {
        surahContainer.innerHTML = "<li>Failed to load surah list.</li>";
      }
    })
    .catch((error) => {
      console.error("Error fetching the surah list:", error);
      surahContainer.innerHTML = "<li>Failed to load surah list.</li>";
    });

  function loadSurah(nomor) {
    fetch(`https://equran.id/api/v2/surat/${nomor}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        if (data && data.data) {
          const surahData = data.data;

          // Menampilkan informasi dasar surah
          surahTitle.textContent = surahData.namaLatin;
          surahInfo.innerHTML = `
                    <h2>${surahData.nama} (${surahData.namaLatin})</h2>
                    <p><strong>Jumlah Ayat:</strong> ${surahData.jumlahAyat}</p>
                    <p><strong>Tempat Turun:</strong> ${surahData.tempatTurun}</p>
                    <p><strong>Arti:</strong> ${surahData.arti}</p>
                    <p>${surahData.deskripsi}</p>
                    <h3>Full Audio</h3>
                    <audio controls>
                    <source src="${surahData.audioFull["05"]}" type="audio/mpeg">
                     Your browser does not support the audio element.
                    </audio>
                `;

          // Menampilkan ayat-ayat surah
          ayatContainer.innerHTML = "";
          data.data.ayat.forEach((ayat) => {
            const ayatDiv = document.createElement("div");
            ayatDiv.classList.add("ayat");
            ayatDiv.innerHTML = `
                            <h3>Ayat ${ayat.nomorAyat}</h3>
                            <p>${ayat.teksArab}</p>
                            <h4>${ayat.teksLatin}</h4>
                            <h5>${ayat.teksIndonesia}</h5>
                            <audio controls>
                            <source src="${ayat.audio["05"]}" type="audio/mpeg">
                            Your browser does not support the audio element.
                            </audio>
                        `;
            ayatContainer.appendChild(ayatDiv);
          });
          loadTafsir(nomor); // Memuat tafsir setelah ayat
        } else {
          ayatContainer.innerHTML = "<p>Failed to load surah.</p>";
        }
      })
      .catch((error) => {
        console.error("Error fetching the surah:", error);
        ayatContainer.innerHTML = "<p>Failed to load surah.</p>";
      });
  }

  function loadTafsir(nomor) {
    fetch(`https://equran.id/api/v2/tafsir/${nomor}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        if (data && data.data) {
          const tafsirContainer = document.createElement("div");
          tafsirContainer.classList.add("tafsir");
          tafsirContainer.innerHTML = `<h2>Tafsir Surah ${data.data.namaLatin}</h2>`;

          data.data.tafsir.forEach((tafsir) => {
            const tafsirDiv = document.createElement("div");
            tafsirDiv.innerHTML = `<h3>${tafsir.teks}</h3>`;
            tafsirContainer.appendChild(tafsirDiv);
          });

          ayatContainer.appendChild(tafsirContainer);
        } else {
          ayatContainer.innerHTML += "<p>Failed to load tafsir.</p>";
        }
      })
      .catch((error) => {
        console.error("Error fetching the tafsir:", error);
        ayatContainer.innerHTML += "<p>Failed to load tafsir.</p>";
      });
  }
});

// Menampilkan menu-icon surah di layar mobile
document.addEventListener("DOMContentLoaded", function () {
  const menuIcon = document.getElementById("menu-icon");
  const searchInput = document.getElementById("search-input");
  const surahContainer = document.getElementById("surah-container");
  const scrollToTopButton = document.getElementById("scroll-to-top");

  // Function to search surah
  searchInput.addEventListener("input", function () {
    const query = searchInput.value.toLowerCase();
    const surahList = surahContainer.querySelectorAll("li");

    surahList.forEach((surah) => {
      const surahName = surah.textContent.toLowerCase();
      if (surahName.includes(query)) {
        surah.style.display = "block";
      } else {
        surah.style.display = "none";
      }
    });
  });

  // Function to check if the screen is in responsive mode
  function isResponsiveMode() {
    return window.innerWidth <= 768;
  }

  // Toggle surah container visibility when menu icon is clicked
  menuIcon.addEventListener("click", function () {
    if (isResponsiveMode()) {
      if (
        surahContainer.style.display === "none" ||
        !surahContainer.style.display
      ) {
        surahContainer.style.display = "block";
      } else {
        surahContainer.style.display = "none";
      }
    }
  });

  // Hide surah container when a list item is clicked
  surahContainer.addEventListener("click", function (event) {
    if (isResponsiveMode() && event.target.tagName === "LI") {
      surahContainer.classList.remove("active");
      surahContainer.style.display = "none";
    }
  });

  // Show or hide the scroll-to-top button based on scroll position
  window.addEventListener("scroll", function () {
    if (window.scrollY > 300) {
      scrollToTopButton.style.display = "block";
    } else {
      scrollToTopButton.style.display = "none";
    }
  });

  // Scroll to the top when the scroll-to-top button is clicked
  scrollToTopButton.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
});
