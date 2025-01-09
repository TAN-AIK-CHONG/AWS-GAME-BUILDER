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

        EventBus.emit('current-scene-ready', this);
    }

    // this portion need to edit, need to unpause the game at the correct level
    changeScene ()
    {
        this.scene.start('GameL1');
    }
}
