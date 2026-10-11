// ===== KONFIGURASI =====
const BASE_URL = '';
const API = {
    status: `${BASE_URL}/api/status`,
    message: `${BASE_URL}/api/massege`,
    avatar: (player) => `${BASE_URL}/api/avatar?player=${encodeURIComponent(player)}`
};

const PAGE_META = {
    home: { title: 'Home', subtitle: 'Server overview' },
    status: { title: 'Status', subtitle: 'Active player' },
    message: { title: 'Message', subtitle: 'Chat server' },
    document: { title: 'Document', subtitle: 'API Documentation' },
    structure: { title: 'Example', subtitle: 'Folder & File Guide' },
};

// ===== NAVIGASI =====
const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page');

navItems.forEach(item => {
    item.addEventListener('click', () => {
        const target = item.dataset.page;
        navItems.forEach(n => n.classList.remove('active'));
        item.classList.add('active');
        pages.forEach(p => p.classList.remove('active'));
        document.getElementById(`page-${target}`).classList.add('active');

        const meta = PAGE_META[target];
        const titleEl = document.getElementById('topbar-title');
        titleEl.innerHTML = `<i class="${meta.icon}"></i><span>${meta.title}</span>`;
        document.getElementById('topbar-subtitle').textContent = meta.subtitle;

        const sidebar = document.querySelector('.sidebar');
        if (target === 'message') {
            sidebar.classList.add('hide-msg-badge');

            const badge = document.getElementById('nav-msg-count');
            if (badge) {
                badge.textContent = '0';
                badge.classList.remove('badge-pulse');
            }
            unreadCount = 0;
            loadMessages();
        } else {
            sidebar.classList.remove('hide-msg-badge');

            if (target === 'home') { loadHomeData(); }
            else if (target === 'status') { loadStatusData(); }
        }
    });
});

// ===== HELPERS =====
function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

function updateTopbar(data) {
    const statusEl = document.getElementById('topbar-status');
    if (data.online) {
        statusEl.className = 'pill live hide-mobile';
        statusEl.innerHTML = '<span class="dot-live"></span><strong>Online</strong>';
    } else {
        statusEl.className = 'pill hide-mobile';
        statusEl.innerHTML = '<span style="width:8px;height:8px;background:#f87171;border-radius:50%;"></span><strong style="color:#f87171;">Offline</strong>';
    }
    setText('topbar-players', `${data.players ?? 0}/${data.max_players ?? 0}`);
}

// ===== HOME =====
async function loadHomeData() {
    try {
        const res = await fetch(API.status);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();

        // Stat cards
        const onlineEl = document.getElementById('home-online');
        onlineEl.textContent = data.online ? 'Online' : 'Offline';
        onlineEl.className = 'value ' + (data.online ? 'online' : 'offline');

        setText('home-motd', data.motd || '—');
        setText('home-max-players', data.max_players ?? '—');
        setText('home-active-players', data.players ?? '—');
        setText('home-port', data.port ?? '—');

        const names = data.player_names || [];
        setText('home-player-names', names.length ? names.join(', ') : 'There are no players');

        const pct = data.max_players ? (data.players / data.max_players) * 100 : 0;
        document.getElementById('home-progress').style.width = pct + '%';

        setText('map-motd', data.motd || '—');
        setText('map-seed', data.id_seed ?? '—');

        setText('map-level-name', data.level_name || '—');
        setText('map-version', data.minecraft_version ? `Minecraft v${data.minecraft_version}` : '—');
        setText('map-protocol', data.protocol_version ?? '—');

        const seed = data.id_seed ?? 0;
        const iframe = document.getElementById('map-iframe');
        iframe.src = "https://mcseedview.com/?embed=1#seed=" + seed + "&platform=bedrock_1_26_3&dimension=overworld"

        updateTopbar(data);
        updateStatusPage(data);

    } catch (err) {
        console.error('Home error:', err);
        document.getElementById('home-online').textContent = 'ERROR';
        document.getElementById('home-online').className = 'value offline';
        setText('home-motd', 'Failed to load data');
    }
}

// ===== STATUS =====
function updateStatusPage(data) {
    setText('status-map-name', data.level_name || '—');
    setText('status-map-sub', `${data.motd || ''} • Port ${data.port ?? '—'}`);
    setText('status-online-num', data.players ?? 0);
    setText('status-max-num', data.max_players ?? 0);

    const navCount = document.getElementById('nav-status-count');
    if (navCount) navCount.textContent = data.players ?? 0;

    renderPlayerGrid(data);
}

