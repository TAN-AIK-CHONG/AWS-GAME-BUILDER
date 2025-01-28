import { EventBus } from '../EventBus';
import { GameScene } from './GameScene';

export class GameL1 extends GameScene
{
    constructor ()
    {
        super('GameL1', 'GameL2');
    }

    create(data) {
        super.create(data);

        // Add background
        const bg = this.add.image(512, 50, 'gameBackground1').setScale(3.7);
        this.displayMessage('Level 1');

        // Import tilemap
        const map = this.make.tilemap({ key: 'l1' });
        const tileset = map.addTilesetImage('tilemap', 'tileset');

        // Level layers
        map.createLayer('waterFix', tileset, 0, 0).setScale(3);
        const foreground = map.createLayer('Foreground', tileset, 0, 0).setScale(3);
        map.createLayer('Decorations', tileset, 0, 0).setScale(3);
        const flag = map.createLayer('Flag', tileset, 0, 0).setScale(3);
        this.generateGems(map);
    
        foreground.setCollisionByProperty({ collides: true });
        flag.setCollisionByProperty({ flag: true });
        
        // Collisions
        this.physics.add.collider(this.dino, foreground);
        this.physics.add.collider(this.dino, flag, this.handleFlag, null, this);
        this.physics.add.overlap(this.dino, this.gemGroup, this.collectGem, null, this);
    
        this.cameras.main.setBounds(0, 0, map.widthInPixels * 3, map.heightInPixels * 3);
        this.physics.world.setBounds(0, 0, map.widthInPixels * 3, map.heightInPixels * 3);
    
        EventBus.emit('current-scene-ready', this);
    }

}