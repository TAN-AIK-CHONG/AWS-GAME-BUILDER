import { Scene, Input } from 'phaser';

const sceneConfig = {
    GameL1: { spawnX: 512, spawnY: 500 },
    GameL2: { spawnX: 340, spawnY: 1038 },
    GameL3: { spawnX: 50, spawnY: 600},
    GameL4: { spawnX: 144, spawnY: 1130}
};

export class GameScene extends Scene
{
    constructor (key, nextScene)
    {
        super(key);
        this.nextScene = nextScene;
    }

    create (data)
    {
        // timer for game
        this.timer = this.time.addEvent({
            delay: 1000,
            loop: true,
            callback: this.updateTimer,
            callbackScope: this,
            paused: false,
        });

        this.elapsedTime = data.elapsedTime || 0;

        this.timeText = this.add.text(16, 80, ' Time:' + this.formatTime(this.elapsedTime), { fontSize: '32px', fill: '#000000' }).setScrollFactor(0).setDepth(100);

        //spawn point for dino
        this.spawnX = data.spawnX
        this.spawnY = data.spawnY

        //dino sprite
        this.dino = this.physics.add.sprite(this.spawnX,this.spawnY,"dino").setScale(4).setDepth(100);
        this.dino.body.setSize(this.dino.width-10, this.dino.height-6);
        this.dino.play('walk');
        this.dino.setCollideWorldBounds(true);
        this.cameras.main.startFollow(this.dino, true, 0.1, 0.1, 0, 100);

        // Game data
        this.lives = 3;
        this.gems = 0;
        this.physics.world.gravity.y = 1000;

        // Add common keybindings
        this.keys = this.input.keyboard.addKeys({
            up: Input.Keyboard.KeyCodes.UP,
            down: Input.Keyboard.KeyCodes.DOWN,
            left: Input.Keyboard.KeyCodes.LEFT,
            right: Input.Keyboard.KeyCodes.RIGHT,
            space: Input.Keyboard.KeyCodes.SPACE,
            w: Input.Keyboard.KeyCodes.W,
            a: Input.Keyboard.KeyCodes.A,
            s: Input.Keyboard.KeyCodes.S,
            d: Input.Keyboard.KeyCodes.D
        });

        // display lives
        this.livesText = this.add.text(16, 16, `Lives: `, { fontSize: '32px', fill: '#000000' }).setScrollFactor(0).setDepth(100);
        // Add hearts to represent lives
        this.hearts = this.add.group({
            key: 'heart',
            repeat: this.lives - 1,
            setXY: { x: 150, y: 30, stepX: 32 }
        });
        this.hearts.children.iterate((child) => {
            child.setScrollFactor(0).setDepth(100).setScale(0.7);
        });

        // display gems
        this.gemsText = this.add.text(16, 48, ` Gems: `, { fontSize: '32px', fill: '#000000' }).setScrollFactor(0).setDepth(100);
        this.gemIcons = this.add.group();
        for (let i = 0; i < 3; i++) {
            const gemIcon = this.add.image(150 + i * 32, 60, 'gem').setScale(1.5).setScrollFactor(0).setDepth(100);
            gemIcon.setTint(0x101010);
            this.gemIcons.add(gemIcon);
        }
        
        // pause button
        const pauseButtonImage = this.add.image(980, 40, 'pausebutton').setScale(1).setInteractive().setScrollFactor(0);
        this.add.container(0, 0, [pauseButtonImage]).setDepth(100);
        pauseButtonImage.on('pointerdown', () => {
            this.sound.play('buttonClickAudio');
            this.pauseGame(this.scene.key);
        })
        pauseButtonImage.on('pointerover', () => {
            pauseButtonImage.setTint(0xdddddd);
            this.sound.play('buttonHoverAudio');
        });
        pauseButtonImage.on('pointerout', () => {
            pauseButtonImage.clearTint();
        });

        // isHurt flag
        this.isHurt = false;

        //for debugging
        this.input.on('pointerdown', (pointer) => {
            console.log(`Clicked at: x=${pointer.worldX}, y=${pointer.worldY}`);
        });
    }


    /////////////////////////////////////////////////////////////////////////////
    /*Helper Functions*/ 
    /////////////////////////////////////////////////////////////////////////////

    updateTimer() {
        this.elapsedTime += 1;
        this.timeText.setText(' Time:' + this.formatTime(this.elapsedTime));
    }

