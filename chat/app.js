import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import {
  getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import {
  getFirestore,
  collection, doc, setDoc, addDoc, updateDoc, deleteDoc, getDoc, getDocs, query, orderBy, limit, onSnapshot, serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

/* =================== Init =================== */
const app = initializeApp(window.FIREBASE_CONFIG);
const auth = getAuth(app);
const db = getFirestore(app);

const CONFIG_ADMIN_EMAILS = (window.BACKCHANNEL_ADMIN_EMAILS || [])
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);
const FALLBACK_NAME = window.BACKCHANNEL_FALLBACK_NAME || "Classroom User";
const SCHOOL_DOMAIN = "glenbrook225.org";
const OWNER_EMAIL = CONFIG_ADMIN_EMAILS[0] || "";
const ROOM_CODE_LENGTH = 5;
const CODE_CHARS = "abcdefghijkmnpqrstuvwxyz23456789"; // no ambiguous l, o, 0, 1
const BUILD_VERSION = "2026-09-08.v2";

if (window.BUILD_VERSION_SLOT) window.BUILD_VERSION_SLOT.textContent = "v" + BUILD_VERSION;
addEventListener("DOMContentLoaded", () => {
  const slot = document.getElementById("build-version");
  if (slot) slot.textContent = "v" + BUILD_VERSION;
});

function isOwner(email) {
  email = (email || "").trim().toLowerCase();
  return OWNER_EMAIL !== "" && email === OWNER_EMAIL;
}

/* =================== State =================== */
let currentUser = null;
let adminEmails = [];              // from settings/access document
let activeRoom = null;             // { id, ref, unsub, data }
let messagesById = new Map();      // current room messages
let scrollPinned = true;           // whether we auto-scroll on new messages

/* =================== DOM helpers =================== */
const $ = (s) => document.querySelector(s);

function show(view) {
  ["login", "home", "room"].forEach((v) => {
    const el = $("#view-" + v);
    if (el) el.classList.toggle("d-none", v !== view);
  });
}

/* =================== Access / roles =================== */
function roleForEmail(email) {
  email = (email || "").trim().toLowerCase();
  if (!email) return { allowed: false, role: "none" };

  const [local, domain] = email.split("@");

  if (domain === SCHOOL_DOMAIN && local && /^[0-9]+$/.test(local)) {
    return { allowed: true, role: "student" };
  }
  if (domain === SCHOOL_DOMAIN && local && /[a-zA-Z]/.test(local)) {
    return { allowed: true, role: "teacher" };
  }
  if (CONFIG_ADMIN_EMAILS.includes(email)) return { allowed: true, role: "teacher" };
  return { allowed: false, role: "none" };
}

function isListedAdmin(email) {
  return adminEmails.includes((email || "").trim().toLowerCase());
}

function effectiveRole(user) {
  if (!user) return { allowed: false, role: "none" };
  const email = (user.email || "").trim().toLowerCase();
  if (isOwner(email)) return { allowed: true, role: "teacher", owner: true };
  const r = roleForEmail(email);
  if (isListedAdmin(email)) {
    return { allowed: true, role: "teacher" };
  }
  return r;
}

/* =================== Settings =================== */
function settingsRef() {
  return doc(db, "settings", "access");
}

async function loadSettings() {
  try {
    const snap = await getDoc(settingsRef());
    if (snap.exists()) {
      const data = snap.data();
      adminEmails = Array.isArray(data.adminEmails) ? data.adminEmails : [];
    } else {
      adminEmails = [];
    }
  } catch (e) {
    console.warn("Could not read settings", e);
  }
}

async function saveSettings(emails) {
  await updateDoc(settingsRef(), { adminEmails: emails });
}

async function seedSettings() {
  await setDoc(settingsRef(), { adminEmails: [...CONFIG_ADMIN_EMAILS] });
  await loadSettings();
  renderHome(effectiveRole(currentUser));
}

/* =================== User record =================== */
async function ensureUserRecord(user) {
  try {
    await setDoc(
      doc(db, "users", user.uid),
      { name: user.displayName || FALLBACK_NAME, email: (user.email || "").toLowerCase(), updatedAt: serverTimestamp() },
      { merge: true }
    );
  } catch (e) {
    console.warn("Could not update user profile", e);
  }
}

/* =================== Auth =================== */
let signingIn = false;

let denyNotice = "";

function loginNotice(msg, isError) {
  const box = $("#login-notice");
  if (!box) return;
  box.classList.toggle("alert-danger", !!isError);
  box.classList.toggle("alert-warning", !isError);
  box.classList.toggle("d-none", !msg);
  box.textContent = msg || "";
}

async function handleAuth(user) {
  currentUser = user;
  await loadSettings();

  if (!user) {
    loginNotice(denyNotice || "");
    show("login");
    return;
  }

  ensureUserRecord(user);

  const role = effectiveRole(user);
  if (!role.allowed) {
    denyNotice = (user.email || "") + " isn't on the approved list. Only @glenbrook225.org and listed Gmail accounts can join.";
    await signOut(auth);
    return;
  }
  denyNotice = "";

  const code = roomCodeFromPath();
  if (code) {
    show("room");
    await openRoom(code);
  } else {
    show("home");
    renderHome(role);
  }
}

onAuthStateChanged(auth, handleAuth);

$("#btn-google-signin").addEventListener("click", async () => {
  if (signingIn) return;
  signingIn = true;
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    await signInWithPopup(auth, provider);
  } catch (e) {
    if (e.code !== "auth/cancelled-popup-request" && e.code !== "auth/popup-closed-by-user") {
      console.error("Sign-in failed", e);
      loginNotice("Sign-in failed: " + (e.message || e.code), true);
    }
  } finally {
    signingIn = false;
  }
});

