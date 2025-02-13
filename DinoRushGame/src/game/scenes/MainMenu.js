import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { getFirestore, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { getFirebaseApp } from '../../firebaseConfig'; 

export class MainMenu extends Scene
{
    logoTween;

    constructor ()
    {
        super('MainMenu');
        this.db = getFirestore(getFirebaseApp()); // Initialize Firestore
    }

    createButton(x, y, text, callback) {
        const buttonImage = this.add.image(x, y, 'uiButton').setInteractive().setScale(0.35);
        const buttonText = this.add.text(x, y - 10, text, {
            fontFamily: 'Oxanium', fontSize: 18, color: '#411909'
        }).setOrigin(0.5);
    
        const button = this.add.container(x, y, [buttonImage, buttonText]);
    
        // Add hover effect
        buttonImage.on('pointerover', () => {
            buttonImage.setTint(0xdddddd); // Lighten button on hover
            this.sound.play('buttonHoverAudio');
        });
    
        buttonImage.on('pointerout', () => {
            buttonImage.clearTint(); // Clear tint when pointer moves out
        });
    
        // Handle button click
        buttonImage.on('pointerdown', () => {
            this.sound.play('buttonClickAudio'); // Play click sound
            this.time.delayedCall(200, callback);
        });
    
        return button;
    }

    createPopup(title, text) {
        const popupBackground = this.add.rectangle(512, 384, 450, 400, 0x000000, 0.95).setOrigin(0.5).setDepth(100);
        const popupTitle = this.add.text(512, 250, title, {
            fontFamily: 'Oxanium', fontSize: 40, color: '#ffffff', align: 'left'
        }).setOrigin(0.5);
        const popupText = this.add.text(512, 380, text, {
            fontFamily: 'Oxanium', fontSize: 24, color: '#ffffff', align: 'left', wordWrap: { width: 380 }
        }).setOrigin(0.5);
        const popupContainer = this.add.container(0, 0, [popupBackground, popupTitle, popupText]).setVisible(false);

        // Close popup on click
        popupBackground.setInteractive().on('pointerdown', () => {
            popupContainer.setVisible(false);
        });

        return popupContainer;
    }

    create ()
    {
        this.add.image(512, 384, 'background');

        this.logo = this.add.image(512, 200, 'logo').setDepth(100);

        
        /*THIS IS A HOTFIX! DO SOMEHTING ELSE LIKE HAVE A DEDICATED MUSIC SCENE INSTEAD*/ 
        // Check if there's already a sound instance for bgMusicMainMenu
        const existingMusic = this.sound.get('bgMusicMainMenu');
        
        // If not found or not playing, create and play it
        if (!existingMusic) {
            this.bgMusic = this.sound.add('bgMusicMainMenu', { loop: true });
            this.bgMusic.play();
        } else {
            // Optionally, ensure it's still looping
            if (!existingMusic.isPlaying) {
                existingMusic.play();
            }
        }

        // Create a container for the buttons
        const buttonContainer = this.add.container(512, 300);

        // Create Play button
        const playButton = this.createButton(0, 0, 'Play', () => {
            this.scene.start('GameL1',{spawnX: 512, spawnY: 505});
        });

        // Create Instructions button
        const instructionsButton = this.createButton(0, 60, 'How To Play', () => {
            instructionsPopupContainer.setDepth(200);
            instructionsPopupContainer.setVisible(true);
        });

        // Create About button
        const aboutButton = this.createButton(0, 120, 'About', () => {
            aboutPopupContainer.setDepth(200);
            aboutPopupContainer.setVisible(true);
        });

        // Create About popup
        const aboutPopupContainer = this.createPopup('About', 
            'This is a 2D side scroller game created as a personal project and will no longer be updated, but contributions are welcome.' +
            ' Click on the github button on the top right to access the repository and submit pull requests. Enjoy!');

        // Create Instructions popup
        const instructionsPopupContainer = this.createPopup('How To Play', 
            'Use the WASD or Arrow keys to move your character. Avoid obstacles and enemies, '+
            'and collect all gems before reaching the flag to proceed to the next level!');

        // Add buttons to the container
        buttonContainer.add([playButton, instructionsButton, aboutButton]);

        // Add GitHub button
        const githubButton = this.add.image(970, 40, 'github').setScale(0.15).setInteractive().setScrollFactor(0).setDepth(100);
        this.add.container(0, 0, [githubButton]).setDepth(100);

        // Add hover effect
        githubButton.on('pointerover', () => {
            githubButton.setTint(0xdddddd);

            this.contributeText = this.add.text(githubButton.x, githubButton.y + 35, 'Contribute', {
                fontFamily: 'Oxanium', fontSize: '18px', fill: '#ffffff', stroke: '#000000', strokeThickness: 2
            }).setOrigin(0.5).setScrollFactor(0).setDepth(100);
        });

        githubButton.on('pointerout', () => {
            githubButton.clearTint();

            // Remove "contribute" message
            if (this.contributeText) {
                this.contributeText.destroy();
            }
        });

        githubButton.on('pointerdown', () => {
            window.open('https://github.com/TAN-AIK-CHONG/Dino-Rush-Game', '_blank');
        });

        // Add Leaderboard button
        const leaderboardButton = this.add.image(925, 42, 'leaderboard').setScale(0.07).setInteractive().setScrollFactor(0).setDepth(100);
        this.add.container(0, 0, [leaderboardButton]).setDepth(100);

        // Add hover effect
        leaderboardButton.on('pointerover', () => {
            leaderboardButton.setTint(0xdddddd);

            this.leaderboardText = this.add.text(leaderboardButton.x, leaderboardButton.y + 33, 'Leaderboard', {
                fontFamily: 'Oxanium', fontSize: '18px', fill: '#ffffff', stroke: '#000000', strokeThickness: 2
            }).setOrigin(0.5).setScrollFactor(0).setDepth(100);
        });

        leaderboardButton.on('pointerout', () => {
            leaderboardButton.clearTint();

            // Remove "leaderboard" message
            if (this.leaderboardText) {
                this.leaderboardText.destroy();
            }
        });

        leaderboardButton.on('pointerdown', () => {
            this.showLeaderboard();
        });

        EventBus.emit('current-scene-ready', this);
    }

    async showLeaderboard() {
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

    // Format time in seconds to MM:SS format
    formatTime(time) {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    changeScene ()
    {
        this.scene.start('GameL1',{spawnX: 512, spawnY: 500});
    }
}