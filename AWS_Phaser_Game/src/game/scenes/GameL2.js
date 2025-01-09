import { EventBus } from '../EventBus';
import { Scene, Input } from 'phaser';

export class GameL2 extends Scene
{
    constructor ()
    {
        super('GameL2');
    }

    create ()
    {
        this.cameras.main.setBackgroundColor(0x669999);

        //dino sprite
        this.dino = this.physics.add.sprite(512,500,"dino").setScale(2);
        this.dino.setCollideWorldBounds(true);

        //offset so that dino touches platform
        this.dino.body.setOffset(0,-3);

        // dino animations
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('dino', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.dino.play('walk');

        this.lives = 3;

        // add keybindings
        this.keys = this.input.keyboard.addKeys({
            up: Input.Keyboard.KeyCodes.W,
            down: Input.Keyboard.KeyCodes.S,
            left: Input.Keyboard.KeyCodes.A,
            right: Input.Keyboard.KeyCodes.D,
            space: Input.Keyboard.KeyCodes.SPACE            
        });

        // add gravity
        this.physics.world.gravity.y = 1000;

        // add platform
        this.platforms = this.physics.add.staticGroup();
        const platform = this.platforms.create(512, 600, 'brownPlatform').setScale(50, 1).refreshBody();
        this.physics.add.collider(this.dino, this.platforms);
        
        // display lives
        this.livesText = this.add.text(16, 16, `Lives: ${this.lives}`, { fontSize: '32px', fill: '#fff' });

        // display time
        this.timeText = this.add.text(16, 48, 'Time: 00:00:00', { fontSize: '32px', fill: '#fff' });

        // pause button
        const pauseButtonImage = this.add.image(980, 50, 'pausebutton').setScale(1.25).setDepth(100).setInteractive();
        this.add.container(0, 0, [pauseButtonImage]);
        pauseButtonImage.on('pointerdown', () => {
            this.pauseGame();
        })

        //start timer
        this.startTime = this.time.now;

        EventBus.emit('current-scene-ready', this);
    }

    update ()
    {
        //speed constants
        const groundSpeed = 300;
        const airSpeed = 200;
        const jumpVelocity = -500;

        //boundaries
        const minX = 0;
        const maxX = this.cameras.main.width;
        //const minY = 80;
        //const maxY = this.cameras.main.height - 80;

        const isOnGround = this.dino.body.touching.down;
        const speed = isOnGround ? groundSpeed : airSpeed;

        if (this.keys.left.isDown && this.dino.x > minX)
        {
            this.dino.setVelocityX(-speed);
            this.dino.setFlipX(true);
        }
        else if (this.keys.right.isDown && this.dino.x < maxX)
        {
            this.dino.setVelocityX(speed);
            this.dino.setFlipX(false);
        }
        else
        {
            this.dino.setVelocityX(0);
        }

        // Jump!
        if ((this.keys.up.isDown || this.keys.space.isDown) && this.dino.body.touching.down)
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
        this.livesText.setText(`Lives: ${this.lives}`);
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

    pauseGame()
    {
        this.scene.pause();
        this.scene.launch('PauseMenu');
    }

    resumeGame()
    {
        this.scene.resume();
    }

    changeScene ()
    {
        this.scene.start('GameOver');
    }
}
