
/* NASA SPACE EXPLORER */

// Set up date inputs
const startInput = document.getElementById("startDate");
const endInput = document.getElementById("endDate");

setupDateInputs(startInput, endInput);

// Get page elements
const gallery = document.getElementById("gallery");
const getImagesBtn = document.getElementById("getImagesBtn");
const modal = document.getElementById("imageModal");
const closeModalBtn = document.getElementById("closeModal");

// LEVELUP: RANDOM SPACE FACTS
const spaceFacts = [
  "One day on Venus is longer than one year on Venus!",
  "The Sun contains about 99.8% of our solar system's mass.",
  "Jupiter is the largest planet in our solar system.",
  "Sunlight takes about 8 minutes to reach Earth.",
  "Neptune has some of the fastest winds in our solar system.",
  "The Moon is slowly moving away from Earth.",
  "Mars has the tallest known volcano in our solar system.",
  "Saturn is famous for its beautiful rings."
];

const randomIndex = Math.floor(
  Math.random() * spaceFacts.length
);

document.getElementById("randomFact").textContent =
  spaceFacts[randomIndex];

// FETCH NASA DATA
async function getSpaceImages() {
  const startDate = startInput.value;
  const endDate = endInput.value;

  if (!startDate || !endDate || startDate > endDate) {
    gallery.textContent = "Please select a valid date range.";
    return;
  }

  gallery.textContent = "Loading NASA images...";
  getImagesBtn.disabled = true;

  // NASA's updated APOD API
  const apiUrl =
    `https://science.nasa.gov/wp-json/wp/v2/apod-basic?start_date=${startDate}&end_date=${endDate}`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(
        `NASA API error: ${response.status}`
      );
    }

    const data = await response.json();

    console.log("NASA API RESPONSE:", data);

    if (data.error || data.code) {
      throw new Error("NASA returned an API error.");
    }

    displayGallery(data);

  } catch (error) {
    console.error("NASA API ERROR:", error);

    gallery.textContent =
      "Sorry, we couldn't load the space images. Please try again.";

  } finally {
    getImagesBtn.disabled = false;
  }
}

// DISPLAY NASA GALLERY
function displayGallery(data) {
  gallery.innerHTML = "";

  const entries = Array.isArray(data) ? data : [data];

  entries.forEach((item) => {
    if (!item || !item.media_type) return;

    const card = document.createElement("div");
    card.className = "gallery-item";

    const title = document.createElement("h3");
    title.textContent = item.title || "NASA Space";

    const date = document.createElement("p");
    date.textContent = item.date || "";

    if (item.media_type === "image") {
      const image = document.createElement("img");

      // NASA now provides the actual image in hdurl
      image.src = item.hdurl;
      image.alt = item.alt || item.title || "NASA Image";
      image.loading = "lazy";

      if (!item.hdurl) return;

      card.appendChild(image);
      card.appendChild(title);
      card.appendChild(date);

      card.tabIndex = 0;
      card.setAttribute("role", "button");

      card.addEventListener("click", () => {
        openModal(item);
      });

      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openModal(item);
        }
      });

    } else if (
      item.media_type === "video" ||
      item.media_type === "iframe"
    ) {
      // LEVELUP: HANDLE NASA VIDEOS
      if (item.hdurl) {
        const thumbnail = document.createElement("img");
        thumbnail.src = item.hdurl;
        thumbnail.alt = item.title || "NASA Video";
        thumbnail.loading = "lazy";
        card.appendChild(thumbnail);
      }

      const videoText = document.createElement("p");
      videoText.textContent = "🎬 NASA Space Video";

      const videoLink = document.createElement("a");
      videoLink.href = item.permalink || item.url;
      videoLink.textContent = "Watch NASA Video";
      videoLink.target = "_blank";
      videoLink.rel = "noopener noreferrer";

      card.appendChild(videoText);
      card.appendChild(title);
      card.appendChild(date);

      if (videoLink.href) {
        card.appendChild(videoLink);
      }
    }

    if (card.children.length > 0) {
      gallery.appendChild(card);
    }
  });

  if (!gallery.children.length) {
    gallery.textContent =
      "No space images found for these dates.";
  }
}

// OPEN MODAL WINDOW
function openModal(item) {
  document.getElementById("modalTitle").textContent =
    item.title || "NASA Space";

  document.getElementById("modalDate").textContent =
    item.date || "";

const explanationElement =
  document.getElementById("modalExplanation");

const explanationHTML = item.explanation || "";

const explanationDocument =
  new DOMParser().parseFromString(
    explanationHTML,
    "text/html"
  );

explanationElement.textContent =
  explanationDocument.body.textContent.trim() ||
  "No description available.";

  const modalImage = document.getElementById("modalImage");

  modalImage.src = item.hdurl;
  modalImage.alt = item.alt || item.title || "NASA Image";

  modal.hidden = false;
  closeModalBtn.focus();
}

// CLOSE MODAL WINDOW
function closeModal() {
  modal.hidden = true;
}

closeModalBtn.addEventListener("click", closeModal);

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modal.hidden) {
    closeModal();
  }
});

// GET IMAGES BUTTON
getImagesBtn.addEventListener("click", getSpaceImages);
