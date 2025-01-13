import { EventBus } from '../EventBus';
import { GameScene } from './GameScene';

export class GameL1 extends GameScene
{
    constructor ()
    {
        super('GameL1');
    }

    create ()
    {
        super.create();
        // display level number for 3 seconds
        const levelText = this.add.text(512, 50, 'Level 1', {
            fontFamily: 'MedievalSharp', fontSize: '48px', fill: '#000000'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(100);


        this.time.delayedCall(3000, () => {
            this.tweens.add({
                targets: levelText,
                alpha: 0,
                duration: 1000,
                ease: 'Power2',
                onComplete: () => {
                    levelText.destroy();
                }
            });
        });

        //import tilemap
        const map = this.make.tilemap({ key: 'l1' });

        const tileset = map.addTilesetImage('tilemap', 'tileset');

        const decorations = map.createLayer('Decorations', tileset, 0, 0).setScale(3);
        //const gems = map.createLayer('Gems', tileset, 0, 0);
        const foreground = map.createLayer('Foreground', tileset, 0, 0).setScale(3);
        const flag = map.createLayer('Flag', tileset, 0, 0).setScale(3);

        foreground.setCollisionByProperty({ collides: true });
        decorations.setCollisionByProperty({ collides: true });
        flag.setCollisionByProperty({ flag: true });
        
        
        this.physics.add.collider(this.dino, foreground);
        this.physics.add.collider(this.dino, decorations, this.loseLife, null, this);
        this.physics.add.collider(this.dino, flag, this.nextLevel, null, this);
        

        //set boundaries
        this.cameras.main.setBounds(0, 0, map.widthInPixels * 3, map.heightInPixels * 3);
        this.physics.world.setBounds(0, 0, map.widthInPixels * 3, map.heightInPixels * 3);

        EventBus.emit('current-scene-ready', this);
    }

    update ()
    {
        super.update();
    }

    pauseGame ()
    {
        this.scene.pause();
        this.scene.launch('PauseMenu', { returnScene: 'GameL1' });
    }

    resumeGame ()
    {
        this.scene.resume('GameL1');
    }

    nextLevel () 
    {
        this.scene.start('GameL2');
    }

    changeScene() {
        this.scene.start('GameL2');
    }
}
