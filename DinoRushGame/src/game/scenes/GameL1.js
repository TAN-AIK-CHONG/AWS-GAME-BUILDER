import { EventBus } from '../EventBus';
import { GameScene } from './GameScene';

export class GameL1 extends GameScene
{
    constructor ()
    {
        super('GameL1', 'GameL2');
    }

    create() {
        super.create();

        
        // display level number for 3 seconds
        const levelText = this.add.text(512, 50, 'Level 1', {
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
        const map = this.make.tilemap({ key: 'l1' });
        const tileset = map.addTilesetImage('tilemap', 'tileset');
    
        const decorations = map.createLayer('Decorations', tileset, 0, 0).setScale(3);
        const foreground = map.createLayer('Foreground', tileset, 0, 0).setScale(3);
        const flag = map.createLayer('Flag', tileset, 0, 0).setScale(3);
    
        foreground.setCollisionByProperty({ collides: true });
        flag.setCollisionByProperty({ flag: true });
    
        this.physics.add.collider(this.dino, foreground);
        this.physics.add.collider(this.dino, flag, this.handleFlag, null, this);
    
        // Access Gems Object Layer
        const gemsObjectLayer = map.getObjectLayer('Gems').objects;  // Get array of gem objects
        this.gemGroup = this.physics.add.group();  // Group to hold gem sprites
    
        gemsObjectLayer.forEach((gemObj) => {
            const gem = this.gemGroup.create(gemObj.x * 3, gemObj.y * 3, 'gem');  // Adjust for scale and origin
            gem.setOrigin(0, 1);  // Object layers use top-left as origin
            gem.setScale(3);  // Match tile scale
            gem.body.setAllowGravity(false);  // Prevent gravity if they are floating gems
        });
    
        // Collision with gems
        this.physics.add.overlap(this.dino, this.gemGroup, this.collectGem, null, this);
    
        this.cameras.main.setBounds(0, 0, map.widthInPixels * 3, map.heightInPixels * 3);
        this.physics.world.setBounds(0, 0, map.widthInPixels * 3, map.heightInPixels * 3);
    
        EventBus.emit('current-scene-ready', this);
    }
}