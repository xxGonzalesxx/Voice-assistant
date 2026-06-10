
const chat = document.getElementById('chat');

function now() {
  return new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' });
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function scrollDown() {
  chat.scrollTop = chat.scrollHeight;
}

function addMsg(text, role) {
  const isUser = role === 'user';
  const div = document.createElement('div');
  div.className = 'msg ' + role;
  div.innerHTML = `
    <div class="msg-avatar">
      <i class="ti ${isUser ? 'ti-user' : 'ti-train'}" aria-hidden="true"></i>
    </div>
    <div>
      <div class="msg-bubble">${escapeHtml(text)}</div>
      <div class="msg-time">${now()}</div>
    </div>`;
  chat.appendChild(div);
  scrollDown();
}

function showTyping() {
  const div = document.createElement('div');
  div.className = 'msg bot';
  div.id = 'typing';
  div.innerHTML = `
    <div class="msg-avatar"><i class="ti ti-train" aria-hidden="true"></i></div>
    <div class="typing">
      <div class="dot"></div><div class="dot"></div><div class="dot"></div>
    </div>`;
  chat.appendChild(div);
  scrollDown();
}

function removeTyping() {
  const t = document.getElementById('typing');
  if (t) t.remove();
}