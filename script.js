// Raffle Application JavaScript
class RaffleApp {
    constructor() {
        this.participants = [];
        this.isRaffleRunning = false;
        this.lastWinner = null;
        
        this.initializeElements();
        this.bindEvents();
        this.loadFromStorage();
        this.updateUI();
    }
    
    initializeElements() {
        // Input elements
        this.singleNameInput = document.getElementById('singleName');
        this.bulkNamesTextarea = document.getElementById('bulkNames');
        this.addSingleBtn = document.getElementById('addSingleBtn');
        this.addBulkBtn = document.getElementById('addBulkBtn');
        
        // Participants elements
        this.participantsList = document.getElementById('participantsList');
        this.participantCount = document.getElementById('participantCount');
        this.clearAllBtn = document.getElementById('clearAllBtn');
        
        // Raffle elements
        this.startRaffleBtn = document.getElementById('startRaffleBtn');
        this.raffleAnimation = document.getElementById('raffleAnimation');
        this.raffleWheel = document.getElementById('raffleWheel');
        this.winnerDisplay = document.getElementById('winnerDisplay');
        this.newRaffleBtn = document.getElementById('newRaffleBtn');
        this.removeWinnerBtn = document.getElementById('removeWinnerBtn');
        
        // Storage elements
        this.saveListBtn = document.getElementById('saveListBtn');
        this.loadListBtn = document.getElementById('loadListBtn');
    }
    
