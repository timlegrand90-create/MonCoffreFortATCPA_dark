const MASTER_PIN = "1234";

const loginScreen = document.getElementById("login-screen");
const vaultScreen = document.getElementById("vault-screen");
const loginForm = document.getElementById("login-form");
const pinInput = document.getElementById("pin");
const loginError = document.getElementById("login-error");

const logoutBtn = document.getElementById("logout-btn");

const itemForm = document.getElementById("item-form");
const labelInput = document.getElementById("label");
const loginInput = document.getElementById("login");
const passwordInput = document.getElementById("password");
const notesInput = document.getElementById("notes");
const itemsTableBody = document.getElementById("items-table-body");

const STORAGE_KEY = "coffreFortItems_ATCPA";

function loadItems() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try { return JSON.parse(raw); }
    catch { return []; }
}

function saveItems(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function renderItems() {
    const items = loadItems();
    itemsTableBody.innerHTML = "";

    if (items.length === 0) {
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.colSpan = 5;
        td.textContent = "Aucune entrée.";
        td.style.textAlign = "center";
        td.style.color = "#6b7280";
        tr.appendChild(td);
        itemsTableBody.appendChild(tr);
        return;
    }

    items.forEach((item, index) => {
        const tr = document.createElement("tr");

        const tdLabel = document.createElement("td");
        tdLabel.textContent = item.label;

        const tdLogin = document.createElement("td");
        tdLogin.textContent = item.login;

        const tdPassword = document.createElement("td");
        tdPassword.textContent = item.password;

        const tdNotes = document.createElement("td");
        tdNotes.textContent = item.notes;

        const tdActions = document.createElement("td");
        const actions = document.createElement("div");
        actions.className = "actions";

        const copyBtn = document.createElement("button");
        copyBtn.textContent = "Copier MP";
        copyBtn.onclick = () => {
            navigator.clipboard.writeText(item.password).then(() => {
                copyBtn.textContent = "Copié !";
                setTimeout(() => copyBtn.textContent = "Copier MP", 1500);
            });
        };

        const delBtn = document.createElement("button");
        delBtn.textContent = "Supprimer";
        delBtn.className = "danger";
        delBtn.onclick = () => {
            if (confirm(`Supprimer "${item.label}" ?`)) {
                deleteItem(index);
            }
        };

        actions.appendChild(copyBtn);
        actions.appendChild(delBtn);
        tdActions.appendChild(actions);

        tr.appendChild(tdLabel);
        tr.appendChild(tdLogin);
        tr.appendChild(tdPassword);
        tr.appendChild(tdNotes);
        tr.appendChild(tdActions);

        itemsTableBody.appendChild(tr);
    });
}

function deleteItem(index) {
    const items = loadItems();
    items.splice(index, 1);
    saveItems(items);
    renderItems();
}

loginForm.onsubmit = (e) => {
    e.preventDefault();
    if (pinInput.value.trim() === MASTER_PIN) {
        loginError.classList.add("hidden");
        openVault();
    } else {
        loginError.textContent = "PIN incorrect.";
        loginError.classList.remove("hidden");
    }
};

function openVault() {
    loginScreen.classList.add("hidden");
    vaultScreen.classList.remove("hidden");
    renderItems();
}

logoutBtn.onclick = () => {
    vaultScreen.classList.add("hidden");
    loginScreen.classList.remove("hidden");
};

itemForm.onsubmit = (e) => {
    e.preventDefault();
    const label = labelInput.value.trim();
    if (!label) return alert("Le libellé est obligatoire.");

    const items = loadItems();
    items.push({
        label,
        login: loginInput.value.trim(),
        password: passwordInput.value.trim(),
        notes: notesInput.value.trim()
    });
    saveItems(items);
    renderItems();
    itemForm.reset();
};
