// Apply the saved or system theme before first paint to avoid a flash.
// A file rather than an inline script so the CSP can stay script-src 'self'.
try {
  var t = localStorage.getItem('theme')
  if (t === 'dark' || (!t && matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark')
  }
} catch {
  // Storage blocked: fall back to the light default.
}
