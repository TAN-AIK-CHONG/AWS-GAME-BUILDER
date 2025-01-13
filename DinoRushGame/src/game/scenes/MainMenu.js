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
        });
    
        buttonImage.on('pointerout', () => {
            buttonImage.clearTint(); // Clear tint when pointer moves out
        });
    
        // Handle button click
        buttonImage.on('pointerdown', callback);
    
        return button;
    }

    createPopup(title, text) {
        const popupBackground = this.add.rectangle(512, 384, 450, 400, 0x000000, 0.95).setOrigin(0.5).setDepth(100);
        const popupTitle = this.add.text(512, 250, title, {
            fontFamily: 'Oxanium', fontSize: 40, color: '#ffffff', align: 'center'
        }).setOrigin(0.5);
        const popupText = this.add.text(512, 380, text, {
            fontFamily: 'Oxanium', fontSize: 24, color: '#ffffff', align: 'center', wordWrap: { width: 380 }
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

        // Create a container for the buttons
        const buttonContainer = this.add.container(512, 300);

        // Create Play button
        const playButton = this.createButton(0, 0, 'Play', () => {
            this.scene.start('GameL1');
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

        EventBus.emit('current-scene-ready', this);
    }

    changeScene ()
    {
        this.scene.start('GameL1');
    }
}