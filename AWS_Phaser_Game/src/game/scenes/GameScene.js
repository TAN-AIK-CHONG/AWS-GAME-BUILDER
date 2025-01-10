import { Scene, Input } from 'phaser';

export class GameScene extends Scene
{
    constructor (key)
    {
        super(key);
    }

    create ()
    {
        //dino sprite
        this.dino = this.physics.add.sprite(512,500,"dino").setScale(3).setDepth(100);

        
        //adjust body size of dino
        this.dino.body.setSize(this.dino.width-9, this.dino.height-6);
        

        // dino animations
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('dino', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.dino.play('walk');

        this.dino.setCollideWorldBounds(true);

        this.lives = 3;

        // Set common gravity
        this.physics.world.gravity.y = 1000;

        // Add common keybindings
        this.keys = this.input.keyboard.addKeys({
            up: Input.Keyboard.KeyCodes.W,
            down: Input.Keyboard.KeyCodes.S,
            left: Input.Keyboard.KeyCodes.A,
            right: Input.Keyboard.KeyCodes.D,
            space: Input.Keyboard.KeyCodes.SPACE
        });

        // display lives
        this.livesText = this.add.text(16, 16, `Lives: `, { fontSize: '32px', fill: '#fff' }).setScrollFactor(0).setDepth(100);
        // Add hearts to represent lives
        this.hearts = this.add.group({
            key: 'heart',
            repeat: this.lives - 1,
            setXY: { x: 150, y: 30, stepX: 32 }
        });

        this.hearts.children.iterate((child) => {
            child.setScrollFactor(0).setDepth(100).setScale(0.8);
        });

        // display time
        this.timeText = this.add.text(16, 48, 'Time: 00:00:00', { fontSize: '32px', fill: '#fff' }).setScrollFactor(0).setDepth(100);

        // pause button
        const pauseButtonImage = this.add.image(980, 50, 'pausebutton').setScale(1.5).setInteractive().setScrollFactor(0);
        this.add.container(0, 0, [pauseButtonImage]).setDepth(100);
        pauseButtonImage.on('pointerdown', () => {
            this.pauseGame();
        })

        //camera follow dino
        this.cameras.main.startFollow(this.dino, true, 0.1, 0.1, 0, 300);

        

        //start timer
        this.startTime = this.time.now;
    }

    update ()
    {
        // Call the update method of the derived class
        if (super.update) {
            super.update();
        }

        //speed constants
        const groundSpeed = 300;
        const airSpeed = 250;
        const jumpVelocity = -500;
        
        const isOnGround = this.dino.body.blocked.down;
        const speed = isOnGround ? groundSpeed : airSpeed;

        if (this.keys.left.isDown)
        {
            this.dino.anims.play('walk', true);
            this.dino.setVelocityX(-speed);
            this.dino.setFlipX(true);
        }
        else if (this.keys.right.isDown)
        {
            this.dino.anims.play('walk', true);
            this.dino.setVelocityX(speed);
            this.dino.setFlipX(false);
        }
        else
        {
            this.dino.setVelocityX(0);
            this.dino.anims.stop();
        }

        // Jump!
        if ((this.keys.up.isDown || this.keys.space.isDown) && this.dino.body.blocked.down)
        {
            this.dino.setVelocityY(jumpVelocity);
        }

        //update time
        this.elapsedTime = Math.floor((this.time.now - this.startTime) / 1000);
        const elapsedTime = this.elapsedTime;
        const hours = Math.floor(elapsedTime / 3600);
        const minutes = Math.floor((elapsedTime % 3600) / 60);
        const seconds = elapsedTime % 60;

        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        this.timeText.setText(`Time: ${formattedTime}`);
    }

    // Call this function when dino dies
    loseLife ()
    {
        this.lives --;
        this.dino.setPosition(512,500);
        // Update hearts display
        this.hearts.clear(true, true);
        this.hearts = this.add.group({
            key: 'heart',
            repeat: this.lives - 1,
            setXY: { x: 150, y: 30, stepX: 32 }
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
        }
    }
}