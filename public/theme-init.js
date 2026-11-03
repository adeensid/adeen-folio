/* Applies the saved colour theme before first paint, so there is no flash. */
(function () {
  try {
    var t = localStorage.getItem("as-theme");
    if (t === "light" || t === "dark") document.documentElement.setAttribute("data-theme", t);
  } catch (e) {}
})();