function renderPlayerGrid(data) {
    const grid = document.getElementById('player-grid');
    const maxPlayers = data.max_players || 0;
    const playerNames = data.player_names || [];

    if (maxPlayers === 0) {
        grid.innerHTML = '<div class="empty-state"><div class="emoji"><i class="fa-solid fa-inbox"></i></div><div>No player data</div></div>';
        grid.style.gridTemplateColumns = '1fr';
        return;
    }

    let cols = Math.min(maxPlayers, 5);
    if (cols < 2) cols = maxPlayers;
    grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    grid.innerHTML = '';
    for (let i = 0; i < maxPlayers; i++) {
        const slot = document.createElement('div');
        slot.className = 'player-slot';
        const playerName = playerNames[i];

        if (playerName) {
            slot.classList.add('filled');
            const img = document.createElement('img');
            img.src = API.avatar(playerName);
            img.alt = playerName;
            img.loading = 'lazy';
            img.onerror = function() {
                this.style.display = 'none';
                slot.innerHTML = `<i class="fa-solid fa-user empty-icon"></i>`;
            };
            slot.appendChild(img);

            const overlay = document.createElement('div');
            overlay.className = 'overlay';
            overlay.innerHTML = `
            <div class="pname">${playerName}</div>
            <div class="pstatus">Online</div>
          `;
            slot.appendChild(overlay);
        } else {
            slot.classList.add('empty');
            slot.innerHTML = `<i class="fa-solid fa-plus empty-icon"></i>`;
        }
        grid.appendChild(slot);
    }
}

async function loadStatusData() {
    try {
        const res = await fetch(API.status);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        updateStatusPage(data);
        updateTopbar(data);
    } catch (err) {
        console.error('Status error:', err);
        setText('status-map-name', 'Failed to load');
        document.getElementById('player-grid').innerHTML =
            '<div class="error-state"><div class="emoji"><i class="fa-solid fa-triangle-exclamation"></i></div><div>Failed to load player data</div></div>';
    }
}

// ===== MESSAGE =====
let lastMessageId = null;
let isLoadingMessages = false;

async function loadMessages() {
    const container = document.getElementById('chat-messages');
    container.innerHTML = '<div class="loading-state"><i class="fa-solid fa-spinner spinner-icon"></i><div>Loading message...</div></div>';
    lastMessageId = null;
    await fetchAndRenderMessages(false);
}

async function loadMessagesSilent() {
    if (isLoadingMessages) return;
    await fetchAndRenderMessages(true);
}

function formatTimestamp(ts) {
    if (!ts) return '';
    const date = new Date(ts.replace(' ', 'T'));
    if (isNaN(date.getTime())) {
        return ts;
    }
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    const d = date.getDate();
    const m = date.getMonth() + 1;
    const y = date.getFullYear();
    return `[${hh}:${mm}] ${d}/${m}/${y}`;
}

// ===== BADGE COUNT  =====
let knownMessageIds = new Set();
let initialBadgeLoaded = false;
let unreadCount = 0;

async function updateMessageBadge() {
    const badge = document.getElementById('nav-msg-count');
    if (!badge) return;

    const activePage = document.querySelector('.page.active');
    const isOnMessagePage = activePage && activePage.id === 'page-message';

    if (isOnMessagePage) {
        if (badge.textContent !== '0') badge.textContent = '0';
        if (badge.classList.contains('badge-pulse')) {
            badge.classList.remove('badge-pulse');
        }
        unreadCount = 0;

        try {
            const res = await fetch(API.message);
            if (!res.ok) return;
            const data = await res.json();
            (data.messages || []).forEach(m => knownMessageIds.add(m.id));
        } catch (e) {}
        return;
    }

    try {
        const res = await fetch(API.message);
        if (!res.ok) return;
        const data = await res.json();
        const messages = data.messages || [];

        if (!initialBadgeLoaded) {
            messages.forEach(m => knownMessageIds.add(m.id));
            badge.textContent = '0';
            unreadCount = 0;
            initialBadgeLoaded = true;
            return;
        }

        let newMessages = 0;
        messages.forEach(m => {
            if (!knownMessageIds.has(m.id)) {
                knownMessageIds.add(m.id);
                newMessages++;
            }
        });

        if (newMessages > 0) {
            unreadCount += newMessages;
            badge.textContent = unreadCount > 99 ? '99+' : unreadCount;
            badge.classList.add('badge-pulse');
            setTimeout(() => badge.classList.remove('badge-pulse'), 1500);
        } else {
            // Tidak ada pesan baru → pastikan badge sinkron dengan unreadCount
            const target = unreadCount > 99 ? '99+' : String(unreadCount);
            if (badge.textContent !== target) badge.textContent = target;
        }
    } catch (err) {
        // Silent fail
    }
}

