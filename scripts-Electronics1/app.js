const localVersion = "1.1.54";

export function checkVersion(onUpdate) {
  fetch("version.json", { cache: "no-store" })
    .then(res => res.json())
    .then(remote => {
      if (remote.version !== localVersion) {
        showUpdateToast(remote.version, remote.notes, onUpdate);
      } else {
        console.info("Elex1-flashcards is up to date. 🌟");
      }
    })
    .catch(err => {
      console.warn("Version check failed:", err);
      showErrorToast("Unable to check for updates. Please try again later.");
    });
}
function showUpdateToast(version, notes, onUpdate) {
  const toast = document.createElement("div");
  toast.className = "update-toast";
  toast.innerHTML = `
    <strong>✨ Elex1-flashcards Update Available ✨</strong><br>
    Version ${version} is now live.<br>
    <em>${notes}</em><br>
    <button>Refresh</button>
  `;
  toast.querySelector("button").onclick = () => {
    if (typeof onUpdate === "function") {
      onUpdate();
    } else {
      location.reload(true);
    }
  };
  document.body.appendChild(toast);
}

function showErrorToast(message) {
  const toast = document.createElement("div");
  toast.className = "error-toast";
  toast.textContent = message;
  document.body.appendChild(toast);
}

