import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    logoTween;

    constructor ()
    {
        super('MainMenu');
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
            this.scene.start('GameL1',{spawnX: 512, spawnY: 500});
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
            'This is a side scroller puzzle game created as a personal project by NTU students' +
            ' Nichlos Lee and Tan Aik Chong. It will no longer be updated. Enjoy!');

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

        EventBus.emit('current-scene-ready', this);
    }

    changeScene ()
    {
        this.scene.start('GameL1',{spawnX: 512, spawnY: 500});
    }
}