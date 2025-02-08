import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { getFirebaseApp } from '../../firebaseConfig'; 

export class Finish extends Scene {
    constructor() {
        super('Finish');
        this.db = getFirestore(getFirebaseApp()); // Initialize Firestore
    }

    init(data) {
        this.elapsedTime = data.time;
    }

    create() {
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
    
        // Create fullscreen invisible background for click detection
        const fullscreenClickZone = this.add.rectangle(0, 0, this.game.config.width * 2, this.game.config.height * 2, 0x000000, 0)
            .setOrigin(0)
            .setDepth(199)
            .setInteractive();
    
        const popupBackground = this.add.rectangle(512, 350, 350, 350, 0x000000, 0.95).setOrigin(0.5);
        const popupTitle = this.add.text(512, 230, "Submit Score", {
            fontFamily: 'Oxanium', fontSize: 40, color: '#ffffff', align: 'left'
        }).setOrigin(0.5);
    
        const timeText = this.add.text(512, 300, `Your Time: ${this.formatTime(this.elapsedTime)}`, {
            fontFamily: 'Oxanium', fontSize: 24, color: '#ffffff', align: 'left'
        }).setOrigin(0.5);
    
        const popupContainer = this.add.container(0, 0, [
            popupBackground,
            popupTitle,
            timeText
        ]).setDepth(200);
    
        // Create a hit area for the popup to stop click propagation
        const popupHitArea = this.add.rectangle(512, 350, 350, 350, 0x000000, 0)
            .setOrigin(0.5)
            .setDepth(200)
            .setInteractive();
    
        popupContainer.add(popupHitArea);
    
        // Stop propagation of clicks inside the popup
        popupHitArea.on('pointerdown', (pointer, x, y, event) => {
            event.stopPropagation();
        });
    
        // Close popup when clicking outside
        fullscreenClickZone.on('pointerdown', () => {
            this.sound.play('buttonClickAudio');
            fullscreenClickZone.destroy();
            popupContainer.destroy();
            if (this.nameInput) this.nameInput.removeElement();
            if (this.scoreSubmittedText) {
                this.scoreSubmittedText.destroy();
                this.scoreSubmittedText = null;
            }
            if (this.submittedText) {
                this.submittedText.destroy();
                this.submittedText = null;
            }
            this.enableButtons();
        });
    
        if (!this.scoresubmitted) {
            this.createNameInput(popupContainer, fullscreenClickZone);
        } else {
            this.scoreSubmittedText = this.add.text(512, 400, 'Score already submitted!', {
                fontFamily: 'Oxanium', fontSize: 20, color: '#ffffff'
            }).setOrigin(0.5).setDepth(200);
            popupContainer.add(this.scoreSubmittedText);
        }
    }
    
