import { EventBus } from '../EventBus';
import { Scene, Input } from 'phaser';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.cameras.main.setBackgroundColor(0x669999);

        // this.add.text(512, 384, 'Make something fun!\nand share it with us:\nsupport@phaser.io', {
        //     fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
        //     stroke: '#000000', strokeThickness: 8,
        //     align: 'center'
        // }).setOrigin(0.5).setDepth(100);

        this.dino = this.physics.add.sprite(512,500,"dino").setScale(2);
        this.dino.setCollideWorldBounds(true);

        this.lives = 3; 

        //offset so that dino touches platform
        this.dino.body.setOffset(0,-3);

        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('dino', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.dino.play('walk');

        this.keys = this.input.keyboard.addKeys({
            up: Input.Keyboard.KeyCodes.W,
            down: Input.Keyboard.KeyCodes.S,
            left: Input.Keyboard.KeyCodes.A,
            right: Input.Keyboard.KeyCodes.D,
            space: Input.Keyboard.KeyCodes.SPACE            
        });

        this.physics.world.gravity.y = 1000;

        this.platforms = this.physics.add.staticGroup();
        const platform = this.platforms.create(512, 600, 'brownPlatform').setScale(50, 1).refreshBody();
        this.physics.add.collider(this.dino, this.platforms);

        this.cactus = this.physics.add.staticGroup();
        const cactus = this.cactus.create(800, platform.y - platform.displayHeight / 2 - 25, 'cactus').setScale(1.8).refreshBody();
        this.physics.add.collider(this.dino, this.cactus, this.loseLife, null, this);
        cactus.body.setSize(cactus.width, cactus.height);

        this.livesText = this.add.text(16, 16, `Lives: ${this.lives}`, { fontSize: '32px', fill: '#fff' });

        EventBus.emit('current-scene-ready', this);
    }

    update ()
    {
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

    }

    // Call this function when dino dies
    loseLife ()
    {
        this.lives --;
        this.dino.setPosition(512,500);
        this.livesText.setText(`Lives: ${this.lives}`);
        if (this.lives <= 0)
        {
            this.scene.start('GameOver');
        }
    }

    changeScene ()
    {
        this.scene.start('GameOver');
    }
}
