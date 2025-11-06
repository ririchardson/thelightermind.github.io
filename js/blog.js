const API_KEY = "AIzaSyC0k6g76VR4dwMcJqaDCOaEy7_WOKybDQ0";
const SHEET_ID = "1QcGQ-zTSDJHH_e-7uC286Y4rm69YNEYEq5zdix6BrOU";
const RANGE = "Sheet1"; // Adjust to your sheet name & range

const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;

fetch(url)
  .then(res => res.json())
  .then(data => {
    const rows = data.values;
    if (!rows) return console.error("No data found.");

    // Transpose rows into columns (each column = one post)
    const posts = rows[0].map((_, colIndex) => rows.map(row => row[colIndex]));

    const container = document.querySelector("#wrapper main");

    posts.forEach(col => {
      const post = document.createElement("div");
      post.classList.add("whole");

      let pendingColor = null; // holds color for the next text/paragraph

      col.forEach(line => {
        if (!line) return;
        const [tag, ...rest] = line.split(":");
        const value = rest.join(":").trim();
        if (!tag || !value) return;

        switch (tag.trim().toLowerCase()) {
          case "title":
            post.innerHTML += `<h1>${value}</h1>`;
            break;

          case "header":
            post.innerHTML += `<h2 style="text-align:center;">${value}</h2>`;
            break;

          case "paragraph": {
            let style = "";
            if (pendingColor) {
              style = `style="color:${pendingColor};"`;
              pendingColor = null;
            }
            post.innerHTML += `<p class="indent" ${style}>${value}</p>`;
            break;
          }

          case "text": {
            let style = "";
            if (pendingColor) {
              style = `style="color:${pendingColor};"`;
              pendingColor = null;
            }
            post.innerHTML += `<p ${style}>${value}</p>`;
            break;
          }

          case "color": {
            // Allow formats like color:#fff, color:red, or color:0,100,255
            let colorValue = value;
            if (/^\d{1,3},\d{1,3},\d{1,3}$/.test(value)) {
              const [r, g, b] = value.split(",").map(Number);
              colorValue = `rgb(${r}, ${g}, ${b})`;
            }
            pendingColor = colorValue;
            break;
          }

          case "image":
            post.innerHTML += `<img src="${value}" alt="">`;
            break;

          case "video": {
            let videoHTML = "";
            const ytMatch = value.match(
              /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/
            );

            if (ytMatch) {
              const videoId = ytMatch[1];
              const embedUrl = `https://www.youtube.com/embed/${videoId}`;
              videoHTML = `
                <div class="video-container" style="position:relative; padding-bottom:56.25%; height:0; overflow:hidden;">
                  <iframe
                    src="${embedUrl}"
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen>
                  </iframe>
                </div>`;
            } else {
              videoHTML = `
                <video controls style="max-width:100%; border-radius:12px;">
                  <source src="${value}" type="video/mp4">
                  Your browser does not support the video tag.
                </video>`;
            }

            post.innerHTML += videoHTML;
            break;
          }

          default:
            post.innerHTML += `<p><strong>${tag}:</strong> ${value}</p>`;
        }
      });

      container.appendChild(post);
      window.observeFadeElements();
    });
  })
  .catch(err => console.error("Error fetching sheet:", err));