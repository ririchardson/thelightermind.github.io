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

    posts.forEach((col, i) => {
      const post = document.createElement("div");
      post.classList.add("whole");

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
            post.innerHTML += `<h2>${value}</h2>`;
            break;
          case "paragraph":
            post.innerHTML += `<p>${value}</p>`;
            break;
          case "image":
            post.innerHTML += `<img src="${value}" alt="">`;
            break;
          case "quote":
            post.innerHTML += `<blockquote>${value}</blockquote>`;
            break;
          default:
            // any unrecognized tag → span with tag name
            post.innerHTML += `<p><strong>${tag}:</strong> ${value}</p>`;
        }
      });

      container.appendChild(post);

      window.observeFadeElements(); // reapply fade observer
    });
  })
  .catch(err => console.error("Error fetching sheet:", err));