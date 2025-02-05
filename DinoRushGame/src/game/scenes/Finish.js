import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { getFirebaseApp } from '../../firebaseConfig'; // Ensure Firebase is initialized properly

export class Finish extends Scene {
    constructor() {
        super('Finish');
        this.db = getFirestore(getFirebaseApp()); // Initialize Firestore
    }

    init(data) {
        this.elapsedTime = data.time;
        this.createNameInput();
    }

    create() {
        this.cameras.main.setBackgroundColor(0x0000ff);
        this.add.image(512, 384, 'background').setAlpha(0.5);

        this.add.text(512, 280, 'Congratulations!\nYou`ve completed the game.', {
            fontFamily: 'Oxanium', fontSize: 50, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8, align: 'center'
        }).setOrigin(0.5).setDepth(100);

        this.add.text(512, 380, `Time: ${this.formatTime(this.elapsedTime)}`, { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

        const mainMenuButton = this.add.text(512, 550, 'Return to Main Menu', {
            fontSize: '24px', fill: '#fff', backgroundColor: '#000', padding: { x: 10, y: 5 }
        }).setOrigin(0.5).setInteractive();

        mainMenuButton.on('pointerup', () => {
            this.scene.start('MainMenu');
            this.removeInputElements();
            this.scene.stop();
        });

        const leaderboardButton = this.add.text(512, 600, 'View Leaderboard', {
            fontSize: '24px', fill: '#fff', backgroundColor: '#000', padding: { x: 10, y: 5 }
        }).setOrigin(0.5).setInteractive();

        leaderboardButton.on('pointerup', () => {
            this.showLeaderboard();
        });

        EventBus.emit('current-scene-ready', this);
    }

    createNameInput() {
        const input = document.createElement('input');
        input.type = 'text';
        input.id = 'nameInput';
        input.maxLength = '20';
        input.placeholder = 'Enter your name';
        input.style.position = 'absolute';
        input.style.left = '880px';
        input.style.top = '500px';
        input.style.transform = 'translateX(-50%)';
        input.style.padding = '8px';
        input.style.width = '200px';
        input.style.textAlign = 'center';
        input.style.fontSize = '16px';
        input.style.borderRadius = '4px';
        input.style.border = '2px solid #000';

        // Prevent game from handling key events when input is focused
        const preventGameKeys = (event) => {
            const blockedKeys = ['w', 'a', 's', 'd', ' '];
            if (blockedKeys.includes(event.key.toLowerCase())) {
                event.stopPropagation();
            }
        };
    
        input.addEventListener('focus', () => {
            window.addEventListener('keydown', preventGameKeys, true);
        });
    
        input.addEventListener('blur', () => {
            window.removeEventListener('keydown', preventGameKeys, true);
        });
        
        const button = document.createElement('button');
        button.textContent = 'Submit Score';
        button.style.position = 'absolute';
        button.style.left = '880px';
        button.style.top = '560px';
        button.style.transform = 'translateX(-50%)';
        button.style.padding = '8px 16px';
        button.style.fontSize = '16px';
        button.style.borderRadius = '4px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.cursor = 'pointer';

        button.addEventListener('click', () => {
            const playerName = input.value.trim() || 'Anonymous';
            this.handleSubmit(playerName);
        });

        document.body.appendChild(input);
        document.body.appendChild(button);
        this.nameInput = input;
        this.submitButton = button;
    }

    async handleSubmit(playerName) {
        try {
            await addDoc(collection(this.db, 'leaderboard'), {
                name: playerName,
                time: this.elapsedTime
            });

            this.nameInput.remove();
            this.submitButton.remove();

            this.add.text(512, 450, 'Score submitted!', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        } catch (error) {
            console.error('Error submitting score:', error);
            this.add.text(512, 100, 'Failed to submit score!', { fontSize: '24px', fill: '#f00' }).setOrigin(0.5);
        }
    }

    async showLeaderboard() {
        try {
            const q = query(collection(this.db, 'leaderboard'), orderBy('time', 'asc'));
            const querySnapshot = await getDocs(q);

            const leaderboardData = [];
            querySnapshot.forEach(doc => {
                leaderboardData.push(doc.data());
            });

            const popup = document.createElement('div');
            popup.style.position = 'absolute';
            popup.style.left = '50%';
            popup.style.top = '50%';
            popup.style.transform = 'translate(-50%, -50%)';
            popup.style.padding = '20px';
            popup.style.backgroundColor = '#fff';
            popup.style.border = '2px solid #000';
            popup.style.zIndex = '1000';
            popup.style.width = '400px';
            popup.style.height = '400px';
            popup.style.maxHeight = '80%';
            popup.style.overflowY = 'auto';

            const closeButton = document.createElement('button');
            closeButton.textContent = 'Close';
            closeButton.style.marginBottom = '10px';
            closeButton.style.padding = '8px 16px';
            closeButton.style.fontSize = '16px';
            closeButton.style.borderRadius = '4px';
            closeButton.style.backgroundColor = '#4CAF50';
            closeButton.style.color = 'white';
            closeButton.style.border = 'none';
            closeButton.style.cursor = 'pointer';

            closeButton.addEventListener('click', () => {
                document.body.removeChild(popup);
            });

            popup.appendChild(closeButton);

            const list = document.createElement('ol');
            list.style.padding = '0';
            list.style.margin = '0';
            list.style.listStyleType = 'decimal';
            list.style.color = '#000';

            leaderboardData.slice(0, 20).forEach(entry => {
                const listItem = document.createElement('li');
                listItem.textContent = `${entry.name}: ${this.formatTime(entry.time)}`;
                listItem.style.margin = '5px 0';
                list.appendChild(listItem);
            });

            popup.appendChild(list);
            document.body.appendChild(popup);
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
        }
    }

    removeInputElements() {
        if (this.nameInput) this.nameInput.remove();
        if (this.submitButton) this.submitButton.remove();
    }

    formatTime(time) {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}
