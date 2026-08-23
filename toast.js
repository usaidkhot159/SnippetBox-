let toastTimer = null;

export function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  if (!toast) return;

  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.className = `toast ${type} visible`;

  toastTimer = setTimeout(() => {
    toast.classList.remove('visible');
  }, 2800);
}
