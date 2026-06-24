/**
 * Server-only admin console HTML — not bundled in the React client.
 */
export function renderAdminConsoleHtml(apiBase: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Nearo Ops</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: system-ui, sans-serif; margin: 0; padding: 24px; background: #1a1a1a; color: #f5f0e8; }
    h1 { font-size: 1.25rem; margin: 0 0 8px; }
    p { color: #a89f8f; font-size: 0.85rem; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 0.8rem; }
    th, td { border: 1px solid #333; padding: 8px; text-align: left; vertical-align: top; }
    th { background: #2a2a2a; color: #c9a96e; }
    select, button { font-size: 0.8rem; padding: 4px 8px; }
    button { background: #c9a96e; color: #1a1a1a; border: none; border-radius: 4px; cursor: pointer; font-weight: 600; }
    .tabs { display: flex; gap: 8px; margin: 20px 0 12px; }
    .tab { padding: 8px 14px; border-radius: 8px; border: 1px solid #444; background: #222; color: #ccc; cursor: pointer; }
    .tab.active { border-color: #c9a96e; color: #c9a96e; }
    .meta { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; margin-top: 16px; }
    .card { background: #222; border: 1px solid #333; border-radius: 8px; padding: 12px; }
    .card strong { display: block; color: #c9a96e; font-size: 0.7rem; text-transform: uppercase; }
  </style>
</head>
<body>
  <h1>Nearo Operations Console</h1>
  <p>Server-side only. Not part of the merchant app.</p>
  <div class="meta" id="meta"></div>
  <div class="tabs">
    <button class="tab active" data-tab="waitlist">Waitlist</button>
    <button class="tab" data-tab="stores">Stores</button>
  </div>
  <div id="panel"></div>
  <script>
    const KEY = new URLSearchParams(location.search).get('key') || '';
    const headers = () => ({ 'X-Admin-Key': KEY, 'Content-Type': 'application/json' });
    async function api(path) {
      const r = await fetch('${apiBase}' + path, { headers: headers() });
      if (!r.ok) throw new Error(await r.text());
      return r.json();
    }
    async function loadMeta() {
      const h = await api('/api/admin/overview');
      document.getElementById('meta').innerHTML = [
        ['Waitlist pending', h.data.waitlistPending],
        ['Stores', h.data.storesCount],
        ['Auth users', h.data.note],
      ].map(([k,v]) => '<div class="card"><strong>' + k + '</strong>' + v + '</div>').join('');
    }
    async function loadWaitlist() {
      const res = await api('/api/admin/waitlist');
      const rows = res.data.entries.map(e => '<tr><td>' + e.store_name + '</td><td>' + e.owner_name + '<br>' + e.phone + '<br>' + e.email + '</td><td>' + e.city + '</td><td>' + e.store_type + '</td><td><select id="st-' + e.id + '"><option value="pending"' + (e.status==='pending'?' selected':'') + '>pending</option><option value="contacted"' + (e.status==='contacted'?' selected':'') + '>contacted</option><option value="approved"' + (e.status==='approved'?' selected':'') + '>approved</option><option value="rejected"' + (e.status==='rejected'?' selected':'') + '>rejected</option></select><br><button onclick="saveStatus(\\'' + e.id + '\\')">Save</button></td></tr>').join('');
      document.getElementById('panel').innerHTML = '<table><thead><tr><th>Store</th><th>Contact</th><th>City</th><th>Type</th><th>Status</th></tr></thead><tbody>' + rows + '</tbody></table>';
    }
    async function loadStores() {
      const res = await api('/api/admin/stores');
      const rows = res.data.stores.map(s => '<tr><td>' + s.storeName + '</td><td>' + s.userId + '</td><td>' + (s.platforms_active||[]).length + ' platforms</td><td>' + s.subscription_status + '</td><td>' + (s.visibility_score||0) + '%</td></tr>').join('');
      document.getElementById('panel').innerHTML = '<table><thead><tr><th>Store</th><th>UID</th><th>Channels</th><th>Plan</th><th>Score</th></tr></thead><tbody>' + rows + '</tbody></table>';
    }
    window.saveStatus = async (id) => {
      const status = document.getElementById('st-' + id).value;
      await fetch('${apiBase}/api/admin/waitlist/' + id, { method: 'PATCH', headers: headers(), body: JSON.stringify({ status }) });
      loadWaitlist();
    };
    document.querySelectorAll('.tab').forEach(btn => btn.onclick = () => {
      document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (btn.dataset.tab === 'waitlist') loadWaitlist();
      else loadStores();
    });
    loadMeta().then(loadWaitlist).catch(e => { document.body.innerHTML = '<p>Access denied or error.</p>'; });
  </script>
</body>
</html>`;
}
