(() => {
  const modal = document.getElementById('app-modal');
  const modalContent = document.getElementById('modal-content');
  const toast = document.getElementById('toast');
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.getElementById('main-nav');
  const originalBalance = '$12,480.50';
  let balanceVisible = true;
  let toastTimer;

  document.getElementById('year').textContent = String(new Date().getFullYear());

  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    mainNav.classList.toggle('open', !isOpen);
  });
  mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
    mainNav.classList.remove('open');
  }));

  document.getElementById('toggle-balance').addEventListener('click', event => {
    balanceVisible = !balanceVisible;
    document.getElementById('demo-balance').textContent = balanceVisible ? originalBalance : '••••••••';
    event.currentTarget.setAttribute('aria-label', balanceVisible ? 'Hide balance' : 'Show balance');
    event.currentTarget.title = balanceVisible ? 'Hide balance' : 'Show balance';
  });

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
  }

  function openModal(type) {
    if (type === 'locations') {
      modalContent.innerHTML = `<div class="modal-body"><h2 id="modal-title">We're here to help.</h2><p>This concept website doesn't operate branches or provide banking services.</p><div class="location-row"><span>◎</span><div><strong>Customer support</strong><br><span style="font-size:10px;color:#758297">Use the support details provided by your actual financial institution.</span></div></div><div class="location-row"><span>⌑</span><div><strong>Security help</strong><br><span style="font-size:10px;color:#758297">Never share passwords or one-time verification codes.</span></div></div><p class="modal-small">HarborBank is a fictional demo brand. No locations or customer accounts are connected.</p></div>`;
    } else {
      modalContent.innerHTML = `<div class="modal-body"><h2 id="modal-title">Welcome to HarborBank</h2><p>Explore the sign-in experience using this safe, non-functional preview.</p><div class="demo-banner"><strong>Demo mode</strong><br>This form does not authenticate users, create accounts, or send information to a server. Do not enter a real password.</div><form id="demo-form"><label class="form-label" for="demo-email">Email address</label><input class="form-input" id="demo-email" type="email" autocomplete="off" placeholder="you@example.com" required><label class="form-label" for="demo-password">Demo passphrase</label><input class="form-input" id="demo-password" type="password" autocomplete="off" placeholder="Enter any sample text" required><button class="button button-primary modal-submit" type="submit">Preview sign-in <span>→</span></button><div id="form-message" aria-live="polite"></div></form><p class="modal-small">No credentials are stored or transmitted. This is not a real banking login. A production implementation needs secure server-side authentication, session controls, rate limiting, and account recovery.</p></div>`;
      document.getElementById('demo-form').addEventListener('submit', event => {
        event.preventDefault();
        const message = document.getElementById('form-message');
        message.className = 'demo-banner';
        message.textContent = 'Preview only: authentication is not connected yet. No sign-in occurred.';
        document.getElementById('demo-password').value = '';
      });
    }
    if (typeof modal.showModal === 'function') {
      modal.showModal();
      document.body.classList.add('modal-open');
    } else {
      showToast('Your browser does not support this preview dialog.');
    }
  }

  document.querySelectorAll('[data-modal]').forEach(button => button.addEventListener('click', () => openModal(button.dataset.modal)));
  document.querySelector('.modal-close').addEventListener('click', () => modal.close());
  modal.addEventListener('click', event => {
    if (event.target === modal) modal.close();
  });
  modal.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    modalContent.innerHTML = '';
  });
  document.getElementById('back-to-top').addEventListener('click', event => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  });

  // Prevent placeholder learning links from suggesting an article exists.
  document.querySelectorAll('.learn-card').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    showToast('Learning articles are planned for a future build phase.');
  }));
})();