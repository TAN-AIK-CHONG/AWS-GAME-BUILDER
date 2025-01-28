import { EventBus } from '../EventBus';
import { GameScene } from './GameScene';

export class GameL2 extends GameScene
{
    constructor ()
    {
        super('GameL2','GameL3');
    }

    create (data)
    {
        super.create(data);

        // Add background
        const bgWidth = this.textures.get('gameBackground1').getSourceImage().width * 3.7;  
        this.backgrounds = [];  // Store all background parts
        for (let i = 0; i < 3; i++) {  // Add enough to cover the screen
            const bg = this.add.image(i * bgWidth, 550, 'gameBackground1').setScale(3.7).setOrigin(0, 0.5);
            this.backgrounds.push(bg);
        }
        this.displayLevel('Level 2');

        // Import tilemap
        const map = this.make.tilemap({ key: 'l2' });
        const tileset = map.addTilesetImage('tilemap', 'tileset');

        // Level layers
        map.createLayer('waterFix', tileset, 0, 0).setScale(3);
        const foreground = map.createLayer('Foreground', tileset, 0, 0).setScale(3);
        map.createLayer('Decorations', tileset, 0, 0).setScale(3);
        const spikes = map.createLayer('Spikes', tileset, 0, 0).setScale(3);
        const flag = map.createLayer('Flag', tileset, 0, 0).setScale(3);
        this.generateGems(map);

        foreground.setCollisionByProperty({ collides: true });
        flag.setCollisionByProperty({ flag: true });
        
        this.spikeGroup = this.physics.add.staticGroup();

        // Create custom physics bodies for each spike tile to adjust the collision area
        spikes.forEachTile(tile => {
            if (tile.properties.collides) {
                // Calculate world position for the spike
                const worldX = tile.pixelX * 3;
                const worldY = tile.pixelY * 3;
                
                // Create an invisible rectangle at the spike's position
                const spikeHitbox = this.add.rectangle(
                    worldX + (tile.width * 3) / 2,  // center X
                    worldY + (tile.height * 3) / 2,  // center Y
                    tile.width * 3,  // width (scaled)
                    tile.height * 3   // height (scaled)
                );
                
                this.physics.add.existing(spikeHitbox, true);  // true makes it static
                
                this.spikeGroup.add(spikeHitbox);

                spikeHitbox.body.setSize(20, 5);  // Adjust 
                
                // Make hitbox invisible
                spikeHitbox.setAlpha(0);
            }
        });

        this.physics.add.collider(this.dino, foreground);
        this.physics.add.collider(this.dino, flag, this.handleFlag, null, this);
        this.physics.add.collider(this.dino, this.spikeGroup, this.loseLife, null, this);
    
    
        // Collision with gems
        this.physics.add.overlap(this.dino, this.gemGroup, this.collectGem, null, this);
        
        //set boundaries
        this.cameras.main.setBounds(0, 0, map.widthInPixels * 3, map.heightInPixels * 3);
        this.physics.world.setBounds(0, 0, map.widthInPixels * 3, map.heightInPixels * 3);


        EventBus.emit('current-scene-ready', this);
    }
}
