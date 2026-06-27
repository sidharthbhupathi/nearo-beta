/**
 * Server-only admin console — full ops control panel.
 */
export function renderAdminConsoleHtml(apiBase: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Nearo Admin</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; margin: 0; padding: 20px; background: #121212; color: #f5f0e8; }
    h1 { font-size: 1.35rem; margin: 0 0 4px; color: #c9a96e; }
    .sub { color: #9a9080; font-size: 0.85rem; margin-bottom: 16px; }
    .warn { background: #3d2a00; border: 1px solid #c9a96e; color: #f5e6c8; padding: 10px 14px; border-radius: 8px; font-size: 0.8rem; margin-bottom: 16px; display: none; }
    .meta { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 10px; margin-bottom: 16px; }
    .card { background: #1e1e1e; border: 1px solid #333; border-radius: 10px; padding: 12px; }
    .card strong { display: block; color: #c9a96e; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
    .card span { font-size: 1.25rem; font-weight: 700; }
    .tabs { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px; }
    .tab { padding: 8px 12px; border-radius: 8px; border: 1px solid #444; background: #1a1a1a; color: #bbb; cursor: pointer; font-size: 0.8rem; }
    .tab.active { border-color: #c9a96e; color: #c9a96e; background: #252015; }
    #panel { background: #1a1a1a; border: 1px solid #333; border-radius: 12px; padding: 16px; min-height: 200px; overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; font-size: 0.78rem; }
    th, td { border: 1px solid #333; padding: 8px; text-align: left; vertical-align: top; }
    th { background: #252525; color: #c9a96e; position: sticky; top: 0; }
    tr:hover td { background: #222; }
    button, select, input { font-size: 0.78rem; padding: 5px 8px; border-radius: 6px; border: 1px solid #555; background: #2a2a2a; color: #f5f0e8; }
    button.primary { background: #c9a96e; color: #1a1a1a; border: none; font-weight: 700; cursor: pointer; }
    button.danger { background: #8b2e2e; color: #fff; border: none; font-weight: 600; cursor: pointer; }
    button:hover { opacity: 0.9; }
    .actions { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 4px; }
    .config-form { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; max-width: 640px; }
    .config-form label { display: block; font-size: 0.7rem; color: #aaa; margin-bottom: 4px; text-transform: uppercase; }
    .toast { position: fixed; bottom: 20px; right: 20px; background: #2d5a27; color: #fff; padding: 10px 16px; border-radius: 8px; font-size: 0.85rem; display: none; z-index: 99; }
    .toast.err { background: #8b2e2e; }
    code { font-size: 0.7rem; word-break: break-all; color: #c9a96e; }
  </style>
</head>
<body>
  <h1>Nearo Admin Console</h1>
  <p class="sub">Server-side only · Manage waitlist, merchants, content, and beta settings</p>
  <div id="sdk-warn" class="warn"></div>
  <div class="meta" id="meta"></div>
  <div class="tabs">
    <button class="tab active" data-tab="waitlist">Waitlist</button>
    <button class="tab" data-tab="merchants">Merchants</button>
    <button class="tab" data-tab="posts">Posts</button>
    <button class="tab" data-tab="analytics">Analytics</button>
    <button class="tab" data-tab="preferences">Preferences</button>
    <button class="tab" data-tab="config">Beta Config</button>
  </div>
  <div id="panel"><p style="color:#888">Loading…</p></div>
  <div id="toast" class="toast"></div>
  <script>
    const KEY = new URLSearchParams(location.search).get('key') || '';
    const hdrs = (extra) => ({ 'X-Admin-Key': KEY, 'Content-Type': 'application/json', ...extra });
    const esc = (s) => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
    let overview = {};

    function toast(msg, err) {
      const el = document.getElementById('toast');
      el.textContent = msg;
      el.className = 'toast' + (err ? ' err' : '');
      el.style.display = 'block';
      setTimeout(() => { el.style.display = 'none'; }, 3500);
    }

    async function api(path, opts) {
      const r = await fetch('${apiBase}' + path, { ...opts, headers: hdrs(opts && opts.headers) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error?.message || j.message || r.statusText);
      return j;
    }

    async function loadOverview() {
      const res = await api('/api/admin/overview');
      overview = res.data || {};
      const d = overview;
      const cfg = d.betaConfig || {};
      document.getElementById('meta').innerHTML = [
        ['Pending waitlist', d.waitlistPending ?? '—'],
        ['Total waitlist', d.waitlistTotal ?? '—'],
        ['Merchants (stores)', d.storesCount ?? '—'],
        ['Posts', d.postsCount ?? '—'],
        ['Analytics rows', d.analyticsCount ?? '—'],
        ['Onboarded (config)', cfg.merchants_onboarded ?? 0],
      ].map(([k,v]) => '<div class="card"><strong>' + esc(k) + '</strong><span>' + esc(v) + '</span></div>').join('');
      const w = document.getElementById('sdk-warn');
      if (!d.adminSdkReady) {
        w.style.display = 'block';
        w.innerHTML = '<strong>Setup required:</strong> Add <code>FIREBASE_SERVICE_ACCOUNT</code> (service account JSON) in Render Environment to enable merchant delete, KYB updates, and beta config. ' + esc(d.note || '');
      }
    }

    async function loadWaitlist() {
      const res = await api('/api/admin/waitlist');
      const rows = (res.data.entries || []).map(e => '<tr>'
        + '<td><strong>' + esc(e.store_name) + '</strong><br><span style="color:#888">' + esc(e.store_type) + '</span></td>'
        + '<td>' + esc(e.owner_name) + '<br>' + esc(e.phone) + '<br>' + esc(e.email) + '</td>'
        + '<td>' + esc(e.city) + '</td>'
        + '<td><select id="wl-' + esc(e.id) + '">'
        + ['pending','contacted','approved','rejected'].map(s => '<option value="'+s+'"'+(e.status===s?' selected':'')+'>'+s+'</option>').join('')
        + '</select><div class="actions">'
        + '<button class="primary" onclick="saveWl(\\''+esc(e.id)+'\\')">Save</button>'
        + '<button class="danger" onclick="delWl(\\''+esc(e.id)+'\\')">Delete</button>'
        + '</div></td></tr>').join('');
      document.getElementById('panel').innerHTML = '<table><thead><tr><th>Store</th><th>Contact</th><th>City</th><th>Status</th></tr></thead><tbody>' + (rows || '<tr><td colspan="4">No entries</td></tr>') + '</tbody></table>';
    }

    window.saveWl = async (id) => {
      const status = document.getElementById('wl-' + id).value;
      await api('/api/admin/waitlist/' + id, { method: 'PATCH', body: JSON.stringify({ status }) });
      toast('Waitlist updated'); loadOverview(); loadWaitlist();
    };
    window.delWl = async (id) => {
      if (!confirm('Delete this waitlist entry?')) return;
      await api('/api/admin/waitlist/' + id, { method: 'DELETE' });
      toast('Deleted'); loadOverview(); loadWaitlist();
    };

    async function loadMerchants() {
      const res = await api('/api/admin/stores');
      const rows = (res.data.stores || []).map(s => '<tr>'
        + '<td><strong>' + esc(s.storeName) + '</strong><br><code>' + esc(s.userId || s.id) + '</code></td>'
        + '<td style="max-width:180px">' + esc(s.address) + '<br><em style="color:#888;font-size:0.7rem">' + esc(s.products) + '</em></td>'
        + '<td>' + (s.platforms_active||[]).length + ' ch<br>' + esc(s.subscription_status) + '<br>KYB: ' + esc(s.kyb_status || 'pending') + '</td>'
        + '<td>' + esc(s.visibility_score) + '%</td>'
        + '<td><div class="actions">'
        + '<select id="kyb-' + esc(s.userId || s.id) + '"><option value="pending">pending</option><option value="verified">verified</option></select>'
        + '<button class="primary" onclick="setKyb(\\''+esc(s.userId||s.id)+'\\')">Set KYB</button>'
        + '<button class="primary" onclick="seedAnalytics(\\''+esc(s.userId||s.id)+'\\')">Seed stats</button>'
        + '<button class="danger" onclick="removeMerchant(\\''+esc(s.userId||s.id)+'\\',\\''+esc(s.storeName).replace(/'/g,"\\\\'")+'\\')">Remove merchant</button>'
        + '</div></td></tr>').join('');
      document.getElementById('panel').innerHTML = '<p style="font-size:0.8rem;color:#888;margin:0 0 12px">Remove merchant deletes: store, analytics, posts, preferences, and Firebase Auth user.</p>'
        + '<table><thead><tr><th>Store / UID</th><th>Details</th><th>Status</th><th>Score</th><th>Actions</th></tr></thead><tbody>'
        + (rows || '<tr><td colspan="5">No merchants — good for beta!</td></tr>') + '</tbody></table>';
    }

    window.setKyb = async (uid) => {
      const kyb_status = document.getElementById('kyb-' + uid).value;
      await api('/api/admin/stores/' + uid, { method: 'PATCH', body: JSON.stringify({ kyb_status }) });
      toast('KYB updated'); loadMerchants();
    };
    window.seedAnalytics = async (uid) => {
      await api('/api/admin/stores/' + uid + '/analytics/seed', { method: 'POST', body: '{}' });
      toast('7-day analytics seeded');
    };
    window.removeMerchant = async (uid, name) => {
      if (!confirm('Permanently remove merchant "' + name + '"?\\n\\nDeletes store, posts, analytics, preferences, and login account.')) return;
      try {
        const res = await api('/api/admin/merchants/' + uid, { method: 'DELETE' });
        toast('Removed: ' + JSON.stringify(res.data.deleted));
        loadOverview(); loadMerchants();
      } catch (e) { toast(e.message, true); }
    };

    async function loadPosts() {
      const res = await api('/api/admin/posts');
      const rows = (res.data.records || []).map(p => '<tr>'
        + '<td>' + esc(p.platform) + '</td>'
        + '<td style="max-width:220px">' + esc((p.content||'').slice(0,120)) + '</td>'
        + '<td>' + esc(p.status) + '<br><code>' + esc(p.storeId) + '</code></td>'
        + '<td><button class="danger" onclick="delPost(\\''+esc(p.id)+'\\')">Delete</button></td></tr>').join('');
      document.getElementById('panel').innerHTML = '<table><thead><tr><th>Platform</th><th>Content</th><th>Status / Store</th><th></th></tr></thead><tbody>' + (rows||'<tr><td colspan="4">No posts</td></tr>') + '</tbody></table>';
    }
    window.delPost = async (id) => {
      if (!confirm('Delete post?')) return;
      await api('/api/admin/posts/' + id, { method: 'DELETE' });
      toast('Post deleted'); loadPosts();
    };

    async function loadAnalytics() {
      const res = await api('/api/admin/analytics');
      const rows = (res.data.records || []).slice(0, 100).map(a => '<tr>'
        + '<td>' + esc(a.date) + '</td><td><code>' + esc(a.storeId) + '</code></td>'
        + '<td>' + esc(a.impressions) + '</td><td>' + esc(a.clicks) + '</td>'
        + '<td>' + esc(a.calls) + '</td></tr>').join('');
      document.getElementById('panel').innerHTML = '<table><thead><tr><th>Date</th><th>Store</th><th>Impr.</th><th>Clicks</th><th>Calls</th></tr></thead><tbody>' + (rows||'<tr><td colspan="5">No analytics</td></tr>') + '</tbody></table>';
    }

    async function loadPreferences() {
      const res = await api('/api/admin/preferences');
      const rows = (res.data.records || []).map(p => '<tr>'
        + '<td><code>' + esc(p.userId) + '</code></td>'
        + '<td>' + esc(p.tierName) + ' · ₹' + esc(p.monthlyPrice) + '</td>'
        + '<td>' + esc(p.platformPackLabel) + '</td></tr>').join('');
      document.getElementById('panel').innerHTML = '<table><thead><tr><th>User</th><th>Plan</th><th>Pack</th></tr></thead><tbody>' + (rows||'<tr><td colspan="3">None</td></tr>') + '</tbody></table>';
    }

    async function loadConfig() {
      const cfg = overview.betaConfig || { merchants_onboarded: 0, founding_spots: 100, launch_city: 'Bengaluru' };
      document.getElementById('panel').innerHTML = '<div class="config-form">'
        + '<div><label>Merchants onboarded (homepage)</label><input type="number" id="cfg-onboarded" value="' + esc(cfg.merchants_onboarded) + '" min="0" /></div>'
        + '<div><label>Founding spots left</label><input type="number" id="cfg-spots" value="' + esc(cfg.founding_spots) + '" min="0" /></div>'
        + '<div><label>Launch city</label><input type="text" id="cfg-city" value="' + esc(cfg.launch_city) + '" /></div>'
        + '</div><p style="margin-top:16px"><button class="primary" onclick="saveConfig()">Save beta config</button></p>'
        + '<p style="font-size:0.75rem;color:#888">Stored in Firestore <code>app_config/beta</code>. Homepage still reads from code until wired to API.</p>';
    }
    window.saveConfig = async () => {
      await api('/api/admin/config/beta', { method: 'PATCH', body: JSON.stringify({
        merchants_onboarded: parseInt(document.getElementById('cfg-onboarded').value, 10),
        founding_spots: parseInt(document.getElementById('cfg-spots').value, 10),
        launch_city: document.getElementById('cfg-city').value,
      })});
      toast('Beta config saved'); loadOverview();
    };

    const loaders = { waitlist: loadWaitlist, merchants: loadMerchants, posts: loadPosts, analytics: loadAnalytics, preferences: loadPreferences, config: loadConfig };
    document.querySelectorAll('.tab').forEach(btn => btn.onclick = () => {
      document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      loaders[btn.dataset.tab]();
    });

    loadOverview().then(() => loadWaitlist()).catch(() => {
      document.body.innerHTML = '<p style="padding:24px">Access denied. Check your admin key in the URL.</p>';
    });
  </script>
</body>
</html>`;
}
