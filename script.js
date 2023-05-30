const form = document.getElementById('githubForm');
const usernameInput = document.getElementById('usernameInput');
const userInfo = document.getElementById('userInfo');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = usernameInput.value.trim();
  if (username !== '') {
    getUserDetails(username);
  }
});

function getUserDetails(username) {
  const apiUrl = `https://api.github.com/users/${username}`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      if (data.message === "Not Found") {
        showErrorMessage("User not found");
      } else {
        displayUserDetails(data);
        getRepositories(username);
      }
    })
    .catch(error => {
      console.error("Error:", error);
      showErrorMessage("An error occurred");
    });
}

function displayUserDetails(user) {
  const name = user.name ? user.name : 'N/A';
  const bio = user.bio ? user.bio : 'No bio available';
  const avatarUrl = user.avatar_url ? user.avatar_url : '';
  const repoCount = user.public_repos ? user.public_repos : 0;

  const userDetailsHTML = `
    <div class="user-info">
      <div class="avatar">
        <img src="${avatarUrl}" alt="Avatar">
      </div>
      <div class="details">
        <h2>${name}</h2>
        <p class="bio">${bio}</p>
        <p>Username: ${user.login}</p>
        <p>Repositories: ${repoCount}</p>
        <p>Followers: ${user.followers}</p>
        <p><a href="${user.html_url}" target="_blank">View Profile</a></p>
      </div>
    </div>
    <div class="repo-list">
      <h3>Repositories:(Click to Open)</h3>
      <ul id="repoList"></ul>
    </div>
  `;
  userInfo.innerHTML = userDetailsHTML;
}

function getRepositories(username) {
  const apiUrl = `https://api.github.com/users/${username}/repos`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const repoList = document.getElementById('repoList');
      repoList.innerHTML = '';

      if (data.length === 0) {
        repoList.innerHTML = '<li>No repositories found</li>';
      } else {
        data.forEach(repo => {
          const listItem = document.createElement('li');
          const repoLink = document.createElement('a');
          repoLink.href = repo.html_url;
          repoLink.textContent = repo.name;
          repoLink.target = '_blank';
          listItem.appendChild(repoLink);
          repoList.appendChild(listItem);
        });
      }
    })
    .catch(error => {
      console.error("Error:", error);
      const repoList = document.getElementById('repoList');
      repoList.innerHTML = '<li>Error loading repositories</li>';
    });
}

function showErrorMessage(message) {
  const errorHTML = `<p class="error">${message}</p>`;
  userInfo.innerHTML = errorHTML;
}
