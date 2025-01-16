import { Scene, Input } from 'phaser';

const sceneConfig = {
    GameL1: { spawnX: 512, spawnY: 500 },
    GameL2: { spawnX: 340, spawnY: 1038 }
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

        //spawn point for dino
        this.spawnX = data.spawnX
        this.spawnY = data.spawnY

        //dino sprite
        this.dino = this.physics.add.sprite(this.spawnX,this.spawnY,"dino").setScale(4).setDepth(100);

        
        //adjust body size of dino
        this.dino.body.setSize(this.dino.width-9, this.dino.height-6);
        
        // dino animations
        // walking
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('dino', { start: 3, end: 9 }),
            frameRate: 10,
            repeat: -1
        });

        this.dino.play('walk');

        this.dino.setCollideWorldBounds(true);

        this.lives = 3;
        this.gems = 0;

        // Set common gravity
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
            child.setScrollFactor(0).setDepth(100).setScale(0.8);
        });

        // display gems
        this.gemsText = this.add.text(16, 48, ` Gems: `, { fontSize: '32px', fill: '#000000' }).setScrollFactor(0).setDepth(100);
        this.gemIcons = this.add.group();

        for (let i = 0; i < 3; i++) {
            const gemIcon = this.add.image(150 + i * 32, 60, 'gem').setScale(1.5).setScrollFactor(0).setDepth(100);
            gemIcon.setTint(0x101010);
            this.gemIcons.add(gemIcon);
        }
        

        // display time
        this.timeText = this.add.text(16, 80, ' Time: 00:00:00', { fontSize: '32px', fill: '#000000' }).setScrollFactor(0).setDepth(100);

        // pause button
        const pauseButtonImage = this.add.image(980, 50, 'pausebutton').setScale(1.2).setInteractive().setScrollFactor(0);
        this.add.container(0, 0, [pauseButtonImage]).setDepth(100);
        pauseButtonImage.on('pointerdown', () => {
            this.pauseGame(this.scene.key);
        })
        // Add hover effect
        pauseButtonImage.on('pointerover', () => {
            pauseButtonImage.setTint(0xdddddd);
        });
    
        pauseButtonImage.on('pointerout', () => {
            pauseButtonImage.clearTint();
        });

        //camera follow dino
        this.cameras.main.startFollow(this.dino, true, 0.1, 0.1, 0, 100);

        // isHurt flag
        this.isHurt = false;
        

        //start timer
        this.startTime = this.time.now;

        //for debugging
        this.input.on('pointerdown', (pointer) => {
            console.log(`Clicked at: x=${pointer.worldX}, y=${pointer.worldY}`);
        });
    }

    pauseGame (currentScene)
    {
        this.scene.pause();
        this.scene.launch('PauseMenu', { returnScene: currentScene });
    }

    resumeGame (currentScene)
    {
        this.scene.resume(currentScene);
    }
    
    update ()
    {
        // Call the update method of the derived class
        if (super.update) {
            super.update();
        }

        //update time
        this.elapsedTime = Math.floor((this.time.now - this.startTime) / 1000);
        const elapsedTime = this.elapsedTime;
        const hours = Math.floor(elapsedTime / 3600);
        const minutes = Math.floor((elapsedTime % 3600) / 60);
        const seconds = elapsedTime % 60;

        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        this.timeText.setText(` Time:${formattedTime}`);

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
        }
    }

    // Call this function when dino is hurt
    loseLife ()
    {
        this.isHurt = true;
        this.lives --;
        const pushDirection = this.dino.flipX ? 200 : -200;
        this.isHurt = true;
        this.dino.setVelocity(pushDirection,-300);


        //add sound later
        // hurt anim
        this.tweens.add({
            targets: this.dino,
            alpha: 0,
            ease: 'Linear',
            duration: 100,
            repeat: 5,
            yoyo: true,
            onStart: () => {
                this.dino.setFrame(15);
            },
            onYoyo: () => {
                this.dino.setFrame(this.dino.frame.name === 15 ? 14 : 15);
            },
            onComplete: () => {
                this.dino.alpha = 1; 
                this.dino.setFrame(0); // Reset to the default frame
            }
        });
        
        // Update hearts display
        this.hearts.children.iterate((child, index) => {
            if (index >= this.lives) {
                child.setTint(0x101010); // Set to black
            } else {
                child.clearTint(); // Clear tint for remaining lives
            }
        });
        this.hearts.children.iterate((child) => {
            child.setScrollFactor(0).setDepth(100).setScale(0.8);
        });
        if (this.lives <= 0)
        {
            this.elapsedTime = Math.floor((this.time.now - this.startTime) / 1000);
            const elapsedTime =this.elapsedTime;
            const hours = Math.floor(elapsedTime / 3600);
            const minutes = Math.floor((elapsedTime % 3600) / 60);
            const seconds = elapsedTime % 60;

            const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            this.scene.start('GameOver', { time: formattedTime });

            this.scene.stop();
        }
        this.time.delayedCall(1000, () => {
            this.isHurt = false;
        });
    }

    collectGem (dino,gem)
    {
        this.gems++;
        const gemImage = this.gemIcons.getChildren()[this.gems - 1];
        gemImage.clearTint();
        gem.destroy();
    }

    changeScene() {
        this.scene.start(this.nextScene);
    }

    handleFlag () 
    {
        if (this.gems === 3) {
            const spawnData = sceneConfig[this.nextScene];
            this.scene.start(this.nextScene, spawnData);
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