    formatTime(time) {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;

        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    pauseGame (currentScene)
    {
        this.timer.paused = true;
        this.scene.pause();
        this.scene.launch('PauseMenu', { returnScene: currentScene });
    }

    resumeGame (currentScene)
    {
        this.timer.paused = false;
        this.scene.resume(currentScene);
    }

    changeScene() {
        this.scene.start(this.nextScene, {
            spawnX: 980,
            spawnY: 640,
            elapsedTime: this.elapsedTime 
        });
    }

    /////////////////////////////////////////////////////////////////////////////
    /*Game Functions*/ 
    /////////////////////////////////////////////////////////////////////////////

    update (){
        // Call the update method of the derived class
        if (super.update) {
            super.update();
        }

        if (this.isHurt) return;

        //speed constants
        const groundSpeed = 300;
        const airSpeed = 250;
        const jumpVelocity = -500;
        
        const isOnGround = this.dino.body.blocked.down;
        const speed = isOnGround ? groundSpeed : airSpeed;

        if (this.keys.left.isDown || this.keys.a.isDown)
        {
            this.dino.setVelocityX(-speed);
            this.dino.setFlipX(true);
            if (isOnGround){
                this.dino.play('walk', true);
            }
            else{
                this.dino.setFrame(6);
            }
            
        }
        else if (this.keys.right.isDown || this.keys.d.isDown)
        {
            this.dino.setVelocityX(speed);
            this.dino.setFlipX(false);
            if (isOnGround){
                this.dino.play('walk', true);
            }
            else{
                this.dino.setFrame(6);
            }
        }
        else
        {
            this.dino.setVelocityX(0);
            this.dino.anims.stop();
            this.dino.setFrame(3);
        }

        // Jump!
        if ((this.keys.up.isDown || this.keys.space.isDown || this.keys.w.isDown) && this.dino.body.blocked.down)
        {
            this.dino.setVelocityY(jumpVelocity);
            this.sound.play('jump');
        }
    }

    loseLife() {
        if (!this.isHurt){
            this.isHurt = true;
            this.lives--;
            const pushDirection = this.dino.flipX ? 200 : -200;
            this.dino.setVelocity(pushDirection,-300);

            this.sound.play('hitDamage');
            this.dino.play('hurt', true);
            
            this.hearts.children.iterate((child, index) => {
                if (index >= this.lives) {
                    child.setTint(0x101010);
                } else {
                    child.clearTint();
                }
            });

            this.hearts.children.iterate((child) => {
                child.setScrollFactor(0).setDepth(100).setScale(0.7);
            });

            if (this.lives <= 0) {
                const formattedTime = this.formatTime(this.elapsedTime);
                this.scene.start('GameOver', { time: formattedTime });
                this.scene.stop();
                return;
            }
        }

        this.time.delayedCall(1000, () => {
            this.isHurt = false;
        });
    }
    

    collectGem(dino,gem){
        this.gems++;
        this.sound.play('pickupgem');
        const gemImage = this.gemIcons.getChildren()[this.gems - 1];
        gemImage.clearTint();
        gem.destroy();
    }

    displayMessage(message){
        const text = this.add.text(512, 50, message, {
            fontFamily: 'Oxanium', fontSize: '48px', fill: '#000000', stroke: '#ffffff', strokeThickness: 8
        }).setOrigin(0.5).setScrollFactor(0).setDepth(100);

        this.time.delayedCall(3000, () => {
            this.tweens.add({
                targets: text,
                alpha: 0,
                duration: 1000,
                ease: 'Power2',
                onComplete: () => {
                    text.destroy();
                }
            });
        });
    } 

    handleFlag () 
    {
        if (this.gems === 3) {
            this.sound.play('nextlevel');
            const spawnData = sceneConfig[this.nextScene];
            this.scene.start(this.nextScene, {
                spawnX: spawnData.spawnX,
                spawnY: spawnData.spawnY,
                elapsedTime: this.elapsedTime 
            });
        }
        else {
            this.displayMessage('Not enough gems!');
        }
    }

    /////////////////////////////////////////////////////////////////////////////
    /*Object Layer Functions*/ 
    /////////////////////////////////////////////////////////////////////////////

    generateGems(map) {
        // Debug: Check if map and Gems layer exist
        console.log('Map:', map);
        console.log('Layers:', map.objects);
        
        try {
            const gemsObjectLayer = map.getObjectLayer('Gems');
            if (!gemsObjectLayer) {
                console.error('No Gems layer found in map');
                return;
            }
            
            console.log('Gems layer:', gemsObjectLayer);
            console.log('Gem objects:', gemsObjectLayer.objects);
    
            this.gemGroup = this.physics.add.group();
    
            gemsObjectLayer.objects.forEach((gemObj) => {
                console.log('Creating gem at:', gemObj.x * 3, gemObj.y * 3);
                const gem = this.gemGroup.create(gemObj.x * 3, gemObj.y * 3, 'gem');
                gem.setOrigin(0, 1);
                gem.setScale(3);
                gem.body.setAllowGravity(false);
            });
        } catch (error) {
            console.error('Error generating gems:', error);
        }
    }

    generateSpikes(spikeLayer){
        this.spikeGroup = this.physics.add.staticGroup();

        // Create custom physics bodies for each spike tile to adjust the collision area
        spikeLayer.forEachTile(tile => {
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

        return this.spikeGroup;
    }

    generateCrabEnemies(enemyLayer){
        this.enemiesGroup = this.physics.add.group();
        enemyLayer.forEach((enemyObj) => {
            const enemy = this.physics.add.sprite(enemyObj.x * 3, enemyObj.y * 3, 'enemy11');
            enemy.setOrigin(0.5); 
            enemy.body.setCollideWorldBounds(true);
            enemy.setScale(3);
            enemy.body.setAllowGravity(true); 
            enemy.play('crabWalk'); 
            enemy.body.setSize(20,20); 
            enemy.body.setOffset(2,4); 

            this.enemiesGroup.add(enemy);
        });

        return this.enemiesGroup;
    }

    crabLogic(enemy){
        // If not moving, start moving right
        if (Math.abs(enemy.body.velocity.x) != 250 && !enemy.body.blocked.right) {
            enemy.body.setVelocityX(250);
        }
        
        // Change direction when blocked
        if (enemy.body.blocked.right) {
            enemy.body.setVelocityX(-250);
        } else if (enemy.body.blocked.left) {
            enemy.body.setVelocityX(250);
        }

        // Flip sprite based on velocity
        if (enemy.body.velocity.x < 0) {
            enemy.setFlipX(false);  // facing left
        } else if (enemy.body.velocity.x > 0) {
            enemy.setFlipX(true); // facing right
        }
    }
}