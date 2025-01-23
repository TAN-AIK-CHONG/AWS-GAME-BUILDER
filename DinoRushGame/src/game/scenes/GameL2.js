import { EventBus } from '../EventBus';
import { GameScene } from './GameScene';

export class GameL2 extends GameScene
{
    constructor ()
    {
        super('GameL2','Finish');
    }

    create (data)
    {
        super.create(data);

        const bgWidth = this.textures.get('gameBackground1').getSourceImage().width * 3.7;  // Width of the image after scaling

        this.backgrounds = [];  // Store all background parts
        for (let i = 0; i < 3; i++) {  // Add enough to cover the screen
            const bg = this.add.image(i * bgWidth, 550, 'gameBackground1').setScale(3.7).setOrigin(0, 0.5);
            this.backgrounds.push(bg);
        }

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

        const foreground = map.createLayer('Foreground', tileset, 0, 0).setScale(3);
        const decorations = map.createLayer('Decorations', tileset, 0, 0).setScale(3);
        const spikes = map.createLayer('Spikes', tileset, 0, 0).setScale(3);
        const flag = map.createLayer('Flag', tileset, 0, 0).setScale(3);

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
        
        //set boundaries
        this.cameras.main.setBounds(0, 0, map.widthInPixels * 3, map.heightInPixels * 3);
        this.physics.world.setBounds(0, 0, map.widthInPixels * 3, map.heightInPixels * 3);


        EventBus.emit('current-scene-ready', this);
    }

    //Override changeScene for last level to go to finish scene
    changeScene ()
    {
        this.scene.start('Finish', {time: this.elapsedTime });
        this.scene.stop();
    }

    // for now override handleFlag to go to finish scene, but put it at last level
    handleFlag () 
    {
        if (this.gems === 3) {
            this.sound.play('nextlevel');
            this.scene.start('Finish', {time: this.elapsedTime });
        }
        else {
            const message = this.add.text(512, 50, 'Not enough gems!', {
                fontFamily: 'Oxanium', fontSize: '48px', fill: '#ff0000', stroke: '#ffffff', strokeThickness: 2
            }).setOrigin(0.5).setScrollFactor(0).setDepth(100);


            this.time.delayedCall(1000, () => {
                this.tweens.add({
                    targets: message,
                    alpha: 0,
                    duration: 1000,
                    ease: 'Power2',
                    onComplete: () => {
                        message.destroy();
                    }
                });
            });
        }
    }
}