    bindEvents() {
        // Add participants events
        this.addSingleBtn.addEventListener('click', () => this.addSingleParticipant());
        this.singleNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addSingleParticipant();
        });
        
        this.addBulkBtn.addEventListener('click', () => this.addBulkParticipants());
        
        // Raffle events
        this.startRaffleBtn.addEventListener('click', () => this.startRaffle());
        this.newRaffleBtn.addEventListener('click', () => this.resetRaffle());
        this.removeWinnerBtn.addEventListener('click', () => this.removeWinner());
        
        // Management events
        this.clearAllBtn.addEventListener('click', () => this.clearAllParticipants());
        
        // Storage events
        this.saveListBtn.addEventListener('click', () => this.saveToStorage());
        this.loadListBtn.addEventListener('click', () => this.loadFromStorage());
    }
    
    addSingleParticipant() {
        const name = this.singleNameInput.value.trim();
        
        if (!name) {
            this.showFeedback('Por favor ingresa un nombre', 'error');
            return;
        }
        
        if (this.participants.includes(name)) {
            this.showFeedback('Este nombre ya existe en la lista', 'error');
            return;
        }
        
        this.participants.push(name);
        this.singleNameInput.value = '';
        this.updateUI();
        this.showFeedback('Participante agregado exitosamente', 'success');
    }
    
    addBulkParticipants() {
        const bulkText = this.bulkNamesTextarea.value.trim();
        
        if (!bulkText) {
            this.showFeedback('Por favor ingresa al menos un nombre', 'error');
            return;
        }
        
        const names = bulkText.split('\n')
            .map(name => name.trim())
            .filter(name => name.length > 0);
        
        if (names.length === 0) {
            this.showFeedback('No se encontraron nombres válidos', 'error');
            return;
        }
        
        let addedCount = 0;
        let duplicateCount = 0;
        
        names.forEach(name => {
            if (!this.participants.includes(name)) {
                this.participants.push(name);
                addedCount++;
            } else {
                duplicateCount++;
            }
        });
        
        this.bulkNamesTextarea.value = '';
        this.updateUI();
        
        let message = `${addedCount} participante(s) agregado(s)`;
        if (duplicateCount > 0) {
            message += `, ${duplicateCount} duplicado(s) ignorado(s)`;
        }
        
        this.showFeedback(message, 'success');
    }
    
    removeParticipant(name) {
        const index = this.participants.indexOf(name);
        if (index > -1) {
            this.participants.splice(index, 1);
            this.updateUI();
            this.showFeedback('Participante eliminado', 'success');
        }
    }
    
    clearAllParticipants() {
        if (this.participants.length === 0) {
            this.showFeedback('La lista ya está vacía', 'error');
            return;
        }
        
        if (confirm('¿Estás seguro de que quieres eliminar todos los participantes?')) {
            this.participants = [];
            this.resetRaffle();
            this.updateUI();
            this.showFeedback('Lista de participantes limpiada', 'success');
        }
    }
    
    startRaffle() {
        if (this.participants.length < 2) {
            this.showFeedback('Necesitas al menos 2 participantes para el sorteo', 'error');
            return;
        }
        
        if (this.isRaffleRunning) return;
        
        this.isRaffleRunning = true;
        this.startRaffleBtn.style.display = 'none';
        this.winnerDisplay.classList.add('hidden');
        this.raffleAnimation.classList.remove('hidden');
        
        this.animateRaffle();
    }
    
    animateRaffle() {
        // Populate wheel with participant names
        this.populateWheel();
        
        // Add spinning class for animation
        this.raffleWheel.classList.add('spinning');
        
        // Calculate random winner after animation
        setTimeout(() => {
            this.selectWinner();
        }, 3000);
    }
    
    populateWheel() {
        this.raffleWheel.innerHTML = '';
        
        // Create segments for each participant
        this.participants.forEach((name, index) => {
            const segment = document.createElement('div');
            segment.className = 'wheel-segment';
            segment.textContent = name;
            
            // Calculate rotation for each segment
            const angle = (360 / this.participants.length) * index;
            segment.style.transform = `rotate(${angle}deg)`;
            
            // Alternate colors for better visibility
            segment.style.backgroundColor = index % 2 === 0 ? '#e2e8f0' : '#f7fafc';
            
            this.raffleWheel.appendChild(segment);
        });
    }
    
    selectWinner() {
        // Remove spinning animation
        this.raffleWheel.classList.remove('spinning');
        
        // Select random winner
        const winnerIndex = Math.floor(Math.random() * this.participants.length);
        this.lastWinner = this.participants[winnerIndex];
        
        // Hide animation and show winner
        setTimeout(() => {
            this.raffleAnimation.classList.add('hidden');
            this.showWinner();
        }, 500);
    }
    
    showWinner() {
        this.winnerDisplay.classList.remove('hidden');
        this.winnerDisplay.querySelector('.winner-name').textContent = this.lastWinner;
        this.isRaffleRunning = false;
    }
    
    resetRaffle() {
        this.winnerDisplay.classList.add('hidden');
        this.raffleAnimation.classList.add('hidden');
        this.startRaffleBtn.style.display = 'inline-block';
        this.lastWinner = null;
        this.isRaffleRunning = false;
    }
    
    removeWinner() {
        if (this.lastWinner && confirm(`¿Eliminar a "${this.lastWinner}" de la lista de participantes?`)) {
            this.removeParticipant(this.lastWinner);
            this.resetRaffle();
        }
    }
    
    updateUI() {
        this.updateParticipantsList();
        this.updateParticipantCount();
        this.updateStartButton();
    }
    
    updateParticipantsList() {
        if (this.participants.length === 0) {
            this.participantsList.innerHTML = '<p class="empty-state">No hay participantes agregados</p>';
            return;
        }
        
        this.participantsList.innerHTML = this.participants.map(name => `
            <div class="participant-item">
                <span class="participant-name">${this.escapeHtml(name)}</span>
                <button class="remove-participant" onclick="app.removeParticipant('${this.escapeHtml(name)}')">
                    Eliminar
                </button>
            </div>
        `).join('');
    }
    
    updateParticipantCount() {
        this.participantCount.textContent = this.participants.length;
    }
    
    updateStartButton() {
        this.startRaffleBtn.disabled = this.participants.length < 2;
    }
    
    saveToStorage() {
        if (this.participants.length === 0) {
            this.showFeedback('No hay participantes para guardar', 'error');
            return;
        }
        
        const listName = prompt('Nombre para guardar la lista:', 'Mi Lista de Sorteo');
        if (!listName) return;
        
        try {
            const savedLists = JSON.parse(localStorage.getItem('raffleLists') || '{}');
            savedLists[listName] = [...this.participants];
            localStorage.setItem('raffleLists', JSON.stringify(savedLists));
            
            this.showFeedback(`Lista "${listName}" guardada exitosamente`, 'success');
        } catch (error) {
            this.showFeedback('Error al guardar la lista', 'error');
            console.error('Storage error:', error);
        }
    }
    
    loadFromStorage() {
        try {
            const savedLists = JSON.parse(localStorage.getItem('raffleLists') || '{}');
            const listNames = Object.keys(savedLists);
            
            if (listNames.length === 0) {
                this.showFeedback('No hay listas guardadas', 'error');
                return;
            }
            
            let listOptions = 'Listas disponibles:\n';
            listNames.forEach((name, index) => {
                listOptions += `${index + 1}. ${name} (${savedLists[name].length} participantes)\n`;
            });
            
            const selection = prompt(listOptions + '\nIngresa el número de la lista a cargar:');
            if (!selection) return;
            
            const selectedIndex = parseInt(selection) - 1;
            if (selectedIndex >= 0 && selectedIndex < listNames.length) {
                const selectedListName = listNames[selectedIndex];
                
                if (this.participants.length > 0) {
                    const shouldReplace = confirm(
                        '¿Reemplazar la lista actual o agregar a la existente?\n' +
                        'OK = Reemplazar, Cancelar = Agregar'
                    );
                    
                    if (shouldReplace) {
                        this.participants = [...savedLists[selectedListName]];
                    } else {
                        // Add non-duplicate participants
                        savedLists[selectedListName].forEach(name => {
                            if (!this.participants.includes(name)) {
                                this.participants.push(name);
                            }
                        });
                    }
                } else {
                    this.participants = [...savedLists[selectedListName]];
                }
                
                this.resetRaffle();
                this.updateUI();
                this.showFeedback(`Lista "${selectedListName}" cargada exitosamente`, 'success');
            } else {
                this.showFeedback('Selección inválida', 'error');
            }
        } catch (error) {
            this.showFeedback('Error al cargar la lista', 'error');
            console.error('Storage error:', error);
        }
    }
    
    showFeedback(message, type) {
        // Remove existing feedback
        const existingFeedback = document.querySelector('.success-feedback, .error-feedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }
        
        // Create new feedback element
        const feedback = document.createElement('div');
        feedback.className = `${type}-feedback`;
        feedback.textContent = message;
        
        // Insert after the first section
        const firstSection = document.querySelector('.input-section');
        firstSection.parentNode.insertBefore(feedback, firstSection.nextSibling);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.remove();
            }
        }, 3000);
    }
    
    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new RaffleApp();
});

// Additional utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}