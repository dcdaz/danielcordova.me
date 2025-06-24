var mermaidId;

mermaid.initialize(
  {
    theme: 'base',
    themeVariables: {
      primaryColor: '#81A1C1',
    },
    look: 'handDrawn',
    securityLevel: 'loose',
  }
);

function openModal(element) {
  mermaidId = Math.random().toString(36).slice(2);
  element.id = mermaidId;
  document.getElementById("mermaid-modal").classList.add('is-active');
  document.getElementById("mermaid-figure").appendChild(element.children[0]);
}

function closeModal() {
  try {
   document.getElementById(mermaidId).appendChild(document.getElementById("mermaid-figure").children[0]); 
  } catch (_) {}
  document.getElementById("mermaid-modal").classList.remove('is-active');
}

document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('keydown', (event) => {
    if(event.key === "Escape") {
      closeModal();
    }
  });

  document.getElementById("mermaid-modal").addEventListener('click', () => {
    closeModal();
  });

  document.getElementById("mermaid-close").addEventListener('click', () => {
    closeModal();
  });
});