$("#btn-signout-home").addEventListener("click", () => signOut(auth));
$("#btn-signout-room").addEventListener("click", () => signOut(auth));

/* =================== Home / rooms list =================== */
function renderHome(role) {
  $("#home-user-email").textContent = currentUser.email || "";

  const email = (currentUser.email || "").toLowerCase();
  const isListedAdminUser = isListedAdmin(email);
  const isOwnerUser = isOwner(email);
  const canCreate = role.role === "teacher";

  // Create room panel: any teacher (domain teacher, listed admin, or owner).
  $("#home-teacher-panel").classList.toggle("d-none", !canCreate);

  // Owner bootstrap prompt: if access doc missing, owner creates it from config.
  const needSeed = role.owner && adminEmails.length === 0;
  $("#owner-seed-box").classList.toggle("d-none", !needSeed);

  // Access manager: listed admins (owner is implicit admin too).
  $("#access-manager").classList.toggle("d-none", !(isListedAdminUser || isOwnerUser) || adminEmails.length === 0);
  if (isListedAdminUser || isOwnerUser) renderAccessManager();

  // Room list
  const listPanel = $("#home-teacher-list");
  if (canCreate) {
    listPanel.classList.remove("d-none");
    loadRoomsList();
  } else {
    listPanel.classList.add("d-none");
  }
}

async function loadRoomsList() {
  const el = $("#room-list");
  el.innerHTML = "";
  const q = query(collection(db, "rooms"), orderBy("createdAt", "desc"), limit(30));
  let snap;
  try {
    snap = await getDocs(q);
  } catch (e) {
    console.error(e);
    el.innerHTML = '<div class="list-group-item text-muted small">Could not load rooms.</div>';
    return;
  }
  if (snap.empty) {
    el.innerHTML = '<div class="list-group-item text-muted">Create your first room above.</div>';
    return;
  }
  snap.forEach((d) => {
    const data = d.data();
    const name = data.name || "Backchannel";
    const item = document.createElement("a");
    item.href = "/chat/?room=" + d.id;
    item.className = "list-group-item list-group-item-action d-flex align-items-center justify-content-between";
    item.innerHTML =
      '<span class="fw-semibold text-truncate">' + esc(name) + "</span>" +
      '<span class="badge bg-primary text-uppercase ms-2">' + esc(d.id) + "</span>";
    el.appendChild(item);
  });
}

