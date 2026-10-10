
const API_URL = "https://jsonplaceholder.typicode.com/users";

const loadButton = document.querySelector("#load-users");
const filterInput = document.querySelector("#filter-input");
const statusText = document.querySelector("#status");
const usersList = document.querySelector("#users-list");

let allUsers = [];

function renderUsers(users) {
  usersList.innerHTML = "";

  users.forEach((user) => {
    const li = document.createElement("li");

    const name = document.createElement("h2");
    name.textContent = user.name;

    const email = document.createElement("p");
    email.textContent = `Email: ${user.email}`;

    const city = document.createElement("p");
    city.textContent = `City: ${user.address.city}`;

    const company = document.createElement("p");
    company.textContent = `Company: ${user.company.name}`;

    li.appendChild(name);
    li.appendChild(email);
    li.appendChild(city);
    li.appendChild(company);

    usersList.appendChild(li);
  });

  if (users.length === 0) {
    statusText.textContent = "No users match your filter.";
  } else {
    statusText.textContent = `Showing ${users.length} users.`;
  }
}

async function loadUsers() {
  statusText.textContent = "Loading users...";
  loadButton.disabled = true;
  usersList.innerHTML = "";

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Status ${response.status}`);
    }

    const users = await response.json();

    allUsers = users;

    renderUsers(allUsers);
    statusText.textContent = `Loaded ${allUsers.length} users.`;
  } catch (error) {
    allUsers = [];
    usersList.innerHTML = "";
    statusText.textContent =
      "Could not load users. Please try again.";

    console.error(error);
  } finally {
    loadButton.disabled = false;
  }
}

loadButton.addEventListener("click", loadUsers);

filterInput.addEventListener("input", () => {
  const searchText = filterInput.value.trim().toLowerCase();

  const filteredUsers = allUsers.filter((user) =>
    user.name.toLowerCase().includes(searchText)
  );

  renderUsers(filteredUsers);
});
