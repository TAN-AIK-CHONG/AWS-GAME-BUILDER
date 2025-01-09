import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class PauseMenu extends Scene
{
    constructor ()
    {
        super('PauseMenu');
    }


    create ()
    {
        this.add.image(512, 384, 'background');

        this.add.text(512, 384, 'Game Paused', {
            fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100); 

        // Resume button
        const resumeButton = this.add.text(512, 450, 'Resume', {
            fontFamily: 'Arial Black', fontSize: 32, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100).setInteractive();

        resumeButton.on('pointerdown', () => {
            this.scene.get('Game').resumeGame();
            this.scene.stop();
        });

        EventBus.emit('current-scene-ready', this);
    }

    // this portion need to edit, need to unpause the game at the correct level
    changeScene ()
    {
        this.scene.start('GameL1');
    }
}
