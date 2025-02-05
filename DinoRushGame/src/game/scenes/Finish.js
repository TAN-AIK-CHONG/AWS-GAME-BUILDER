import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
<<<<<<< HEAD
import { getFirestore, collection, addDoc, getDocs, query } from 'firebase/firestore';
=======
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
>>>>>>> 1c08212aa41127202cc135ec9e79c327f3cac337
import { getFirebaseApp } from '../../firebaseConfig'; // Ensure Firebase is initialized properly

export class Finish extends Scene {
    constructor() {
        super('Finish');
        this.db = getFirestore(getFirebaseApp()); // Initialize Firestore
    }

    init(data) {
        this.elapsedTime = data.time;
    }

    create() {
<<<<<<< HEAD
        this.scoresubmitted = false;
        this.add.image(512, 384, 'background').setAlpha(0.5);

        this.createText();
        this.createButtons();
        EventBus.emit('current-scene-ready', this);
    }

    createText() {
        this.add.text(512, 200, 'You Win!', {
            fontFamily: 'Oxanium', fontSize: 50, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8, align: 'center'
        }).setOrigin(0.5).setDepth(100);
=======
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
>>>>>>> 1c08212aa41127202cc135ec9e79c327f3cac337

        this.add.text(512, 270, `Time: ${this.formatTime(this.elapsedTime)}`, { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
    }

    createButtons() {
        this.createSubmitScoreButton();
        this.createMainMenuButton();
        this.createLeaderboardButton();
    }

    createButton(x, y, text, callback) {
        const buttonImage = this.add.image(x, y, 'uiButton').setDepth(100).setInteractive().setScale(0.35);
        const buttonText = this.add.text(x, y - 10, text, {
            fontFamily: 'Oxanium', fontSize: 18, color: '#411909'
        }).setOrigin(0.5);
        
        this.add.container(0, 0, [buttonImage, buttonText]);

        buttonImage.on('pointerover', () => {
            buttonImage.setTint(0xdddddd); // Lighten button on hover
            this.sound.play('buttonHoverAudio');
        });

        buttonImage.on('pointerout', () => {
            buttonImage.clearTint(); // Clear tint when pointer moves out
        });

        buttonImage.on('pointerdown', () => {
            this.sound.play('buttonClickAudio'); // Play click sound
            callback();
        });

        return buttonImage;
    }

    createSubmitScoreButton() {
        this.submitScoreButton = this.createButton(512, 350, 'Submit Score', () => this.submitScorePopup());
    }

    createMainMenuButton() {
        this.mainMenuButton = this.createButton(512, 450, 'Main Menu', () => {
            this.scene.start('MainMenu');
            this.scene.stop();
        });
    }

    createLeaderboardButton() {
        this.leaderboardButton = this.createButton(512, 550, 'View leaderboard', () => this.showLeaderboard());
    }

    disableButtons() {
        this.submitScoreButton.disableInteractive();
        this.mainMenuButton.disableInteractive();
        this.leaderboardButton.disableInteractive();
    }

    enableButtons() {
        this.submitScoreButton.setInteractive();
        this.mainMenuButton.setInteractive();
        this.leaderboardButton.setInteractive();
    }

    submitScorePopup() {
        this.disableButtons();
    
        const popupBackground = this.add.rectangle(512, 350, 350, 350, 0x000000, 0.95).setOrigin(0.5);
        const popupTitle = this.add.text(512, 230, "Submit Score", {
            fontFamily: 'Oxanium', fontSize: 40, color: '#ffffff', align: 'left'
        }).setOrigin(0.5);
    
        const timeText = this.add.text(512, 290, `Your Time: ${this.formatTime(this.elapsedTime)}`, {
            fontFamily: 'Oxanium', fontSize: 24, color: '#ffffff', align: 'left'
        }).setOrigin(0.5);
        
        const closeButton = this.add.text(512, 460, 'Close', {
            fontFamily: 'Oxanium', fontSize: 24, color: '#ffffff', backgroundColor: '#411909', padding: { x: 10, y: 5 }
        }).setOrigin(0.5).setInteractive().setDepth(200);

        // Add hover effect
        closeButton.on('pointerover', () => {
            closeButton.setTint(0xffaa00);
        });

        closeButton.on('pointerout', () => {
            closeButton.clearTint();
        });

    
        // Close popup on click
        closeButton.on('pointerdown', () => {
            popupContainer.setVisible(false);
            this.enableButtons();
            if (this.nameInput) this.nameInput.removeElement();
            if (this.scoreSubmittedText) {
                this.scoreSubmittedText.destroy();
                this.scoreSubmittedText = null;
            }
            if (this.submittedText) {
                this.submittedText.destroy();
                this.submittedText = null;
            }
        });

        const popupContainer = this.add.container(0, 0, [popupBackground, popupTitle, timeText, closeButton]).setVisible(false).setDepth(200);
    
        if (!this.scoresubmitted) {
            this.createNameInput();
        } else {
            this.scoreSubmittedText = this.add.text(512, 350, 'Score already submitted!', { fontSize: '20px', fill: '#fff' }).setOrigin(0.5).setDepth(200);
        }
        
        popupContainer.setVisible(true);
    }
    

    createNameInput() {
        let form = `<div style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
            <input type="text" name="nameField" placeholder="Enter your name" style="font-size: 20px; width: 200px; text-align: center;" maxlength="20">
            <input type="button" name="SubmitButton" value="Submit" style="font-size: 20px;">
        </div>`;
    
        this.nameInput = this.add.dom(512, 380).createFromHTML(form);
    
        const inputField = this.nameInput.getChildByName('nameField');
        const submitButton = this.nameInput.getChildByName('SubmitButton');
    
        // Prevent game from handling key events when input is focused
        const preventGameKeys = (event) => {
            const blockedKeys = ['w', 'a', 's', 'd', ' '];
            if (blockedKeys.includes(event.key.toLowerCase())) {
                event.stopPropagation();
            }
        };
    
        inputField.addEventListener('focus', () => {
            window.addEventListener('keydown', preventGameKeys, true);
        });
    
        inputField.addEventListener('blur', () => {
            window.removeEventListener('keydown', preventGameKeys, true);
        });
<<<<<<< HEAD
    
        submitButton.addEventListener('click', () => {
            const playerName = inputField.value.trim() || 'Anonymous';
            this.handleSubmit(playerName);
            this.nameInput.removeElement();  // Remove the input form after submission
        });
    
        inputField.focus();
    }

    async handleSubmit(playerName) {
        if (this.nameInput) this.nameInput.removeElement();
        const loadingMessage = this.add.text(512, 380, 'Loading...', {
            fontSize: '24px',
            fill: '#fff'
        }).setOrigin(0.5).setDepth(200);
=======
        
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
>>>>>>> 1c08212aa41127202cc135ec9e79c327f3cac337
        try {
            await addDoc(collection(this.db, 'leaderboard'), {
                name: playerName,
                time: this.elapsedTime
            });

<<<<<<< HEAD
            loadingMessage.destroy();
            this.submittedText = this.add.text(512, 380, 'Score submitted!', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5).setDepth(200);
            this.scoresubmitted = true;

        } catch (error) {
            console.error('Error submitting score:', error);
            this.add.text(512, 400, 'Failed to submit score!', { fontSize: '24px', fill: '#f00' }).setOrigin(0.5);
=======
            this.nameInput.remove();
            this.submitButton.remove();

            this.add.text(512, 450, 'Score submitted!', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        } catch (error) {
            console.error('Error submitting score:', error);
            this.add.text(512, 100, 'Failed to submit score!', { fontSize: '24px', fill: '#f00' }).setOrigin(0.5);
>>>>>>> 1c08212aa41127202cc135ec9e79c327f3cac337
        }
    }

    async showLeaderboard() {
<<<<<<< HEAD
        // Show loading text
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

        // Add loading text
        const loadingText = document.createElement('p');
        loadingText.textContent = 'Loading leaderboard...';
        loadingText.style.textAlign = 'center';
        loadingText.style.paddingTop = '100px';
        loadingText.style.fontSize = '18px';
        loadingText.style.color = '#000';
        popup.appendChild(loadingText);

        document.body.appendChild(popup);

        try {
            const q = query(collection(this.db, 'leaderboard')/*, orderBy('time', 'asc')*/);
=======
        try {
            const q = query(collection(this.db, 'leaderboard'), orderBy('time', 'asc'));
>>>>>>> 1c08212aa41127202cc135ec9e79c327f3cac337
            const querySnapshot = await getDocs(q);

            const leaderboardData = [];
            querySnapshot.forEach(doc => {
                leaderboardData.push(doc.data());
            });
<<<<<<< HEAD
            
=======

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

>>>>>>> 1c08212aa41127202cc135ec9e79c327f3cac337
            const list = document.createElement('ol');
            list.style.padding = '0';
            list.style.margin = '0';
            list.style.listStyleType = 'decimal';
            list.style.color = '#000';
<<<<<<< HEAD

            leaderboardData.slice(0, 20).forEach(entry => {
                const listItem = document.createElement('li');
                listItem.textContent = `${entry.name}: ${this.formatTime(entry.time)}`;
                listItem.style.margin = '5px 0';
                list.appendChild(listItem);
            });
            popup.removeChild(loadingText);
            popup.appendChild(list);
            
        } catch (error) {
            popup.removeChild(loadingText);
            console.error('Error fetching leaderboard:', error);
        }
=======

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
>>>>>>> 1c08212aa41127202cc135ec9e79c327f3cac337
    }

    formatTime(time) {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}
