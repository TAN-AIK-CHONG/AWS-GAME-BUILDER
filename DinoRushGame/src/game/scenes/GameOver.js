import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class GameOver extends Scene
{
    constructor ()
    {
        super('GameOver');
    }

    init (data) {
        this.elapsedTime = data.time;
    }

    create ()
    {
        this.cameras.main.setBackgroundColor(0xff0000);

        this.add.image(512, 384, 'background').setAlpha(0.5);

        this.add.text(512, 280, 'Game Over', {
            fontFamily: 'Oxanium', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100); 

        this.add.text(512, 350, `Time: ${this.elapsedTime}`, { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

        // Main Menu Button
        const mainMenuButtonImage = this.add.image(512, 440, 'uiButton').setDepth(100).setInteractive().setScale(0.35);
        const mainMenuButtonText = this.add.text(512, 430, 'Back to Main Menu', {
            fontFamily: 'Oxanium', fontSize: 18, color: '#411909'
        }).setOrigin(0.5);
        
        this.add.container(0, 0, [mainMenuButtonImage, mainMenuButtonText]);

        // Add hover effect
        mainMenuButtonImage.on('pointerover', () => {
            mainMenuButtonImage.setTint(0xdddddd); // Lighten button on hover
        });
    
        mainMenuButtonImage.on('pointerout', () => {
            mainMenuButtonImage.clearTint(); // Clear tint when pointer moves out
        });

        mainMenuButtonImage.on('pointerdown', () => {
            this.scene.start('MainMenu');
            this.scene.stop();
        });

        EventBus.emit('current-scene-ready', this);
    }

    changeScene ()
    {
        this.scene.start('MainMenu');
    }
}