/* =================== Create / join room =================== */
function queryRoomCode() {
  const params = new URLSearchParams(window.location.search);
  const code = (params.get("room") || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  return code.length >= 3 ? code : null;
}

function pathRoomCode() {
  const parts = window.location.pathname.split("/").filter(Boolean);
  const idx = parts.lastIndexOf("chat");
  if (idx >= 0 && parts[idx + 1]) {
    const code = parts[idx + 1].replace(/[^a-z0-9]/g, "").toLowerCase();
    if (code && code.length <= 12) return code;
  }
  return null;
}

function roomCodeFromPath() {
  return queryRoomCode() || pathRoomCode();
}

function navigateToRoom(code) {
  window.location.href = "/chat/?room=" + encodeURIComponent(code);
}

function generateCode() {
  let c = "";
  for (let i = 0; i < ROOM_CODE_LENGTH; i++) c += CODE_CHARS.charAt(Math.floor(Math.random() * CODE_CHARS.length));
  return c;
}

$("#btn-create-room").addEventListener("click", async () => {
  const btn = $("#btn-create-room");
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Creating…';
  const code = generateCode();
  try {
    await setDoc(doc(db, "rooms", code), {
      name: "Backchannel",
      createdAt: serverTimestamp(),
      createdBy: currentUser.uid,
      createdByEmail: (currentUser.email || "").toLowerCase(),
    });
    navigateToRoom(code);
  } catch (e) {
    console.error(e);
    btn.disabled = false;
    btn.innerHTML = '<i class="bi bi-plus-circle me-2"></i>Create New Room';
    joinFeedback("Could not create the room: " + (e.message || e.code), true);
  }
});

$("#form-join").addEventListener("submit", async (ev) => {
  ev.preventDefault();
  const input = $("#input-join-code");
  const code = (input.value || "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");
  if (!code) return;
  joinFeedback("");
  try {
    const snap = await getDoc(doc(db, "rooms", code));
    if (!snap.exists()) {
      joinFeedback("That room code doesn't exist — double-check with your teacher.", true);
      return;
    }
    navigateToRoom(code);
  } catch (e) {
    joinFeedback("Could not check the room: " + (e.message || e.code), true);
  }
});

$("#btn-seed-settings").addEventListener("click", async () => {
  const btn = $("#btn-seed-settings");
  btn.disabled = true;
  try {
    await seedSettings();
    $("#owner-seed-box").classList.add("d-none");
    $("#access-manager").classList.remove("d-none");
    renderAccessManager();
    joinFeedback("Settings created. You're all set as the owner.", false);
  } catch (e) {
    console.error("Seed settings failed", e);
    joinFeedback("Could not create settings: " + (e.message || e.code), true);
    loginNotice("Could not create settings: " + (e.message || e.code), true);
  } finally {
    btn.disabled = false;
  }
});

function joinFeedback(msg, isError) {
  const el = $("#join-feedback");
  el.classList.toggle("d-none", !msg);
  el.classList.toggle("text-danger", !!isError);
  el.classList.toggle("text-success", !isError);
  el.textContent = msg;
}

/* =================== Access management =================== */
function renderAccessManager() {
  const box = $("#admin-emails-list");
  box.innerHTML = "";
  if (!adminEmails.length) {
    box.innerHTML = '<li class="list-group-item text-muted">No admin emails yet.</li>';
    return;
  }
  adminEmails.forEach((em) => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex align-items-center justify-content-between";
    const label = document.createElement("span");
    label.textContent = em;
    label.className = "text-truncate";
    const rm = document.createElement("button");
    rm.type = "button";
    rm.className = "btn btn-sm btn-outline-danger";
    rm.textContent = "Remove";
    rm.addEventListener("click", async () => {
      const next = adminEmails.filter((e) => e !== em);
      await saveSettings(next);
      adminEmails = next;
      renderAccessManager();
    });
    li.appendChild(label);
    li.appendChild(rm);
    box.appendChild(li);
  });
}

