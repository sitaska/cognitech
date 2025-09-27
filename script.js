// Aplicación de Sorteos - Script Principal
class SorteoApp {
    constructor() {
        this.participants = this.loadFromLocalStorage();
        this.isAnimating = false;
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateParticipantsList();
        this.updateUI();
    }

    bindEvents() {
        document.getElementById('addBulkBtn')?.addEventListener('click', () => this.addBulkParticipants());
        document.getElementById('addIndividualBtn')?.addEventListener('click', () => this.addIndividualParticipant());
        document.getElementById('startRaffleBtn')?.addEventListener('click', () => this.startRaffle());
        document.getElementById('clearAllBtn')?.addEventListener('click', () => this.clearAllParticipants());
        document.getElementById('newRaffleBtn')?.addEventListener('click', () => this.newRaffle());

        document.getElementById('individualInput')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addIndividualParticipant();
        });
    }

    loadFromLocalStorage() {
        try {
            const stored = localStorage.getItem('sorteoParticipants');
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    }

    saveToLocalStorage() {
        localStorage.setItem('sorteoParticipants', JSON.stringify(this.participants));
    }

    addBulkParticipants() {
        const bulkInput = document.getElementById('bulkInput');
        const text = bulkInput.value.trim();
        if (!text) return;

        const names = text.split(/[,\n]/).map(name => name.trim()).filter(name => name);
        let added = 0;

        names.forEach(name => {
            if (!this.participants.includes(name)) {
                this.participants.push(name);
                added++;
            }
        });

        bulkInput.value = '';
        this.updateParticipantsList();
        this.updateUI();
        this.saveToLocalStorage();
        alert(`${added} participantes agregados`);
    }

    addIndividualParticipant() {
        const input = document.getElementById('individualInput');
        const name = input.value.trim();
        if (!name) return;

        if (!this.participants.includes(name)) {
            this.participants.push(name);
            input.value = '';
            this.updateParticipantsList();
            this.updateUI();
            this.saveToLocalStorage();
            alert(`${name} agregado`);
        } else {
            alert('Ese nombre ya existe');
        }
    }

    removeParticipant(index) {
        this.participants.splice(index, 1);
        this.updateParticipantsList();
        this.updateUI();
        this.saveToLocalStorage();
    }

    updateParticipantsList() {
        const list = document.getElementById('participantsList');
        const count = document.getElementById('participantCount');
        
        if (count) count.textContent = this.participants.length;
        if (!list) return;
        
        if (this.participants.length === 0) {
            list.innerHTML = '<p>No hay participantes</p>';
            return;
        }

        list.innerHTML = this.participants.map((name, index) => `
            <div style="display: flex; justify-content: space-between; align-items: center; margin: 5px 0; padding: 10px; background: #f0f0f0; border-radius: 5px;">
                <span>${name}</span>
                <button onclick="app.removeParticipant(${index})" style="background: red; color: white; border: none; border-radius: 3px; padding: 5px;">
                    Eliminar
                </button>
            </div>
        `).join('');
    }

    updateUI() {
        const startBtn = document.getElementById('startRaffleBtn');
        if (!startBtn) return;
        
        startBtn.disabled = this.participants.length === 0 || this.isAnimating;
        startBtn.textContent = this.participants.length === 0 ? 
            '🎯 EMPEZAR SORTEO' : 
            `🎯 EMPEZAR SORTEO (${this.participants.length})`;
    }

    async startRaffle() {
        if (this.participants.length === 0 || this.isAnimating) return;

        this.isAnimating = true;
        this.updateUI();
        
        const animationArea = document.getElementById('animationArea');
        const winnerDisplay = document.getElementById('winnerDisplay');
        
        if (animationArea) {
            animationArea.style.display = 'block';
            animationArea.innerHTML = '<div style="font-size: 2rem; animation: pulse 1s infinite;">🎲 Sorteando...</div>';
        }

        // Simular animación
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const winnerIndex = Math.floor(Math.random() * this.participants.length);
        const winner = this.participants[winnerIndex];
        
        if (animationArea) animationArea.style.display = 'none';
        
        if (winnerDisplay) {
            winnerDisplay.innerHTML = `
                <div style="text-align: center; padding: 20px; background: linear-gradient(45deg, #ff6b6b, #4ecdc4); color: white; border-radius: 10px; margin: 20px 0;">
                    <div style="font-size: 2rem; margin-bottom: 10px;">🏆 ¡GANADOR! 🏆</div>
                    <div style="font-size: 2.5rem; font-weight: bold;">${winner}</div>
                    <div style="font-size: 1.5rem; margin-top: 10px;">🎉 🎊 🎈</div>
                </div>
            `;
            winnerDisplay.style.display = 'block';
        }
        
        this.isAnimating = false;
        this.updateUI();
        
        const newRaffleBtn = document.getElementById('newRaffleBtn');
        if (newRaffleBtn) newRaffleBtn.style.display = 'inline-block';
    }

    newRaffle() {
        const winnerDisplay = document.getElementById('winnerDisplay');
        const newRaffleBtn = document.getElementById('newRaffleBtn');
        
        if (winnerDisplay) winnerDisplay.style.display = 'none';
        if (newRaffleBtn) newRaffleBtn.style.display = 'none';
    }

    clearAllParticipants() {
        if (this.participants.length === 0) return;

        const count = this.participants.length;
        this.participants = [];
        this.updateParticipantsList();
        this.updateUI();
        this.saveToLocalStorage();
        
        const winnerDisplay = document.getElementById('winnerDisplay');
        const newRaffleBtn = document.getElementById('newRaffleBtn');
        
        if (winnerDisplay) winnerDisplay.style.display = 'none';
        if (newRaffleBtn) newRaffleBtn.style.display = 'none';
        
        alert(`Lista limpia (${count} participantes eliminados)`);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.app = new SorteoApp();
});
