// Shared helpers used by both script.js (main page) and project.js (detail page)

function formatDate(dateStr) {
  // Expects "YYYY-MM" or "YYYY-MM-DD"
  const parts = dateStr.split("-");
  const year = parts[0];
  const monthIndex = parseInt(parts[1], 10) - 1;
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                       "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return monthNames[monthIndex] ? `${monthNames[monthIndex]} ${year}` : dateStr;
}

function formatTagLabel(tag) {
  return tag
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function renderSubsection(sub) {
  const wrapper = document.createElement("div");
  wrapper.className = "subsection";

  const title = document.createElement("h3");
  title.className = "subsection-title";
  title.textContent = sub.title;
  wrapper.appendChild(title);

  const description = document.createElement("p");
  description.className = "subsection-description";
  description.textContent = sub.description;
  wrapper.appendChild(description);

  const badges = document.createElement("div");
  badges.className = "tag-badges";
  sub.tags.forEach(tag => {
    const badge = document.createElement("span");
    badge.className = "tag-badge";
    badge.textContent = formatTagLabel(tag);
    badges.appendChild(badge);
  });
  wrapper.appendChild(badges);

  return wrapper;
}