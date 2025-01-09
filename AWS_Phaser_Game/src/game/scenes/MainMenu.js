import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    logoTween;

    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.add.image(512, 384, 'background');

        this.logo = this.add.image(512, 200, 'logo').setDepth(100);

        // Create a container for the buttons
        const buttonContainer = this.add.container(512, 300);

        // Create Play button with text
        const playButtonImage = this.add.image(0, 0, 'uiButton').setDepth(100).setInteractive();
        const playButtonText = this.add.text(0, 0, 'Play', {
            fontFamily: 'MedievalSharp', fontSize: 24, color: '#411909'
        }).setOrigin(0.5);
        const playButton = this.add.container(0, 0, [playButtonImage, playButtonText]);
        playButtonImage.on('pointerdown', () => {
            this.scene.start('GameL1');
        });

        // Create Options button with text
        const optionsButtonImage = this.add.image(0, 120, 'uiButton').setDepth(100).setInteractive();
        const optionsButtonText = this.add.text(0, 120, 'Options', {
            fontFamily: 'MedievalSharp', fontSize: 24, color: '#411909'
        }).setOrigin(0.5);
        const optionsButton = this.add.container(0, 0, [optionsButtonImage, optionsButtonText]);

        // Create About button with text
        const aboutButtonImage = this.add.image(0, 240, 'uiButton').setDepth(100).setInteractive();
        const aboutButtonText = this.add.text(0, 240, 'About', {
            fontFamily: 'MedievalSharp', fontSize: 24, color: '#411909'
        }).setOrigin(0.5);
        const aboutButton = this.add.container(0, 0, [aboutButtonImage, aboutButtonText]);

        // Create About popup with scroll image background
        const aboutPopupBackground = this.add.image(512, 384, 'scroll').setScale(1);
        const aboutPopupTitle = this.add.text(512, 200, 'About', {
            fontFamily: 'MedievalSharp', fontSize: 40, color: '#411909', align: 'center'
        }).setOrigin(0.5);
        const aboutPopupText = this.add.text(512, 325,
            'This is a side scroller puzzle game inspired by Fireboy and Watergirl, created as a personal project by NTU students' +
            ' Nichlos Lee and Tan Aik Chong. It will no longer be updated. Use WASD to control the character!', {
            fontFamily: 'MedievalSharp', fontSize: 24, color: '#411909', align: 'center', wordWrap: { width: 380 }
        }).setOrigin(0.5);
        const aboutPopupContainer = this.add.container(0, 0, [aboutPopupBackground,aboutPopupTitle, aboutPopupText]).setVisible(false);

        aboutButtonImage.on('pointerdown', () => {
            aboutPopupContainer.setDepth(200);
            aboutPopupContainer.setVisible(true);
        });

        // Close popup on click
        aboutPopupBackground.setInteractive().on('pointerdown', () => {
            aboutPopupContainer.setVisible(false);
        });

        // Add buttons to the container
        buttonContainer.add([playButton, optionsButton, aboutButton]);
                
        EventBus.emit('current-scene-ready', this);
    }

    changeScene ()
    {
        if (this.logoTween)
        {
            this.logoTween.stop();
            this.logoTween = null;
        }

        this.scene.start('GameL1');
    }

    moveLogo (reactCallback)
    {
        if (this.logoTween)
        {
            if (this.logoTween.isPlaying())
            {
                this.logoTween.pause();
            }
            else
            {
                this.logoTween.play();
            }
        }
        else
        {
            this.logoTween = this.tweens.add({
                targets: this.logo,
                x: { value: 750, duration: 3000, ease: 'Back.easeInOut' },
                y: { value: 80, duration: 1500, ease: 'Sine.easeOut' },
                yoyo: true,
                repeat: -1,
                onUpdate: () => {
                    if (reactCallback)
                    {
                        reactCallback({
                            x: Math.floor(this.logo.x),
                            y: Math.floor(this.logo.y)
                        });
                    }
                }
            });
        }
    }
}
