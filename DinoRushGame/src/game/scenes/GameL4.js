import { EventBus } from '../EventBus';
import { GameScene } from './GameScene';

export class GameL4 extends GameScene
{
    constructor ()
    {
        super('GameL4','Finish');
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
        this.displayMessage('Level 4');

        // Import tilemap
        const map = this.make.tilemap({ key: 'l4' });
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
        this.generateGems(map);
        const crabsObjectLayer = map.getObjectLayer('CrabEnemies').objects;
        this.crabs = this.generateCrabEnemies(crabsObjectLayer);
        const batsObjectLayer = map.getObjectLayer('BatEnemies').objects;
        
        // Collisions
        this.physics.add.collider(this.dino, foreground);
        this.physics.add.collider(this.dino, flag, this.handleFlag, null, this);
        this.physics.add.collider(this.crabs, foreground);
        this.physics.add.collider(this.dino, this.crabs, this.loseLife, null, this);
        this.physics.add.collider(this.dino, this.spikeGroup, this.loseLife, null, this);
        this.physics.add.overlap(this.dino, this.gemGroup, this.collectGem, null, this);
        
        //set boundaries
        this.cameras.main.setBounds(0, 0, map.widthInPixels * 3, map.heightInPixels * 3);
        this.physics.world.setBounds(0, 0, map.widthInPixels * 3, map.heightInPixels * 3);

        EventBus.emit('current-scene-ready', this);
    }

    update(){
        super.update();
        this.crabs.children.iterate((enemy) => {
            this.crabLogic(enemy);
        });
        // this.batsGroup.children.iterate((bat) => {
        //     this.batLogic(bat);
        // });
   
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
}


