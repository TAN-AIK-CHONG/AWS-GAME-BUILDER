import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class PauseMenu extends Scene
{
    constructor ()
    {
        super('PauseMenu');
    }

    init (data) {
        this.returnScene = data.returnScene;
    }


    create ()
    {
        this.add.image(512, 384, 'background');

        this.add.text(512, 280, 'Paused', {
            fontFamily: 'Oxanium', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100); 

        // Resume button
        const resumeButtonImage = this.add.image(512, 380, 'uiButton').setDepth(100).setInteractive().setScale(0.35);
        const resumeButtonText = this.add.text(512, 370, 'Resume', {
            fontFamily: 'Oxanium', fontSize: 18, color: '#411909'
        }).setOrigin(0.5);
        
        this.add.container(0, 0, [resumeButtonImage, resumeButtonText]);

        // Add hover effect
        resumeButtonImage.on('pointerover', () => {
            resumeButtonImage.setTint(0xdddddd); // Lighten button on hover
            this.sound.play('buttonHoverAudio');
        });
    
        resumeButtonImage.on('pointerout', () => {
            resumeButtonImage.clearTint(); // Clear tint when pointer moves out
        });

        resumeButtonImage.on('pointerdown', () => {
            this.sound.play('buttonClickAudio'); // Play click sound
            this.scene.get(this.returnScene).resumeGame(this.returnScene);
            this.scene.stop();
        });

        // Main Menu button
        const mainMenuButtonImage = this.add.image(512, 490, 'uiButton').setDepth(100).setInteractive().setScale(0.35);
        const mainMenuButtonText = this.add.text(512, 480, 'Main Menu', {
            fontFamily: 'Oxanium', fontSize: 18, color: '#411909'
        }).setOrigin(0.5);
        
        this.add.container(0, 0, [mainMenuButtonImage, mainMenuButtonText]);

        // Add hover effect
        mainMenuButtonImage.on('pointerover', () => {
            mainMenuButtonImage.setTint(0xdddddd); // Lighten button on hover
            this.sound.play('buttonHoverAudio');
        });
    
        mainMenuButtonImage.on('pointerout', () => {
            mainMenuButtonImage.clearTint(); // Clear tint when pointer moves out
        });

        mainMenuButtonImage.on('pointerdown', () => {
            this.sound.play('buttonClickAudio'); // Play click sound
            this.showConfirmationPrompt(resumeButtonImage, mainMenuButtonImage);
        });

        EventBus.emit('current-scene-ready', this);
    }


    showConfirmationPrompt (resumeButtonImage, mainMenuButtonImage)
    {
        // Disable other buttons
        resumeButtonImage.disableInteractive();
        mainMenuButtonImage.disableInteractive();

        // Prompt
        const promptBackground = this.add.rectangle(512, 384, 700, 200, 0x000000, 0.9).setOrigin(0.5).setDepth(100);

        const promptText = this.add.text(512, 350, 'Are you sure you want to return to the main menu?\nYour progress will be lost.', {
            fontFamily: 'Oxanium', fontSize: 24, color: '#ffffff', align: 'center'
        }).setOrigin(0.5).setDepth(200);

        // Yes button
        const yesButton = this.add.text(462, 440, 'Yes', {
            fontFamily: 'Oxanium', fontSize: 24, color: '#ffffff', backgroundColor: '#411909', padding: { x: 10, y: 5 }
        }).setOrigin(0.5).setInteractive().setDepth(200);

        // Add hover effect
        yesButton.on('pointerover', () => {
            yesButton.setTint(0xffaa00);
        });
    
        yesButton.on('pointerout', () => {
            yesButton.clearTint();
        });

        yesButton.on('pointerdown', () => {
            this.scene.get(this.returnScene).scene.stop();
            this.scene.start('MainMenu');
            this.scene.stop();
        });

        // No button
        const noButton = this.add.text(562, 440, 'No', {
            fontFamily: 'Oxanium', fontSize: 24, color: '#ffffff', backgroundColor: '#411909', padding: { x: 10, y: 5 }
        }).setOrigin(0.5).setInteractive().setDepth(200);

        // Add hover effect
        noButton.on('pointerover', () => {
            noButton.setTint(0xffaa00);
        });
    
        noButton.on('pointerout', () => {
            noButton.clearTint();
        });

        noButton.on('pointerdown', () => {
            promptBackground.destroy();
            promptText.destroy();
            yesButton.destroy();
            noButton.destroy();
            // Re-enable other buttons
            resumeButtonImage.setInteractive();
            mainMenuButtonImage.setInteractive();
        });
    }

    changeScene ()
    {
        this.scene.get(this.returnScene).resumeGame();
        this.scene.stop();
    }
}