async function fetchAndRenderMessages(silent) {
    if (isLoadingMessages) return;
    isLoadingMessages = true;


    const container = document.getElementById('chat-messages');

    try {
        const res = await fetch(API.message);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        const messages = data.messages || [];

        // setText('nav-msg-count', messages.length);
        document.getElementById('msg-count-chip').innerHTML =
            `<span>${messages.length}</span> <i class="fa-solid fa-message"></i>`;

        const sorted = [...messages].sort((a, b) => (a.id || 0) - (b.id || 0));
        const newestId = sorted.length ? sorted[sorted.length - 1].id : null;
        const hasNew = newestId !== lastMessageId;

        if (silent && !hasNew && container.querySelector('.msg')) {
            isLoadingMessages = false;
            return;
        }

        if (messages.length === 0) {
            container.innerHTML = '<div class="empty-state"><i class="fa-solid fa-comment-slash"></i><div>No messages yet</div></div>';
            lastMessageId = null;
            isLoadingMessages = false;
            return;
        }

        const wasAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 60;
        const prevCount = container.querySelectorAll('.msg').length;
        container.innerHTML = '';

        sorted.forEach(msg => {
            const item = document.createElement('div');
            item.className = 'msg';

            const av = document.createElement('div');
            av.className = 'av online';
            const img = document.createElement('img');
            const profilePath = msg.profile_url || `/api/avatar?player=${encodeURIComponent(msg.name)}`;
            img.src = profilePath.startsWith('http') ? profilePath : BASE_URL + profilePath;
            img.alt = msg.name || 'Player';
            img.loading = 'lazy';
            img.onerror = function() {
                this.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44"><rect width="44" height="44" fill="%23232d42"/><text x="22" y="28" font-size="18" text-anchor="middle" fill="%2394a3b8">?</text></svg>';
            };
            av.appendChild(img);
            item.appendChild(av);

            const content = document.createElement('div');
            content.className = 'content';

            const head = document.createElement('div');
            head.className = 'head';

            const author = document.createElement('span');
            author.className = 'author';
            author.innerHTML = `<i class="fa-solid fa-user"></i> ${msg.name || 'Unknown'}`;

            const time = document.createElement('span');
            time.className = 'time';
            time.innerHTML = `<i class="fa-regular fa-clock"></i> ${formatTimestamp(msg.timestamp) || ''}`;

            head.appendChild(author);
            head.appendChild(time);

            if (msg.dimension) {
                const dim = document.createElement('span');
                dim.className = 'dim';
                dim.innerHTML = `<i class="fa-solid fa-globe"></i> ${msg.dimension}`;
                head.appendChild(dim);
            }

            const bubble = document.createElement('div');
            bubble.className = 'bubble';
            bubble.textContent = msg.message || '';

            content.appendChild(head);
            content.appendChild(bubble);
            item.appendChild(content);
            container.appendChild(item);
        });

        lastMessageId = newestId;
        if (!silent || wasAtBottom || prevCount !== sorted.length) {
            requestAnimationFrame(() => {
                container.scrollTop = container.scrollHeight;
            });
        }

    } catch (err) {
        console.error('Message error:', err);
        if (!silent) {
            container.innerHTML = '<div class="error-state"><i class="fa-solid fa-triangle-exclamation"></i><div>Failed to load message</div></div>';
        }
    } finally {
        isLoadingMessages = false;
    }
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    loadHomeData();
    loadStatusData();
    updateMessageBadge();

    setInterval(() => {
        const activePage = document.querySelector('.page.active');
        if (!activePage) return;
        if (activePage.id === 'page-home') loadHomeData();
        else if (activePage.id === 'page-status') loadStatusData();
        else if (activePage.id === 'page-message') loadMessagesSilent();
    }, 7000);

    setInterval(() => {
        const activePage = document.querySelector('.page.active');
        if (activePage && activePage.id === 'page-message') loadMessagesSilent();
        else if (activePage.id === 'page-status') loadStatusData();
    }, 1000);

    setInterval(() => {
        updateMessageBadge();
    }, 1000);
});