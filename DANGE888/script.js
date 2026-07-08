 const products = [
  { id: 'brownies', name: 'Brownies Coklat', price: 35000, desc: 'Lembut, chocolaty, topping pilihan.', tag: 'Best Seller', img: 'images/brownis.jpg' },
  { id: 'cookies', name: 'Cookies Butter', price: 28000, desc: 'Renyäh di luar, lembut di dalam.', tag: 'Renyäh', img: 'images/cookies.jpg' },
  { id: 'tart', name: 'Mini Tart Buah', price: 45000, desc: 'Segar dengan krim halus dan buah.', tag: 'Segar', img: 'images/tart.jpg' },
  { id: 'ul1', name: 'Kue Ulang Tahun 20cm', price: 199000, desc: 'Custom tema, nama, dan warna frosting.', tag: 'Custom', img: 'images/ul1.jpg' },
  { id: 'cupcake', name: 'Cupcake Vanilla', price: 22000, desc: 'Per porsi, topping buttercream.', tag: 'Per Porsi', img: 'images/cupcake.jpg' },
  { id: 'cheesecake', name: 'Cheesecake Strawberry', price: 65000, desc: 'Creamy dengan saus strawberry.', tag: 'Premium', img: 'images/cheesecake.jpg' },
];

const state = {
  cart: {}, // id -> qty
  session: null, // { identifier, password? } - no need password stored
};

// Auth (demo) - LocalStorage
const AUTH_USERS_KEY = 'dange888_users_v1';
const AUTH_SESSION_KEY = 'dange888_session_v1';

function safeJsonParse(str, fallback){
  try { return JSON.parse(str); } catch { return fallback; }
}

function getUsers(){
  const raw = localStorage.getItem(AUTH_USERS_KEY);
  const users = safeJsonParse(raw, {});
  return users && typeof users === 'object' ? users : {};
}

function setUsers(users){
  localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
}

function normalizeIdentifier(s){
  return (s || '').toString().trim().toLowerCase();
}

function getSession(){
  const raw = localStorage.getItem(AUTH_SESSION_KEY);
  return safeJsonParse(raw, null);
}

function setSession(session){
  state.session = session;
  if(!session){
    localStorage.removeItem(AUTH_SESSION_KEY);
    return;
  }
  localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
}

function isLoggedIn(){
  return !!state.session;
}

function showAuthModal(mode){
  const modal = byId('authModal');
  const title = byId('authModalTitle');
  const tabLogin = byId('tabLogin');
  const tabRegister = byId('tabRegister');
  const submit = byId('authSubmit');
  const error = byId('authError');

  modal.setAttribute('aria-hidden', 'false');

  if(mode === 'register'){
    title.textContent = 'Daftar';
    tabLogin.setAttribute('aria-selected', 'false');
    tabRegister.setAttribute('aria-selected', 'true');
    submit.textContent = 'Daftar';
    submit.dataset.mode = 'register';
  } else {
    title.textContent = 'Login';
    tabLogin.setAttribute('aria-selected', 'true');
    tabRegister.setAttribute('aria-selected', 'false');
    submit.textContent = 'Login';
    submit.dataset.mode = 'login';
  }

  error.style.display = 'none';
  error.textContent = '';
  byId('authIdentifier').value = '';
  byId('authPassword').value = '';
}

function hideAuthModal(){
  const modal = byId('authModal');
  modal.setAttribute('aria-hidden', 'true');
}

function setAuthError(msg){
  const error = byId('authError');
  error.textContent = msg;
  error.style.display = 'block';
}

function renderAuthUI(){
  const navUser = byId('navUser');
  const btnLogin = byId('btnLogin');
  const navUserName = byId('navUserName');
  if(isLoggedIn()){
    btnLogin.style.display = 'none';
    navUser.style.display = 'flex';
    navUserName.textContent = state.session.identifierDisplay || state.session.identifier;
  } else {
    btnLogin.style.display = 'inline-flex';
    navUser.style.display = 'none';
  }
}