    createNameInput(popupContainer, fullscreenClickZone) {
        let form = `<div style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
            <input type="text" name="nameField" placeholder="Enter your name" style="font-size: 20px; width: 200px; text-align: center;" maxlength="20">
        </div>`;
    
        this.nameInput = this.add.dom(512, 360).createFromHTML(form);
    
        const submitButton = this.add.text(512, 420, 'Submit', {
            fontFamily: 'Oxanium',
            fontSize: 24,
            color: '#ffffff',
            backgroundColor: '#411909',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5).setInteractive().setDepth(200);
    
        // Add hover effect
        submitButton.on('pointerover', () => {
            submitButton.setTint(0xffaa00);
            this.sound.play('buttonHoverAudio');
        });
    
        submitButton.on('pointerout', () => {
            submitButton.clearTint();
        });
    
        popupContainer.add(submitButton);
    
        const inputField = this.nameInput.getChildByName('nameField');
    
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
    
        // Stop propagation on input field clicks
        this.nameInput.addListener('pointerdown');
        this.nameInput.on('pointerdown', (event) => {
            event.stopPropagation();
        });
        
        // Stop propagation on submit button clicks
        submitButton.on('pointerdown', (pointer, x, y, event) => {
            event.stopPropagation();
            this.sound.play('buttonClickAudio');
            const playerName = inputField.value.trim() || 'Anonymous';
            this.handleSubmit(playerName, popupContainer, fullscreenClickZone);
            this.nameInput.removeElement();
        });

        // Allow pressing "Enter" to submit
        inputField.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                event.stopPropagation();
                const playerName = inputField.value.trim() || 'Anonymous';
                this.handleSubmit(playerName, popupContainer, fullscreenClickZone);
                this.nameInput.removeElement();
            }
        });
    
        inputField.focus();
    }
    
    async handleSubmit(playerName, popupContainer, fullscreenClickZone) {
        if (this.nameInput) this.nameInput.removeElement();
        
        // Find and destroy the submit button from the container
        popupContainer.each(child => {
            if (child.text === 'Submit') {
                child.destroy();
            }
        });
    
        const loadingMessage = this.add.text(512, 380, 'Loading...', {
            fontFamily: 'Oxanium',
            fontSize: 24,
            color: '#ffffff'
        }).setOrigin(0.5).setDepth(200);
        popupContainer.add(loadingMessage);
    
        try {
            await addDoc(collection(this.db, 'leaderboard'), {
                name: playerName,
                time: this.elapsedTime,
                timestamp: Timestamp.now() // Add submission timestamp
            });
    
            loadingMessage.destroy();
            this.submittedText = this.add.text(512, 380, 'Score submitted!', {
                fontFamily: 'Oxanium',
                fontSize: 24,
                color: '#ffffff'
            }).setOrigin(0.5).setDepth(200);
            popupContainer.add(this.submittedText);
            this.scoresubmitted = true;
    
            // Auto-close the popup after successful submission
            this.time.delayedCall(1500, () => {
                fullscreenClickZone.destroy();
                popupContainer.destroy();
                this.enableButtons();
            });
    
        } catch (error) {
            console.error('Error submitting score:', error);
            loadingMessage.destroy();
            const errorText = this.add.text(512, 380, 'Failed to submit score!', {
                fontFamily: 'Oxanium',
                fontSize: 24,
                color: '#ff0000'
            }).setOrigin(0.5).setDepth(200);
            popupContainer.add(errorText);
        }
    }
    

    async showLeaderboard() {
        this.disableButtons();
        this.currentPage = 0;
        this.entriesPerPage = 10;
    
        // Create fullscreen invisible background for click detection
        const fullscreenClickZone = this.add.rectangle(0, 0, this.game.config.width * 2, this.game.config.height * 2, 0x000000, 0)
            .setOrigin(0)
            .setDepth(199)
            .setInteractive();
    
        // Create popup background and container
        const popupBackground = this.add.rectangle(512, 384, 500, 600, 0x000000, 0.95).setOrigin(0.5);
        const popupTitle = this.add.text(512, 170, "Leaderboard", {
            fontFamily: 'Oxanium', fontSize: 40, color: '#ffffff', align: 'center'
        }).setOrigin(0.5);
    
        // Add loading text
        const loadingText = this.add.text(512, 384, 'Loading leaderboard...', {
            fontFamily: 'Oxanium', fontSize: 24, color: '#ffffff', align: 'center'
        }).setOrigin(0.5);
    
        const popupContainer = this.add.container(0, 0, [
            popupBackground, 
            popupTitle, 
            loadingText
        ]).setDepth(200);
    
        // Create a hit area for the popup to stop click propagation
        const popupHitArea = this.add.rectangle(512, 384, 500, 600, 0x000000, 0)
            .setOrigin(0.5)
            .setDepth(200)
            .setInteractive();
    
        popupContainer.add(popupHitArea);
    
        // Stop propagation of clicks inside the popup
        popupHitArea.on('pointerdown', (pointer, x, y, event) => {
            event.stopPropagation();
        });
    
        // Close popup when clicking outside
        fullscreenClickZone.on('pointerdown', () => {
            this.sound.play('buttonClickAudio');
            fullscreenClickZone.destroy();
            popupContainer.destroy();
            this.enableButtons();
        });
    
        try {
            const q = query(
                collection(this.db, 'leaderboard'), 
                orderBy('time', 'asc'),
                orderBy('timestamp', 'asc')
            );
            const querySnapshot = await getDocs(q);
    
            const leaderboardData = [];
            querySnapshot.forEach(doc => {
                leaderboardData.push(doc.data());
            });
    
            // Remove loading text
            loadingText.destroy();
    
            // Create container for entries that can be updated
            const entriesContainer = this.add.container(0, 0);
            popupContainer.add(entriesContainer);
    
            // Create navigation buttons
            const prevButton = this.add.text(312, 600, '< Previous', {
                fontFamily: 'Oxanium', fontSize: 20, color: '#ffffff',
                backgroundColor: '#411909', padding: { x: 10, y: 5 }
            }).setOrigin(0, 0.5).setInteractive();
    
            const nextButton = this.add.text(712, 600, 'Next >', {
                fontFamily: 'Oxanium', fontSize: 20, color: '#ffffff',
                backgroundColor: '#411909', padding: { x: 10, y: 5 }
            }).setOrigin(1, 0.5).setInteractive();
    
            // Add hover effects for navigation buttons
            [prevButton, nextButton].forEach(button => {
                button.on('pointerover', () => {
                    button.setTint(0xffaa00);
                    this.sound.play('buttonHoverAudio');
                });
                button.on('pointerout', () => {
                    button.clearTint();
                });
                // Stop propagation on button clicks
                button.on('pointerdown', (pointer, x, y, event) => {
                    event.stopPropagation();
                });
            });
    
            popupContainer.add([prevButton, nextButton]);
    
            const updatePageDisplay = () => {
                if (pageText) pageText.destroy();
                pageText = this.add.text(512, 600, 
                    `Page ${this.currentPage + 1} of ${Math.ceil(leaderboardData.length / this.entriesPerPage)}`, {
                    fontFamily: 'Oxanium', fontSize: 20, color: '#ffffff'
                }).setOrigin(0.5);
                popupContainer.add(pageText);
            };
    
            const displayEntries = () => {
                // Clear previous entries
                entriesContainer.removeAll(true);
    
                // Calculate start and end indices for current page
                const startIdx = this.currentPage * this.entriesPerPage;
                const endIdx = Math.min(startIdx + this.entriesPerPage, leaderboardData.length);
                
                // Display current page entries
                for (let i = startIdx; i < endIdx; i++) {
                    const entry = leaderboardData[i];
                    const yPosition = 250 + ((i - startIdx) * 30);
    
                    const rank = this.add.text(332, yPosition, `${i + 1}. `, {
                        fontFamily: 'Oxanium', fontSize: 20, color: '#ffffff', align: 'right'
                    }).setOrigin(0, 0.5);
    
                    const name = this.add.text(382, yPosition, entry.name, {
                        fontFamily: 'Oxanium', fontSize: 20, color: '#ffffff', align: 'left'
                    }).setOrigin(0, 0.5);
    
                    const time = this.add.text(692, yPosition, this.formatTime(entry.time), {
                        fontFamily: 'Oxanium', fontSize: 20, color: '#ffffff', align: 'right'
                    }).setOrigin(1, 0.5);
    
                    entriesContainer.add([rank, name, time]);
                }
    
                // Update navigation button states
                prevButton.setAlpha(this.currentPage > 0 ? 1 : 0.5);
                prevButton.setInteractive(this.currentPage > 0);
                
                const maxPage = Math.ceil(leaderboardData.length / this.entriesPerPage) - 1;
                nextButton.setAlpha(this.currentPage < maxPage ? 1 : 0.5);
                nextButton.setInteractive(this.currentPage < maxPage);
    
                updatePageDisplay();
            };
    
            let pageText;
            displayEntries();
    
            // Add navigation button handlers
            prevButton.on('pointerdown', () => {
                if (this.currentPage > 0) {
                    this.sound.play('buttonClickAudio');
                    this.currentPage--;
                    displayEntries();
                }
            });
    
            nextButton.on('pointerdown', () => {
                if (this.currentPage < Math.ceil(leaderboardData.length / this.entriesPerPage) - 1) {
                    this.sound.play('buttonClickAudio');
                    this.currentPage++;
                    displayEntries();
                }
            });
    
        } catch (error) {
            loadingText.setText('Failed to load leaderboard!').setColor('#ff0000');
            console.error('Error fetching leaderboard:', error);
        }
    }

    formatTime(time) {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}
