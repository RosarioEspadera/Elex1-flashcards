const localVersion = "1.0.3";

export function checkVersion() {
  fetch("version.json")
    .then(res => res.json())
    .then(remote => {
      if (remote.version !== localVersion) {
        const message = `
✨ Elex1-flashcards Update Available ✨
Version ${remote.version} is now live.

📝 Notes:
${remote.notes}

Would you like to refresh and load the latest version?
        `;
        if (confirm(message)) {
          location.reload(true);
        }
      } else {
        alert("You're already using the latest version. 🌟");
      }
    })
    .catch(err => {
      console.warn("Version check failed:", err);
      alert("Unable to check for updates. Please try again later.");
    });
}