$("#form-add-admin").addEventListener("submit", async (ev) => {
  ev.preventDefault();
  const input = $("#input-add-admin");
  const email = (input.value || "").trim().toLowerCase();
  input.value = "";
  if (!email || !/.+@.+\..+/.test(email)) {
    joinFeedback("Enter a valid email address.", true);
    return;
  }
  const next = adminEmails.includes(email) ? adminEmails : [...adminEmails, email];
  await saveSettings(next);
  adminEmails = next;
  renderAccessManager();
  joinFeedback("Added " + email, false);
});

/* =================== Room =================== */
function openRoomFeedback(msg) {
  const el = $("#room-error");
  el.textContent = msg || "";
  el.classList.toggle("d-none", !msg);
}

function showRoomError(msg) {
  openRoomFeedback(msg);
  $("#composer-wrap").classList.add("d-none");
}

function clearRoomState() {
  if (activeRoom && activeRoom.unsub) activeRoom.unsub();
  activeRoom = null;
  messagesById = new Map();
}

async function openRoom(code) {
  clearRoomState();
  const ref = doc(db, "rooms", code);
  const roomDoc = await getDoc(ref);
  if (!roomDoc.exists()) {
    showRoomError("This room doesn't exist (it may have expired). Check the link with your teacher.");
    return;
  }
  const data = roomDoc.data();
  activeRoom = { id: code, ref, data };
  $("#room-code-label").textContent = code;
  $("#room-role-label").textContent = effectiveRole(currentUser).role;

  const q = query(collection(ref, "messages"), orderBy("createdAt", "asc"), limit(800));
  activeRoom.unsub = onSnapshot(q, (snap) => {
    messagesById = new Map();
    snap.forEach((d) => messagesById.set(d.id, { id: d.id, ...d.data() }));
    renderMessages();
    if (scrollPinned) scrollToBottom();
  }, (e) => console.error("messages error", e));

  renderMessages();
  scrollToBottom();
}

function esc(s) {
  const d = document.createElement("div");
  d.textContent = s == null ? "" : String(s);
  return d.innerHTML;
}

function tsToNum(ts) {
  if (!ts) return 0;
  return ts.seconds ? ts.seconds * 1000 : new Date(ts).getTime() || 0;
}

function fmtTime(ts) {
  if (!ts) return "";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

/* =================== Rendering =================== */
function renderMessages() {
  const list = $("#message-list");
  const empty = $("#message-empty");
  const sorted = Array.from(messagesById.values()).sort((a, b) => tsToNum(a.createdAt) - tsToNum(b.createdAt));
  empty.classList.toggle("d-none", sorted.length > 0);

  const frag = document.createDocumentFragment();
  sorted.forEach((m) => {
    frag.appendChild(messageEl(m));
  });
  list.innerHTML = "";
  list.appendChild(frag);
}

function messageEl(m) {
  const isMyMsg = m.senderUid === currentUser.uid;
  const isTeacherMsg = m.role === "teacher";
  const isRoomOwner = activeRoom && activeRoom.data.createdBy === currentUser.uid;
  const canManage = isMyMsg || isRoomOwner;
  const canEdit = canManage;
  const canDelete = canManage;

  const row = document.createElement("div");
  row.className = "message-row " + (isTeacherMsg ? "teacher-row" : "student-row");
  row.dataset.msgId = m.id;

  const bubble = document.createElement("div");
  bubble.className = "message-bubble";

  const meta = document.createElement("span");
  meta.className = "message-meta";
  meta.textContent = m.name || "Unknown";

  const text = document.createElement("div");
  text.className = "message-text";
  text.textContent = m.text;

  const ts = document.createElement("span");
  ts.className = "message-timestamp";
  ts.textContent =
    (m.updatedAt ? fmtTime(m.updatedAt) + " (edited)" : fmtTime(m.createdAt));

  bubble.appendChild(meta);
  bubble.appendChild(text);
  bubble.appendChild(ts);

  if (canEdit && canDelete) {
    const actions = document.createElement("div");
    actions.className = "message-actions";

    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.className = "btn-action";
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => beginEdit(m));
    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.className = "btn-action";
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", () => deleteMessage(m));
    actions.appendChild(editBtn);
    actions.appendChild(delBtn);
    bubble.appendChild(actions);
  }

  row.appendChild(bubble);
  return row;
}

