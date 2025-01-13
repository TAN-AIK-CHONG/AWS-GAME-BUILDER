import { EventBus } from '../EventBus';
import { GameScene } from './GameScene';

export class GameL1 extends GameScene
{
    constructor ()
    {
        super('GameL1');
    }

    create() {
        super.create();
    
        const map = this.make.tilemap({ key: 'l1' });
        const tileset = map.addTilesetImage('tilemap', 'tileset');
    
        const decorations = map.createLayer('Decorations', tileset, 0, 0).setScale(3);
        const foreground = map.createLayer('Foreground', tileset, 0, 0).setScale(3);
        const flag = map.createLayer('Flag', tileset, 0, 0).setScale(3);
    
        foreground.setCollisionByProperty({ collides: true });
        flag.setCollisionByProperty({ flag: true });
    
        this.physics.add.collider(this.dino, foreground);
        this.physics.add.collider(this.dino, flag, this.nextLevel, null, this);
    
        // Access Gems Object Layer
        const gemsObjectLayer = map.getObjectLayer('Gems').objects;  // Get array of gem objects
        this.gems = this.physics.add.group();  // Group to hold gem sprites
    
        gemsObjectLayer.forEach((gemObj) => {
            const gem = this.gems.create(gemObj.x * 3, gemObj.y * 3, 'gemSprite');  // Adjust for scale and origin
            gem.setOrigin(0, 1);  // Object layers use top-left as origin
            gem.setScale(3);  // Match tile scale
            gem.body.setAllowGravity(false);  // Prevent gravity if they are floating gems
        });
    
        // Collision with gems
        this.physics.add.overlap(this.dino, this.gems, this.collectGem, null, this);
    
        this.cameras.main.setBounds(0, 0, map.widthInPixels * 3, map.heightInPixels * 3);
        this.physics.world.setBounds(0, 0, map.widthInPixels * 3, map.heightInPixels * 3);
    
        EventBus.emit('current-scene-ready', this);
    }

    collectGem(dino, gem) {
        gem.destroy(); 
        console.log('Gem collected!');
        // Optionally: Add score or other logic here
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
