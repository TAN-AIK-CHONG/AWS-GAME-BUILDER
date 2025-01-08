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

        this.dino = this.add.sprite(512,384,"dino").setScale(2);

        this.cursors = this.input.keyboard.addKeys({
            up: Input.Keyboard.KeyCodes.W,
            down: Input.Keyboard.KeyCodes.S,
            left: Input.Keyboard.KeyCodes.A,
            right: Input.Keyboard.KeyCodes.D
        });

        EventBus.emit('current-scene-ready', this);
    }

    update ()
    {
        if (this.cursors.left.isDown)
        {
            this.dino.x -= 5;
        }
        else if (this.cursors.right.isDown)
        {
            this.dino.x += 5;
        }

        if (this.cursors.up.isDown)
        {
            this.dino.y -= 5;
        }
        else if (this.cursors.down.isDown)
        {
            this.dino.y += 5;
        }
    }

    changeScene ()
    {
        this.scene.start('GameOver');
    }
}
