import { EventBus } from '../EventBus';
import { GameScene } from './GameScene';

export class GameL1 extends GameScene
{
    constructor ()
    {
        super('GameL1');
    }

    create ()
    {
        super.create();


        //import tilemap
        const map = this.make.tilemap({ key: 'l1' });

        const tileset = map.addTilesetImage('tilemap', 'tileset');

        const decorations = map.createLayer('Decorations', tileset, 0, 0).setScale(3);
        //const gems = map.createLayer('Gems', tileset, 0, 0);
        const foreground = map.createLayer('Foreground', tileset, 0, 0).setScale(3);

        foreground.setCollisionByProperty({ collides: true });
        decorations.setCollisionByProperty({ collides: true });
        
        this.physics.add.collider(this.dino, foreground);
        this.physics.add.collider(this.dino, decorations, this.loseLife, null, this);


        //set boundaries
        this.cameras.main.setBounds(0, 0, map.widthInPixels * 3, map.heightInPixels * 3);
        this.physics.world.setBounds(0, 0, map.widthInPixels * 3, map.heightInPixels * 3);

        EventBus.emit('current-scene-ready', this);
    }

    update ()
    {
        super.update();
    }

    pauseGame ()
    {
        this.scene.pause();
        this.scene.launch('PauseMenu', { returnScene: 'GameL1' });
    }

    resumeGame ()
    {
        this.scene.resume('GameL1');
    }

    changeScene() {
        this.scene.start('GameL2');
    }
}
