import { EventBus } from '../EventBus';
import { GameScene } from './GameScene';

export class GameL3 extends GameScene {
    constructor() {
        super('GameL3', 'Finish');
    }

    create(data) {
        super.create(data);

        // Add background
        const bgWidth = this.textures.get('gameBackground1').getSourceImage().width * 3.7; // Width of the image after scaling
        this.backgrounds = []; // Store all background parts
        for (let i = 0; i < 3; i++) { // Add enough to cover the screen
            const bg = this.add.image(i * bgWidth, 150, 'gameBackground1').setScale(3.7).setOrigin(0, 0.5);
            this.backgrounds.push(bg);
        }
        this.displayMessage('Level 3');

        // Import tilemap
        const map = this.make.tilemap({ key: 'l3' });
        const tileset = map.addTilesetImage('tilemap', 'tileset');

        // Level layers
        map.createLayer('waterFix', tileset, 0, 0).setScale(3);
        const foreground = map.createLayer('Foreground', tileset, 0, 0).setScale(3);
        map.createLayer('Decorations', tileset, 0, 0).setScale(3);
        const spikes = map.createLayer('Spikes', tileset, 0, 0).setScale(3);
        this.spikeGroup = this.generateSpikes(spikes);
        const flag = map.createLayer('Flag', tileset, 0, 0).setScale(3);

        foreground.setCollisionByProperty({ collides: true });
        flag.setCollisionByProperty({ flag: true });
        
        // Objects
        // Gems
        this.generateGems(map);
        // Enemies
        const enemiesObjectLayer = map.getObjectLayer('Enemies').objects;
        this.enemiesGroup = this.physics.add.group();
        enemiesObjectLayer.forEach((enemyObj) => {
            const enemy = this.physics.add.sprite(enemyObj.x * 3, enemyObj.y * 3, 'enemy11');
            enemy.setOrigin(0.5); // Top-left origin as per Tiled
            enemy.body.setCollideWorldBounds(true);
            enemy.setScale(3);
            enemy.body.setAllowGravity(true); // Enable gravity for enemies
            enemy.play('crabWalk'); // Play walk animation
            enemy.body.setSize(20,20); // Adjust size as needed
            enemy.body.setOffset(2,4); // Adjust offset as needed

            console.log(`Before: Velocity X = ${enemy.body.velocity.x}`);
            this.physics.add.collider(this.enemiesGroup, foreground);
            this.enemiesGroup.add(enemy);
        });

        // Collisions
        this.physics.add.collider(this.dino, foreground);
        this.physics.add.collider(this.dino, flag, this.handleFlag, null, this);
        this.physics.add.collider(this.dino, this.spikeGroup, this.loseLife, null, this);
        this.physics.add.collider(this.dino, this.enemiesGroup, this.handleEnemyCollision, null, this)
        this.physics.add.overlap(this.dino, this.gemGroup, this.collectGem, null, this);

        //set boundaries
        this.cameras.main.setBounds(0, 0, map.widthInPixels * 3, map.heightInPixels * 3);
        this.physics.world.setBounds(0, 0, map.widthInPixels * 3, map.heightInPixels * 3);

        EventBus.emit('current-scene-ready', this);
    }

    //Override changeScene for last level to go to finish scene
    changeScene() {
        this.scene.start('Finish', { time: this.elapsedTime });
        this.scene.stop();
    }

    // for now override handleFlag to go to finish scene, but put it at last level
    handleFlag() {
        if (this.gems === 3) {
            this.sound.play('nextlevel');
            this.scene.start('Finish', { time: this.elapsedTime });
        } else {
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

    update() {
        super.update();
        const speed = 250;
        
        this.enemiesGroup.children.iterate((enemy) => {
            // If not moving, start moving right
            if (Math.abs(enemy.body.velocity.x) != speed && !enemy.body.blocked.right) {
                enemy.body.setVelocityX(speed);
            }
            
            // Change direction when blocked
            if (enemy.body.blocked.right) {
                enemy.body.setVelocityX(-speed);
            } else if (enemy.body.blocked.left) {
                enemy.body.setVelocityX(speed);
            }
        });
    }

    handleEnemyCollision(dino, enemy) {
        // Calculate direction from enemy to dino
        const pushDirection = dino.x > enemy.x ? 1 : -1;
        
        // Push dino away from enemy
        dino.setVelocityX(100 * pushDirection);
        dino.setVelocityY(-100);
        
        // Call loseLife
        this.loseLife();
    }
}