function setMainGate(){
  const loginScreen = byId('loginScreen');
  const siteContent = byId('siteContent');
  if(!loginScreen || !siteContent) return;

  const logged = isLoggedIn();
  loginScreen.setAttribute('aria-hidden', logged ? 'true' : 'false');
  siteContent.setAttribute('aria-hidden', logged ? 'false' : 'true');
  siteContent.style.pointerEvents = logged ? 'auto' : 'none';
}

function openLoginScreen(){
  const loginScreen = byId('loginScreen');
  if(loginScreen){
    loginScreen.setAttribute('aria-hidden','false');
    loginScreen.scrollIntoView({ block:'center', behavior:'smooth' });
  }
}

function requireLoginOrOpenAuth(){
  if(isLoggedIn()) return true;
  openLoginScreen();
  return false;
}


const rupiah = (n) => {

  try {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(n);
  } catch {
    return 'Rp ' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
};

function byId(id){ return document.getElementById(id); }

function getProduct(id){ return products.find(p => p.id === id); }

function cartCount(){ return Object.values(state.cart).reduce((a,b)=>a+b,0); }

function addToCart(id, qty){
  const q = Math.max(1, Math.floor(Number(qty) || 1));
  state.cart[id] = (state.cart[id] || 0) + q;
  renderCart();
}

function setQty(inputEl, min, max){
  const val = Number(inputEl.value);
  const next = Math.max(min, Math.min(max ?? 999, isNaN(val) ? min : val));
  inputEl.value = next;
}

function renderProducts(){
  const grid = byId('productGrid');
  grid.innerHTML = '';

  products.forEach((p) => {
    const card = document.createElement('div');
    card.className = 'card product-card';
    card.setAttribute('data-id', p.id);

    card.innerHTML = `
      <div class="product-image-wrap">
        <img class="product-image" src="${p.img || ''}" alt="Foto ${p.name}" loading="lazy" />
      </div>

      <div class="product-top">
        <div>
          <h3 class="product-title">${p.name}</h3>
          <p class="product-desc">${p.desc}</p>
        </div>
        <div style="text-align:right">
          <div class="product-price">${rupiah(p.price)}</div>
          <div class="pill" style="margin-top:8px">${p.tag}</div>
        </div>
      </div>

      <div class="product-actions">
        <div class="qty" aria-label="Atur jumlah">
          <button type="button" class="qty-minus" aria-label="Kurangi">-</button>
          <input type="number" class="qty-input" value="1" min="1" max="99" />
          <button type="button" class="qty-plus" aria-label="Tambah">+</button>
        </div>
        <button type="button" class="btn btn-primary btn-add">Tambah</button>
      </div>
    `;

    const input = card.querySelector('.qty-input');
    card.querySelector('.qty-minus').addEventListener('click', () => {
      input.value = Math.max(1, (Number(input.value) || 1) - 1);
      setQty(input, 1, 99);
    });
    card.querySelector('.qty-plus').addEventListener('click', () => {
      input.value = (Number(input.value) || 1) + 1;
      setQty(input, 1, 99);
    });

    card.querySelector('.btn-add').addEventListener('click', () => {
      addToCart(p.id, input.value);
    });

    grid.appendChild(card);
  });
}

function renderCart(){
  const list = byId('cartItems');
  const totalEl = byId('cartTotal');
  const noteEl = byId('orderNote');
  const countEl = byId('cartCount');

  const entries = Object.entries(state.cart);
  countEl.textContent = cartCount();

  if(entries.length === 0){
    list.innerHTML = '';
    totalEl.textContent = rupiah(0);
    noteEl.textContent = 'Belum ada item di keranjang.';
    return;
  }

  let total = 0;
  list.innerHTML = '';

  entries.forEach(([id, qty]) => {
    const p = getProduct(id);
    if(!p) return;
    const sub = p.price * qty;
    total += sub;

    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <div>
        <strong>${p.name}</strong>
        <div class="cart-sub">Jumlah: ${qty}</div>
      </div>
      <div style="text-align:right">
        <div style="font-weight:900">${rupiah(sub)}</div>
        <div class="cart-sub">( ${rupiah(p.price)} / item )</div>
      </div>
    `;

    list.appendChild(row);
  });

  totalEl.textContent = rupiah(total);
  noteEl.textContent = 'Siap dibuat pesanan.';
}

function formatOrderText(){
  const entries = Object.entries(state.cart);
  if(entries.length === 0) return 'Halo DANGE888, saya belum menambahkan produk ke keranjang.';

  const lines = [];
  lines.push('Halo DANGE888, saya ingin memesan kue berikut:');
  lines.push('');
  let total = 0;
  for(const [id, qty] of entries){
    const p = getProduct(id);
    if(!p) continue;
    const sub = p.price * qty;
    total += sub;
    lines.push(`- ${p.name} x${qty} = ${rupiah(sub)}`);
  }
  lines.push('');
  lines.push(`Total: ${rupiah(total)}`);
  lines.push('');
  lines.push('Mohon info: alamat pengiriman & estimasi waktu.')
  return lines.join('\n');
}

function showToast(message, opts = {}){
  const container = byId('toastContainer');
  if(!container) return;

  const type = opts.type || 'success'; // success | info | danger
  const icon = type === 'success' ? '✅' : (type === 'danger' ? '⚠️' : 'ℹ️');

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-icon" aria-hidden="true"><span>${icon}</span></div>
    <div class="toast-text">${message}</div>
  `;

  container.appendChild(toast);

  // auto dismiss
  const ttl = typeof opts.ttl === 'number' ? opts.ttl : 3000;
  setTimeout(() => {
    toast.style.animation = 'toastOut .18s ease forwards';
    setTimeout(() => toast.remove(), 220);
  }, ttl);
}

function checkout(){
  if(!requireLoginOrOpenAuth()) return;

  const entries = Object.entries(state.cart);
  if(entries.length === 0){
    showToast('Belum ada item di keranjang.', { type: 'info' });
    return;
  }

  const text = formatOrderText();

  const who = state.session?.identifierDisplay || state.session?.identifier;
  const textWithName = who ? `${text}\n\nAtas nama: ${who}` : text;

  const wa = byId('waLink').textContent.trim() || '085xxxxxxx';
  // Jika belum ganti nomor WA, tetap membuka placeholder link.
  const phoneDigits = wa.replace(/\D/g,'');
  const url = phoneDigits ? `https://wa.me/${phoneDigits}?text=${encodeURIComponent(textWithName)}` : '#';

  if(url === '#'){
    alert(textWithName);
    return;
  }

  window.open(url, '_blank', 'noopener');
}


function clearCart(){
  state.cart = {};
  renderCart();
}

// Promo
byId('btnPromo').addEventListener('click', () => {
  alert('PROMO HARI INI: Gratis topping untuk pembelian kue ulang tahun (kode: DANGE888)!');
});

// Buttons
byId('btnCheckout').addEventListener('click', checkout);
byId('btnCheckout2').addEventListener('click', checkout);
byId('btnClearCart').addEventListener('click', clearCart);

byId('btnLihatKeranjang').addEventListener('click', () => {
  document.getElementById('kontak').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// Auth UI events
const btnLogin = byId('btnLogin');
const btnLogout = byId('btnLogout');
const authModal = byId('authModal');
const authClose = byId('authClose');
const modalOverlay = authModal.querySelector('.modal-overlay');
const tabLogin = byId('tabLogin');
const tabRegister = byId('tabRegister');
const authSubmit = byId('authSubmit');
const authForm = byId('authForm');

btnLogin?.addEventListener('click', () => showAuthModal('login'));
btnLogout?.addEventListener('click', () => {
  setSession(null);
  renderAuthUI();
  setMainGate();
  hideAuthModal();
});


authClose?.addEventListener('click', () => hideAuthModal());
modalOverlay?.addEventListener('click', (e) => {
  // close if clicking overlay
  hideAuthModal();
});

// tabs
tabLogin?.addEventListener('click', () => showAuthModal('login'));
tabRegister?.addEventListener('click', () => showAuthModal('register'));

// submit auth
authForm?.addEventListener('submit', (e) => {
  e.preventDefault();

  const mode = authSubmit.dataset.mode || 'login';
  const identifierRaw = byId('authIdentifier').value;
  const password = byId('authPassword').value;

  const identifier = normalizeIdentifier(identifierRaw);
  const identifierDisplay = (identifierRaw || '').toString().trim();

  if(!identifier){
    setAuthError('Nama/Email wajib diisi.');
    return;
  }
  if(!password || password.length < 4){
    setAuthError('Password minimal 4 karakter.');
    return;
  }

  const users = getUsers();

  if(mode === 'register'){
    if(users[identifier]){
      setAuthError('Akun sudah terdaftar. Silakan login.');
      return;
    }

    // store password plainly (demo only)
    users[identifier] = { identifier, password, identifierDisplay };
    setUsers(users);

    setSession({ identifier, identifierDisplay });
    hideAuthModal();
    renderAuthUI();
    setMainGate();
    return;
  }


  // login
  const u = users[identifier];
  if(!u || u.password !== password){
    setAuthError('Login gagal: nama/email atau password salah.');
    return;
  }

  setSession({ identifier: u.identifier, identifierDisplay: u.identifierDisplay || u.identifier });
  hideAuthModal();
  renderAuthUI();
});

// init session state
state.session = getSession();
renderAuthUI();
setMainGate();

// Gate open buttons
byId('btnOpenLogin')?.addEventListener('click', () => showAuthModal('login'));
byId('btnOpenRegister')?.addEventListener('click', () => showAuthModal('register'));



// Chatbot (local rules)
const chatFab = byId('chatFab');
const chatWindow = byId('chatWindow');
const chatClose = byId('chatClose');
const chatMessages = byId('chatMessages');
const chatForm = byId('chatForm');
const chatInput = byId('chatInput');

// Chat context (local)
const chatState = {
  lastProductId: null,
  lastIntent: null,
};

function nowTime(){
  return new Date().toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit' });
}

function pushBubble(role, text){
  const wrap = document.createElement('div');
  wrap.className = `bubble ${role}`;
  wrap.innerHTML = `
    <div class="meta">${role === 'bot' ? 'DANGE888' : 'Kamu'} • ${nowTime()}</div>
    <p>${text}</p>
  `;
  chatMessages.appendChild(wrap);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function normalize(s){
  return (s || '').toLowerCase().trim();
}

function tokenizeId(s){
  // Normalize punctuation + whitespace + basic synonyms.
  let t = (s || '')
    .toString()
    .toLowerCase()
    .replace(/\s+/g,' ')
    .trim();

  // punctuation -> space
  t = t.replace(/[^a-z0-9\s]/g,' ');
  t = t.replace(/\s+/g,' ').trim();

  // lightweight synonym mapping to improve intent matching
  // NOTE: keep it small & deterministic (no AI).
  const rep = [
    // common filler + misspelling
    [/(banget|sih|dong|nih|yaudah|gak|nggak|kok|kalo)/g,''],

    // order/pesan/beli
    [/(bikin|buat)/g,'pesan'],
    [/(order|pesan|beli|checkout)/g,'pesan'],

    // ask/cara variants
    [/(gimana|bagaimana|gimann|gimana dong)/g,'cara'],
    [/(bagusnya|bisa|boleh|minta)/g,''],

    // price variants
    [/(berapa|berapa sih|cost|biaya|harga)/g,'harga'],

    // stok variants
    [/(stok|ada|tersedia|punya)/g,'stok'],

    // whatsapp variants
    [/(wa|whatsapp|telp|telepon|kontak)/g,'whatsapp'],

    // location variants
    [/(lokasi|alamat|kota|area|siantan)/g,'lokasi'],

    // pengiriman variants
    [/(pengiriman|kirim|ongkir|antar)/g,'pengiriman'],

    // ulang tahun variations
    [/\bultah\b/g,'ulang tahun'],
    [/\bulangtahun\b/g,'ulang tahun'],
    [/\bulang\s*tahun\b/g,'ulang tahun'],
    [/\bulang\s*tahunn?\b/g,'ulang tahun'],
    [/\bulang\s*tahun\b/g,'ulang tahun'],
    [/\bulang\b/g,'ulang'],

    // size hints
    [/\b20\s*cm\b/g,'20cm'],
    [/\b(cm)\b/g,'cm'],
  ];
  for(const [re, to] of rep){
    t = t.replace(re, to);
  }

  // remove duplicate spaces caused by replacements
  t = t.replace(/\s+/g,' ').trim();
  return t;
}

function extractQty(m){
  // Look for patterns like "2", "qty 2", "jumlah 3", "x3", "2 porsi", dll.
  // returns number or null
  if(!m) return null;

  // numeric qty
  let qtyMatch = m.match(/\b(qty|jumlah)\s*(\d{1,3})\b/i);
  if(!qtyMatch){
    qtyMatch = m.match(/\b(\d{1,3})\s*(x|porsi|pcs|piece)\b/i);
  }
  if(!qtyMatch){
    qtyMatch = m.match(/\b(x)\s*(\d{1,3})\b/i);
  }

  if(qtyMatch){
    const n = Number(qtyMatch[2] ?? qtyMatch[1]);
    if(Number.isFinite(n)) return Math.max(1, Math.min(99, Math.floor(n)));
  }

  // Indonesian spelled-out numbers (small set)
  const wordToNum = {
    'satu':1,'se':1,
    'dua':2,'tiga':3,'empat':4,'lima':5,'enam':6,'tujuh':7,'delapan':8,'sembilan':9,'sepuluh':10,
  };
  const hit = m.match(/\b(satu|se|dua|tiga|empat|lima|enam|tujuh|delapan|sembilan|sepuluh)\b/i);
  if(hit){
    const n = wordToNum[hit[1]];
    if(Number.isFinite(n)) return Math.max(1, Math.min(99, Math.floor(n)));
  }

  return null;
}

function findProductInText(m){
  // return product object or null
  const raw = m;
  if(!raw) return null;

  // normalize simple plurals to singular-ish detection
  // (produk array sudah pakai bentuk tertentu)
  const raw2 = raw.replace(/\bbrownies\b/g,'brownies')
                   .replace(/\bcookie\b/g,'cookies')
                   .replace(/\bkue\s+ulang\s+tahun\b/g,'ulang tahun');

  // Direct id match
  for(const p of products){
    if(raw2.includes(p.id.toLowerCase())) return p;
  }

  // Name match (robust)
  // Priority: full name includes (most reliable), else keyword mapping.
  for(const p of products){
    const n = p.name.toLowerCase();
    if(raw2.includes(n)) return p;
  }

  // Token keyword mapping (fast & tolerant)
  const kwToId = [
    ['brownie','brownies'],
    ['brownies','brownies'],
    ['cookie','cookies'],
    ['cookies','cookies'],
    ['tart','tart'],
    ['cheesecake','cheesecake'],
    ['cupcake','cupcake'],
    ['ulang tahun','ul1'],
    ['ultah','ul1'],
    ['kue ulang','ul1'],
    ['20cm','ul1'],
    ['ul1','ul1'],
  ];
  for(const [needle, id] of kwToId){
    if(raw2.includes(needle)){
      const p = products.find(x => x.id === id);
      if(p) return p;
    }
  }

  return null;
}

function listProductNames(){
  return products.map(p => p.name).join(', ');
}

function getLastProduct(){
  if(!chatState.lastProductId) return null;
  return products.find(p => p.id === chatState.lastProductId) || null;
}

function rememberProduct(product){
  if(product?.id) chatState.lastProductId = product.id;
}

function cartSummaryText(){
  const entries = Object.entries(state.cart);
  if(entries.length === 0) return null;

  let total = 0;
  const lines = [];
  for(const [id, qty] of entries){
    const p = getProduct(id);
    if(!p) continue;
    const sub = p.price * qty;
    total += sub;
    lines.push(`${p.name} x${qty} (${rupiah(sub)})`);
  }
  return `Keranjang kamu: ${lines.join(', ')}. Total ${rupiah(total)}.`;
}

function respond(msg){
  const mRaw = msg;
  const m = tokenizeId(mRaw);
  if(!m) return 'Tulis pesan dulu ya 🙂';

  // context product detection
  let product = findProductInText(m);
  if(product) rememberProduct(product);
  const lastProduct = getLastProduct();

  // qty
  const qty = extractQty(m);

  // cart awareness (should run before other intents sometimes)
  const cartHasItems = Object.keys(state.cart).length > 0;
  const wantsCheckoutLike = /(checkout|buat pesanan|buka pesanan|pesanan aku|buat pesanan|order kamu|keranjang)/.test(m);
  if(wantsCheckoutLike){
    chatState.lastIntent = 'checkout';
    const summary = cartSummaryText();
    if(!summary){
      return 'Checkout dulu ya—tapi keranjang kamu masih kosong. Mau tambah menu apa? (contoh: "tambahkan brownies 2")';
    }
    return `${summary} Kalau sudah, klik tombol Checkout untuk membuka WhatsApp.`;
  }

  // 3) intent detection (category) - using scoring-ish keyword presence
  const wantsJam = /\b(jam|open|buka|operasional)\b/.test(m);
  const wantsLokasi = /\b(lokasi|alamat|kota|area|siantan)\b/.test(m);
  const wantsKontak = /\b(whatsapp|wa)\b/.test(m);
  const wantsHarga = /\b(harga|berapa|cost|biaya)\b/.test(m);
  const wantsStok = /\b(stok|tersedia|ada)\b/.test(m);
  const wantsUlangTahun = m.includes('ulang tahun');
  const wantsPengiriman = /\b(pengiriman|kirim|ongkir|antar|estimasi)\b/.test(m);

  const wantsCaraOrder = (m.includes('cara') || m.includes('bagaimana') || m.includes('gimana') || m.includes('gimann')) && /(pesan|beli|order|checkout|keranjang)/.test(m);

  const wantsKeranjang = /(keranjang|lihat keranjang|buka keranjang|pesanan)/.test(m) && /(lihat|buka|checkout)/.test(m);

  const wantsTambahkan = /(tambah|tambahkan|masukkan|add)/.test(m) || (m.includes('keranjang') && /(tambah|tambahkan)/.test(m));

  // 4) resolve intents in priority order
  if(wantsJam){
    chatState.lastIntent = 'jam';
    return 'Jam operasional DANGE888: 08.00 - 20.00 WIB.';
  }

  if(wantsLokasi){
    chatState.lastIntent = 'lokasi';
    return 'Lokasi: Kota (Siantan, Kota Pontianak).';
  }

  if(wantsKontak){
    chatState.lastIntent = 'kontak';
    const wa = (byId('waLink')?.textContent || '').trim() || '(085251953887).';
    return `Untuk chat pemesanan, bisa hubungi WhatsApp: ${wa}.`;
  }

  if(wantsCaraOrder){
    chatState.lastIntent = 'cara_order';
    return 'Cara order: (1) pilih produk di Produk, (2) atur jumlah lalu klik Tambah, (3) buka Checkout lalu klik Buat Pesanan. Nanti saya bantu rangkum pesanan di WhatsApp.';
  }

  if(wantsHarga){
    chatState.lastIntent = 'harga';
    const p = product || lastProduct;
    if(p){
      return `${p.name} harganya ${rupiah(p.price)}.`;
    }
    return `Bisa sebutkan menunya? Contoh: "harga brownies" atau "harga cookies". Menu kami: ${listProductNames()}.`;
  }

  if(wantsStok){
    chatState.lastIntent = 'stok';
    const p = product || lastProduct;
    if(p){
      return `Stok ${p.name} umumnya tersedia. Untuk memastikan, sebutkan tanggal & jam pengambilan/pengiriman ya.`;
    }
    return 'Stok umumnya tersedia. Sebutkan produk apa yang kamu mau (misal: brownies / cookies / kue ulang tahun).';
  }

  if(wantsUlangTahun){
    chatState.lastIntent = 'ulang_tahun';
    return 'Kue ulang tahun bisa custom tema, nama, dan warna frosting. Sebutkan ukuran (misal 20cm) dan tanggal pengambilan ya.';
  }

  if(wantsPengiriman){
    chatState.lastIntent = 'pengiriman';
    return 'Untuk estimasi pengiriman/ongkir, sebutkan alamat (kota/area) dan jam yang diinginkan. Nanti saya bantu arahkan saat checkout.';
  }

  if(wantsKeranjang){
    chatState.lastIntent = 'keranjang';
    const summary = cartSummaryText();
    return summary || 'Keranjang kamu masih kosong. Mau tambah menu apa? (contoh: "tambahkan ul1 1")';
  }

  // Tambahkan ke keranjang
  if(wantsTambahkan){
    chatState.lastIntent = 'tambahkan';
    const p = product || lastProduct;
    if(!p){
      return `Mau tambah apa? Sebutkan menunya (misal: "tambahkan brownies" / "tambahkan ul1 2"). Menu kami: ${listProductNames()}.`;
    }
    const q = qty || 1;
    addToCart(p.id, q);
    const afterSummary = cartSummaryText();
    return `Siap! ${p.name} x${q} sudah saya tambahkan. ${afterSummary} Mau lanjut checkout?`;
  }

  // Jika user menyebut produk -> tawarkan harga + tambah
  if(product){
    chatState.lastIntent = 'produk';
    return `${product.name} harganya ${rupiah(product.price)}. Mau saya bantu tambah ke keranjang? (contoh: "tambahkan ${product.id} ${qty || 2}")`;
  }

  // Fallback keyword partial for price
  if(wantsHarga || /(berapa|cost|biaya|harga)/.test(m)){
    for(const p of products){
      const primary = p.name.toLowerCase().split(' ')[0];
      if(primary && m.includes(primary)){
        if(primary === 'kue' || primary === 'mini') continue;
        return `${p.name} harganya ${rupiah(p.price)}.`;
      }
    }
  }

  // Fallback general guidance
  const suggestions = [
    'harga brownies',
    'cara order',
    'pengiriman/ongkir',
    'jam operasional',
    'kue ulang tahun custom',
    'tambahkan brownies 2',
    'checkout'
  ];

  if(!cartHasItems){
    return `Maaf, saya belum nangkap detailnya. Coba tanya salah satu contoh ini: ${suggestions.slice(0,6).map(s=>`"${s}"`).join(', ')}.`;
  }

  const cartHint = cartSummaryText();
  return `${cartHint} Kalau mau, ketik "checkout". Atau coba tanya: ${suggestions.slice(0,5).map(s=>`"${s}"`).join(', ')}.`;
}


function toggleChat(open){
  const isOpen = chatWindow.classList.contains('open');
  if(open === undefined) open = !isOpen;
  chatWindow.classList.toggle('open', open);
  if(open){
    if(chatMessages.children.length === 0){
      pushBubble('bot', 'Halo! Saya chatbot DANGE888. Mau cari harga menu apa?');
    }
    setTimeout(() => chatInput.focus(), 50);
  }
}

chatFab.addEventListener('click', () => toggleChat());
chatClose.addEventListener('click', () => toggleChat(false));

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = chatInput.value;
  chatInput.value = '';
  pushBubble('user', text);
  const reply = respond(text);
  setTimeout(() => pushBubble('bot', reply), 200);
});

// Hint buttons
document.querySelectorAll('.hint').forEach(btn => {
  btn.addEventListener('click', () => {
    const t = btn.textContent;
    chatInput.value = t;
    chatForm.requestSubmit();
  });
});

// Scroll-to top on load
byId('year').textContent = new Date().getFullYear();

// Demo: set WA placeholder number in link text
byId('waLink').textContent = '085251953887';

renderProducts();
renderCart();

byId('timeProd').textContent = '30 menit';


