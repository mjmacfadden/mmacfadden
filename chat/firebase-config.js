// Firebase project configuration (public values - safe to expose in a web client)
// Project: backchannel-chat-d0d9c
window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyAzyhN1_s5GjuYIPhl6ct3P4dKmXdVGgLE",
  authDomain: "backchannel-chat-d0d9c.firebaseapp.com",
  projectId: "backchannel-chat-d0d9c",
  storageBucket: "backchannel-chat-d0d9c.firebasestorage.app",
  messagingSenderId: "936215396137",
  appId: "1:936215396137:web:81c9f3b349cdc5f74cc138",
};

// Access rules:
//  - Allow your personal Gmail(s): edit this list (their Gmail, one per line)
//  - Allow Glensbrook: the app also allows every @glenbrook225.org email
// NOTE: The FIRST email in this list is the "owner". It must ALSO appear,
//       escaped, in firestore.rules (function isOwnerEmail).
window.BACKCHANNEL_ADMIN_EMAILS = [
  "mikemacfadden@gmail.com",
];

// Display name used when a message is from an approved domain account with no Gmail name.
window.BACKCHANNEL_FALLBACK_NAME = "User";