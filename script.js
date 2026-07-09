const searchBtn = document.getElementById("searchBtn");
const gitAccountName = document.getElementById("gitAccountName");

const profile = document.getElementById("profile");
const repoContainer = document.getElementById("repoContainer");

async function getGitHubData() {
  const username = gitAccountName.value.trim();
  if (!username) {
    alert("Enter a GitHub username");
    return;
  }

  profile.innerHTML = "";
  repoContainer.innerHTML = `
    <div class="loading">
      Loading...
    </div>
  `;

  try {
    const userResponse = await fetch(
      `https://api.github.com/users/${username}`,
    );

    if (!userResponse.ok) {
      throw new Error("User not found");
    }

    const user = await userResponse.json();
    const repoResponse = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100`,
    );

    const repos = await repoResponse.json();
    displayUser(user);

    displayRepos(repos);
  } catch (error) {
    profile.innerHTML = "";
    repoContainer.innerHTML = `
      <div class="error">
        ${error.message}
      </div>
    `;
  }
}

function displayUser(user) {
  profile.style.display = "block";
  profile.innerHTML = `
  <div class="profile-card">

    <img 
      src="${user.avatar_url}"
      alt="${user.login}"
    >


    <div class="profile-info">
      <p>
      📍 ${user.location || "Location not specified"}
      </p>

      <p>
      🏢 ${user.company || "No company listed"}
      </p>

      <p>
      🔗 ${user.blog || "No website"}
      </p>


      <a 
        href="${user.html_url}"
        target="_blank"
        class="github-btn"
      >
        Visit GitHub Profile
      </a>


      <div class="stats">

        <span>
        Followers: ${user.followers}
        </span>

        <span>
        Following: ${user.following}
        </span>

        <span>
        Repos: ${user.public_repos}
        </span>

      </div>
    </div>
  </div>
  `;
}

function displayRepos(repos) {
  repoContainer.innerHTML = "";
  const sortedRepos = [...repos].sort(
    (a, b) => b.stargazers_count - a.stargazers_count,
  );

  sortedRepos.forEach((repo) => {
    repoContainer.innerHTML += `
    <div class="cards">

      <h3>
      ${repo.name}
      </h3>

      <p class="repo-description">
      ${repo.description || "No description"}
      </p>

      <div class="repo-details">

        <span>
        ⭐ ${repo.stargazers_count}
        </span>

        <span class="language">
        ${repo.language || "Unknown"}
        </span>
      </div>

      <a
      href="${repo.html_url}"
      target="_blank"
      >
      View Repository
      </a>
    </div>
    `;
  });
}

searchBtn.addEventListener("click", getGitHubData);

gitAccountName.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    getGitHubData();
  }
});
