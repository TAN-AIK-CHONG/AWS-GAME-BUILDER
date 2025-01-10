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

        this.add.text(512, 300, 'Game Paused', {
            fontFamily: 'MedievalSharp', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100); 

        // Resume button
        const resumeButtonImage = this.add.image(512, 400, 'uiButton').setDepth(100).setInteractive();
        const resumeButtonText = this.add.text(512, 400, 'Resume', {
            fontFamily: 'MedievalSharp', fontSize: 24, color: '#411909'
        }).setOrigin(0.5);
        
        this.add.container(0, 0, [resumeButtonImage, resumeButtonText]);

        resumeButtonImage.on('pointerdown', () => {
            this.scene.get(this.returnScene).resumeGame();
            this.scene.stop();
        });

        // Main Menu button
        const mainMenuButtonImage = this.add.image(512, 500, 'uiButton').setDepth(100).setInteractive();
        const mainMenuButtonText = this.add.text(512, 500, 'Main Menu', {
            fontFamily: 'MedievalSharp', fontSize: 24, color: '#411909'
        }).setOrigin(0.5);
        
        this.add.container(0, 0, [mainMenuButtonImage, mainMenuButtonText]);

        mainMenuButtonImage.on('pointerdown', () => {
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
            fontFamily: 'MedievalSharp', fontSize: 24, color: '#ffffff', align: 'center'
        }).setOrigin(0.5).setDepth(200);

        // Yes button
        const yesButton = this.add.text(462, 450, 'Yes', {
            fontFamily: 'MedievalSharp', fontSize: 24, color: '#ffffff', backgroundColor: '#411909', padding: { x: 10, y: 5 }
        }).setOrigin(0.5).setInteractive().setDepth(200);

        yesButton.on('pointerdown', () => {
            this.scene.get(this.returnScene).scene.stop();
            this.scene.start('MainMenu');
            this.scene.stop();
        });

        // No button
        const noButton = this.add.text(562, 450, 'No', {
            fontFamily: 'MedievalSharp', fontSize: 24, color: '#ffffff', backgroundColor: '#411909', padding: { x: 10, y: 5 }
        }).setOrigin(0.5).setInteractive().setDepth(200);

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
