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

        this.logo = this.add.image(512, 300, 'logo').setDepth(100);

        // Create a container for the buttons
        const buttonContainer = this.add.container(512, 400);

        // Add Play button image
        const playButton = this.add.image(0, 0, 'uiButton').setDepth(100).setInteractive();
        playButton.on('pointerdown', () => {
            this.scene.start('Game');
        });

        // Add Options button image
        const optionsButton = this.add.image(0, 100, 'uiButton').setDepth(100).setInteractive();
        optionsButton.on('pointerdown', () => {
            // Add logic to handle options
            console.log('Options button clicked');
        });

        // Add About button image
        const aboutButton = this.add.image(0, 200, 'uiButton').setDepth(100).setInteractive();
        aboutButton.on('pointerdown', () => {
            // Add logic to handle about
            console.log('About button clicked');
        });

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

        this.scene.start('Game');
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
