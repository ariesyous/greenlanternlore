// Deep links open the named native disclosure, including when the hash changes.
(() => {
  const reveal = () => {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const target = document.getElementById(id);
    if (!target || !target.classList.contains('art-record')) return;
    target.open = true;
    target.scrollIntoView({block: 'start'});
  };
  addEventListener('hashchange', reveal);
  reveal();
})();
