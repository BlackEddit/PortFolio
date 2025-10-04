// ===== MÓDULO DE COLABORACIÓN =====

function showCollaborationModal() {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/80 backdrop-blur z-[60] flex items-center justify-center p-4';
  modal.innerHTML = `
    <div class="bg-gradient-to-br from-slate-900/95 via-zinc-800/90 to-slate-950/95 rounded-2xl p-8 max-w-md w-full border border-zinc-700/50">
      <div class="text-center">
        <div class="text-4xl mb-4">💬</div>
        <h2 class="text-2xl font-bold text-zinc-200 mb-4">¿Hablamos?</h2>
        <p class="text-zinc-400 mb-6">Si algo te interesó, siempre estoy abierto a una buena conversación.</p>
        
        <div class="space-y-3 mb-6">
          <button onclick="openLinkedIn()" class="w-full px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-semibold transition-all flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            Conectemos en LinkedIn
          </button>
          
          <button onclick="sendEmail()" class="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black font-semibold rounded-xl transition-all flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            Enviar Email
          </button>
          
          <button onclick="buyMeACoffee()" class="w-full px-6 py-3 bg-amber-600 hover:bg-amber-500 rounded-xl text-white font-semibold transition-all flex items-center justify-center gap-2">
            <span>☕</span>
            Buy me a coffee
          </button>
        </div>
        
        <button onclick="closeModal()" class="text-yellow-400 hover:text-yellow-300 text-sm transition-all">
          Cerrar
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

function closeModal() {
  const modal = document.querySelector('.fixed.inset-0.bg-black\\/80');
  if (modal) modal.remove();
}

function openLinkedIn() {
  window.open('https://www.linkedin.com/in/edgar-paul-ra-se/', '_blank');
  closeModal();
}

function sendEmail() {
  const subject = encodeURIComponent('¡Hablemos sobre un proyecto de BI/Data!');
  const body = encodeURIComponent('Hola Edgar,\\n\\nVi tu portafolio y me interesa platicar sobre...\\n\\n');
  window.location.href = `mailto:edgarsanchezcampos@gmail.com?subject=${subject}&body=${body}`;
  closeModal();
}

function buyMeACoffee() {
  // Aquí puedes poner tu link real de Buy Me a Coffee
  window.open('https://buymeacoffee.com/edgarsanchez', '_blank');
  closeModal();
}

// Exportar funciones para uso global
if (typeof window !== 'undefined') {
  window.showCollaborationModal = showCollaborationModal;
  window.closeModal = closeModal;
  window.openLinkedIn = openLinkedIn;
  window.sendEmail = sendEmail;
  window.buyMeACoffee = buyMeACoffee;
}