async function beginEdit(m) {
  const list = $("#message-list");
  const row = list.querySelector('[data-msg-id="' + m.id + '"]');
  if (!row) return;
  const bubble = row.querySelector(".message-bubble");

  const textNode = bubble.querySelector(".message-text");
  textNode.style.display = "none";

  const editor = document.createElement("div");
  editor.className = "msg-editor";
  const ta = document.createElement("textarea");
  ta.className = "form-control";
  ta.rows = 2;
  ta.maxLength = 1000;
  ta.value = m.text;
  const buttons = document.createElement("div");
  buttons.className = "d-flex gap-2 mt-2";

  const save = document.createElement("button");
  save.type = "button";
  save.className = "btn btn-sm btn-primary";
  save.textContent = "Save";
  const cancel = document.createElement("button");
  cancel.type = "button";
  cancel.className = "btn btn-sm btn-outline-secondary";
  cancel.textContent = "Cancel";

  cancel.addEventListener("click", () => {
    editor.remove();
    textNode.style.display = "";
  });

  save.addEventListener("click", async () => {
    const val = ta.value.trim();
    if (!val) return;
    try {
      await updateDoc(doc(activeRoom.ref, "messages", m.id), {
        text: val,
        updatedAt: serverTimestamp(),
      });
      editor.remove();
      textNode.style.display = "";
    } catch (e) {
      console.error(e);
      const err = editor.querySelector(".editor-error");
      err.classList.remove("d-none");
      err.textContent = "Could not save: " + (e.message || e.code);
    }
  });

  buttons.appendChild(save);
  buttons.appendChild(cancel);
  editor.appendChild(ta);
  editor.appendChild(buttons);

  const err = document.createElement("div");
  err.className = "editor-error small text-danger mt-1 d-none";
  editor.appendChild(err);

  bubble.appendChild(editor);
  ta.focus();
}

async function deleteMessage(m) {
  if (!confirm("Delete this message?")) return;
  try {
    await deleteDoc(doc(activeRoom.ref, "messages", m.id));
  } catch (e) {
    console.error(e);
    composerError("Could not delete: " + (e.message || e.code));
  }
}

/* =================== Composer =================== */
$("#form-message").addEventListener("submit", async (ev) => {
  ev.preventDefault();
  const input = $("#input-message");
  const text = input.value.trim();
  if (!text || !activeRoom) return;

  try {
    await addDoc(collection(activeRoom.ref, "messages"), {
      text,
      senderUid: currentUser.uid,
      name: currentUser.displayName || FALLBACK_NAME,
      role: effectiveRole(currentUser).role,
      createdAt: serverTimestamp(),
    });
    input.value = "";
    scrollToBottom();
  } catch (e) {
    console.error(e);
    composerError("Could not send: " + (e.message || e.code));
  }
});

function composerError(msg) {
  const el = $("#composer-error");
  el.textContent = msg;
  el.classList.remove("d-none");
  setTimeout(() => el.classList.add("d-none"), 4000);
}

function scrollToBottom() {
  const sc = $("#chat-scroll");
  if (sc) sc.scrollTop = sc.scrollHeight;
}

/* =================== Scroll pinning =================== */
$("#chat-scroll").addEventListener("scroll", () => {
  const sc = $("#chat-scroll");
  scrollPinned = sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 40;
});