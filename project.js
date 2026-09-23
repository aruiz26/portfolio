async function loadProject() {
  const container = document.getElementById("project-detail");

  const params = new URLSearchParams(window.location.search);
  const projectId = params.get("id");

  if (!projectId) {
    container.innerHTML = `<p class="empty-state">No project specified.</p>`;
    return;
  }

  try {
    const response = await fetch("data/projects.json");
    if (!response.ok) throw new Error("Failed to load projects.json");
    const data = await response.json();

    const project = data.projects.find(p => p.id === projectId && !p.hidden);
    if (!project) {
      container.innerHTML = `<p class="empty-state">No project found with id "${escapeHtml(projectId)}".</p>`;
      return;
    }

    document.title = `${project.title} — My Engineering Portfolio`;
    renderProject(project);
  } catch (err) {
    container.innerHTML = `<p class="empty-state">Couldn't load project data. If you're viewing this file directly (file:// in the address bar), start a local server instead — see the README.</p>`;
    console.error(err);
  }
}

function renderProject(project) {
  const container = document.getElementById("project-detail");
  container.innerHTML = "";

  if (project.image) {
    const img = document.createElement("img");
    img.className = "project-detail-image";
    img.src = project.image;
    img.alt = project.title;
    container.appendChild(img);
  }

  const header = document.createElement("div");
  header.className = "project-header";
  header.innerHTML = `
    <h1 class="project-title">${escapeHtml(project.title)}</h1>
    <span class="project-date">${escapeHtml(formatDate(project.date))}</span>
  `;
  container.appendChild(header);

  // Longer write-up: falls back to the short summary if "details" isn't set.
  const detailsText = project.details || project.summary;
  const detailsWrapper = document.createElement("div");
  detailsWrapper.className = "project-details";
  detailsText.split("\n\n").forEach(paragraph => {
    const p = document.createElement("p");
    p.textContent = paragraph;
    detailsWrapper.appendChild(p);
  });
  container.appendChild(detailsWrapper);

  const subheading = document.createElement("h2");
  subheading.className = "subsections-heading";
  subheading.textContent = "Breakdown";
  container.appendChild(subheading);

  project.subsections.forEach(sub => {
    container.appendChild(renderSubsection(sub));
  });
}

loadProject();