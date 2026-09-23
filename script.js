// ---------- State ----------
let allProjects = [];
let activeTag = "all";

// ---------- Load data ----------
async function loadProjects() {
  const app = document.getElementById("app");
  try {
    const response = await fetch("data/projects.json");
    if (!response.ok) throw new Error("Failed to load projects.json");
    const data = await response.json();

    // Sort newest first by date (expects "YYYY-MM" or "YYYY-MM-DD" strings)
    allProjects = data.projects.sort((a, b) => (a.date < b.date ? 1 : -1));

    buildTagNav(allProjects);
    render();
  } catch (err) {
    app.innerHTML = `<p class="empty-state">Couldn't load project data. If you're viewing this file directly (double-clicked, file:// in the address bar), start a local server instead — see the README.</p>`;
    console.error(err);
  }
}

// ---------- Build the tag nav bar from whatever tags appear in the data ----------
function buildTagNav(projects) {
  const tagSet = new Set();
  projects.forEach(project => {
    project.subsections.forEach(sub => {
      sub.tags.forEach(tag => tagSet.add(tag));
    });
  });

  const nav = document.getElementById("tag-nav");
  nav.innerHTML = "";

  const allButton = createTagButton("all", "All projects");
  nav.appendChild(allButton);

  Array.from(tagSet).sort().forEach(tag => {
    nav.appendChild(createTagButton(tag, formatTagLabel(tag)));
  });
}

function createTagButton(tag, label) {
  const button = document.createElement("button");
  button.className = "tag-button" + (tag === activeTag ? " active" : "");
  button.textContent = label;
  button.dataset.tag = tag;
  button.addEventListener("click", () => {
    activeTag = tag;
    updateActiveButton();
    render();
  });
  return button;
}

function updateActiveButton() {
  document.querySelectorAll(".tag-button").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.tag === activeTag);
  });
}

function formatTagLabel(tag) {
  return tag
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// ---------- Render the main content area ----------
function render() {
  const app = document.getElementById("app");
  app.innerHTML = "";

  const projectsToShow = activeTag === "all"
    ? allProjects
    : allProjects
        .map(project => ({
          ...project,
          subsections: project.subsections.filter(sub => sub.tags.includes(activeTag))
        }))
        .filter(project => project.subsections.length > 0);

  if (projectsToShow.length === 0) {
    app.innerHTML = `<p class="empty-state">No projects have a subsection tagged "${formatTagLabel(activeTag)}" yet.</p>`;
    return;
  }

  projectsToShow.forEach(project => {
    app.appendChild(renderProjectCard(project));
  });
}

function renderProjectCard(project) {
  const card = document.createElement("article");
  card.className = "project";

  const header = document.createElement("div");
  header.className = "project-header";
  header.innerHTML = `
    <h2 class="project-title">${escapeHtml(project.title)}</h2>
    <span class="project-date">${escapeHtml(formatDate(project.date))}</span>
  `;
  card.appendChild(header);

  const summary = document.createElement("p");
  summary.className = "project-summary";
  summary.textContent = project.summary;
  card.appendChild(summary);

  project.subsections.forEach(sub => {
    card.appendChild(renderSubsection(sub));
  });

  return card;
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

// ---------- Helpers ----------
function formatDate(dateStr) {
  // Expects "YYYY-MM" or "YYYY-MM-DD"
  const parts = dateStr.split("-");
  const year = parts[0];
  const monthIndex = parseInt(parts[1], 10) - 1;
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                       "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return monthNames[monthIndex] ? `${monthNames[monthIndex]} ${year}` : dateStr;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ---------- Start ----------
loadProjects();