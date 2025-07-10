// Sistema de gestión de modales
class ModalManager {
  constructor() {
    this.init();
  }

  init() {
    // Agregar event listeners para abrir modales
    document.addEventListener('click', (e) => {
      const button = e.target.closest('[data-open-modal]');
      if (button) {
        const modalId = button.getAttribute('data-open-modal');
        this.openModal(modalId);
      }
    });

    // Agregar event listeners para cerrar modales
    document.addEventListener('click', (e) => {
      const closeButton = e.target.closest('[data-close-modal]');
      if (closeButton) {
        const modalId = closeButton.getAttribute('data-close-modal');
        this.closeModal(modalId);
      }

      // Cerrar modal al hacer clic en el backdrop
      if (e.target.classList.contains('modal-backdrop')) {
        const modal = e.target.closest('.modal');
        if (modal) {
          this.closeModal(modal.id);
        }
      }
    });

    // Cerrar modal con ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
          this.closeModal(activeModal.id);
        }
      }
    });

    // Manejar envío de formularios
    this.initFormHandlers();
    
    // Inicializar sistema de pestañas
    this.initTabSystem();
    
    // Inicializar modo de edición
    this.initEditMode();
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      // Focus en el primer input del formulario o primer tab
      const firstInput = modal.querySelector('input, select, textarea');
      const firstTab = modal.querySelector('.tab-button');
      
      if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
      } else if (firstTab) {
        setTimeout(() => firstTab.focus(), 100);
      }
    }
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      
      // Limpiar formulario
      const form = modal.querySelector('form');
      if (form) {
        form.reset();
      }
      
      // Resetear modo de edición
      this.disableEditMode(modal);
    }
  }

  initFormHandlers() {
    // Manejar envío de formularios
    document.addEventListener('submit', (e) => {
      const form = e.target;
      if (form.closest('.modal')) {
        e.preventDefault();
        this.handleFormSubmit(form);
      }
    });
  }

  handleFormSubmit(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Simular envío de datos
    console.log('Datos del formulario:', data);
    
    // Mostrar mensaje de éxito
    this.showSuccessMessage(form);
    
    // Cerrar modal después de un breve delay
    setTimeout(() => {
      const modal = form.closest('.modal');
      if (modal) {
        this.closeModal(modal.id);
      }
    }, 1500);
  }

  showSuccessMessage(form) {
    const submitButton = form.querySelector('[type="submit"]');
    if (submitButton) {
      const originalText = submitButton.innerHTML;
      submitButton.innerHTML = `
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        ¡Guardado!
      `;
      submitButton.style.background = '#10b981';
      
      setTimeout(() => {
        submitButton.innerHTML = originalText;
        submitButton.style.background = '';
      }, 1500);
    }
  }

  initTabSystem() {
    document.addEventListener('click', (e) => {
      const tabButton = e.target.closest('.tab-button');
      if (tabButton) {
        const tabId = tabButton.getAttribute('data-tab');
        const modal = tabButton.closest('.modal');
        
        if (modal && tabId) {
          this.switchTab(modal, tabId);
        }
      }
    });
  }

  switchTab(modal, activeTabId) {
    // Desactivar todas las pestañas
    const allTabs = modal.querySelectorAll('.tab-button');
    const allPanels = modal.querySelectorAll('.tab-panel');
    
    allTabs.forEach(tab => tab.classList.remove('active'));
    allPanels.forEach(panel => panel.classList.remove('active'));
    
    // Activar la pestaña seleccionada
    const activeTab = modal.querySelector(`[data-tab="${activeTabId}"]`);
    const activePanel = modal.querySelector(`[data-panel="${activeTabId}"]`);
    
    if (activeTab && activePanel) {
      activeTab.classList.add('active');
      activePanel.classList.add('active');
    }
  }

  initEditMode() {
    document.addEventListener('click', (e) => {
      const editButton = e.target.closest('[data-edit-mode]');
      if (editButton) {
        const action = editButton.getAttribute('data-edit-mode');
        const modal = editButton.closest('.modal');
        
        if (modal) {
          switch (action) {
            case 'enable':
            case 'toggle':
              this.enableEditMode(modal);
              break;
            case 'cancel':
              this.disableEditMode(modal);
              break;
            case 'save':
              this.saveChanges(modal);
              break;
          }
        }
      }
    });
  }

  enableEditMode(modal) {
    modal.classList.add('edit-mode');
    
    // Mostrar/ocultar botones apropiados
    const viewActions = modal.querySelector('.footer-actions.view-mode');
    const editActions = modal.querySelector('.footer-actions.edit-mode');
    
    if (viewActions) viewActions.style.display = 'none';
    if (editActions) editActions.style.display = 'flex';
    
    // Convertir campos editables en inputs
    const editableFields = modal.querySelectorAll('.info-value.editable');
    editableFields.forEach(field => {
      this.convertToInput(field);
    });
  }

  disableEditMode(modal) {
    modal.classList.remove('edit-mode');
    
    // Mostrar/ocultar botones apropiados
    const viewActions = modal.querySelector('.footer-actions.view-mode');
    const editActions = modal.querySelector('.footer-actions.edit-mode');
    
    if (viewActions) viewActions.style.display = 'flex';
    if (editActions) editActions.style.display = 'none';
    
    // Restaurar campos editables
    const editableFields = modal.querySelectorAll('.info-value.editable');
    editableFields.forEach(field => {
      this.convertToText(field);
    });
  }

  convertToInput(field) {
    const currentValue = field.textContent.trim();
    const fieldName = field.getAttribute('data-field');
    
    // Determinar el tipo de input basado en el campo
    let inputType = 'text';
    if (fieldName && fieldName.includes('fecha')) {
      inputType = 'date';
    } else if (fieldName && (fieldName.includes('valor') || fieldName.includes('precio'))) {
      inputType = 'number';
    }
    
    const input = document.createElement('input');
    input.type = inputType;
    input.value = currentValue.replace('€', '').replace(',', '');
    input.className = 'edit-input';
    input.setAttribute('data-original-value', currentValue);
    
    field.innerHTML = '';
    field.appendChild(input);
    
    // Focus en el primer input
    if (!modal.querySelector('.edit-input:focus')) {
      input.focus();
    }
  }

  convertToText(field) {
    const input = field.querySelector('.edit-input');
    if (input) {
      const originalValue = input.getAttribute('data-original-value');
      field.textContent = originalValue;
    }
  }

  saveChanges(modal) {
    const editableFields = modal.querySelectorAll('.info-value.editable');
    const changes = {};
    
    editableFields.forEach(field => {
      const input = field.querySelector('.edit-input');
      if (input) {
        const fieldName = field.getAttribute('data-field');
        const newValue = input.value;
        changes[fieldName] = newValue;
        
        // Actualizar el valor mostrado
        field.textContent = newValue;
      }
    });
    
    // Simular guardado
    console.log('Cambios guardados:', changes);
    
    // Mostrar mensaje de éxito
    const saveButton = modal.querySelector('[data-edit-mode="save"]');
    if (saveButton) {
      const originalText = saveButton.innerHTML;
      saveButton.innerHTML = `
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        ¡Guardado!
      `;
      saveButton.style.background = '#10b981';
      
      setTimeout(() => {
        saveButton.innerHTML = originalText;
        saveButton.style.background = '';
        this.disableEditMode(modal);
      }, 1500);
    }
  }
}

// Funciones globales para compatibilidad
window.openModal = function(modalId) {
  window.modalManager.openModal(modalId);
};

window.closeModal = function(modalId) {
  window.modalManager.closeModal(modalId);
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.modalManager = new ModalManager();
  
  // Agregar estilos para el modo de edición
  const style = document.createElement('style');
  style.textContent = `
    .edit-input {
      width: 100%;
      padding: 6px 8px;
      border: 1px solid #3b82f6;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 500;
      background: white;
      color: #111827;
      outline: none;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    .edit-input:focus {
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
    }
  `;
  document.head.appendChild(style);
});