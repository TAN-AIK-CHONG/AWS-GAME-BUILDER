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
        this.cameras.main.setBackgroundColor(0x00ff00);

        this.add.image(512, 384, 'background').setAlpha(0.5);

        // this.add.text(512, 384, 'Make something fun!\nand share it with us:\nsupport@phaser.io', {
        //     fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
        //     stroke: '#000000', strokeThickness: 8,
        //     align: 'center'
        // }).setOrigin(0.5).setDepth(100);

        this.dino = this.physics.add.sprite(512,384,"dino").setScale(2);
        this.dino.setCollideWorldBounds(true);

        //offset so that dino touches platform
        this.dino.body.setOffset(0,-3);

        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('dino', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.dino.play('walk');

        this.cursors = this.input.keyboard.addKeys({
            up: Input.Keyboard.KeyCodes.W,
            down: Input.Keyboard.KeyCodes.S,
            left: Input.Keyboard.KeyCodes.A,
            right: Input.Keyboard.KeyCodes.D,
            space: Input.Keyboard.KeyCodes.SPACE            
        });

        this.physics.world.gravity.y = 1000;

        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(512, 500, 'platform').setScale(50, 1).refreshBody();
        this.physics.add.collider(this.dino, this.platforms);

        EventBus.emit('current-scene-ready', this);
    }

    update ()
    {
        const groundSpeed = 300;
        const airSpeed = 200;
        const jumpVelocity = -400;
        const minX = 0;
        const maxX = this.cameras.main.width;
        //const minY = 80;
        //const maxY = this.cameras.main.height - 80;
        const isOnGround = this.dino.body.touching.down;
        const speed = isOnGround ? groundSpeed : airSpeed;

        if (this.cursors.left.isDown && this.dino.x > minX)
        {
            this.dino.setVelocityX(-speed);
            this.dino.setFlipX(true); //flip
        }
        else if (this.cursors.right.isDown && this.dino.x < maxX)
        {
            this.dino.setVelocityX(speed);
            this.dino.setFlipX(false); //unflip
        }
        else
        {
            this.dino.setVelocityX(0);
        }


        // Implement jump logic
        if ((this.cursors.up.isDown || this.cursors.space.isDown) && this.dino.body.touching.down)
        {
            this.dino.setVelocityY(jumpVelocity);
        }
    }

    changeScene ()
    {
        this.scene.start('GameOver');
    }
}
