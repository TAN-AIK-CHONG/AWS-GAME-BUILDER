import { EventBus } from '../EventBus';
import { GameScene } from './GameScene';

export class GameL2 extends GameScene
{
    constructor ()
    {
        super('GameL2','GameOver');
    }

    create (data)
    {
        super.create(data);

        // display level number for 3 seconds
        const levelText = this.add.text(512, 50, 'Level 2', {
            fontFamily: 'Oxanium', fontSize: '48px', fill: '#000000', stroke: '#ffffff', strokeThickness: 8
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
        const map = this.make.tilemap({ key: 'l2' });

        const tileset = map.addTilesetImage('tilemap', 'tileset');

        const decorations = map.createLayer('Decorations', tileset, 0, 0).setScale(3);
        const foreground = map.createLayer('Foreground', tileset, 0, 0).setScale(3);
        const spikes = map.createLayer('Spikes', tileset, 0, 0).setScale(3);

        foreground.setCollisionByProperty({ collides: true });
        spikes.setCollisionByProperty({ collides: true });
        
        this.physics.add.collider(this.dino, foreground);
        this.physics.add.collider(this.dino, spikes, this.loseLife, null, this);  
        
        //set boundaries
        this.cameras.main.setBounds(0, 0, map.widthInPixels * 3, map.heightInPixels * 3);
        this.physics.world.setBounds(0, 0, map.widthInPixels * 3, map.heightInPixels * 3);


        EventBus.emit('current-scene-ready', this);
    }
}
