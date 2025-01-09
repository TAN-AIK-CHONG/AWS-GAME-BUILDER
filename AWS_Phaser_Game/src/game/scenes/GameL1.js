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

        const decorations = map.createLayer('Decorations', tileset, 0, 0);
        const gems = map.createLayer('Gems', tileset, 0, 0);
        const foreground = map.createLayer('Foreground', tileset, 0, 0);

        foreground.setCollisionByProperty({ collides: true });
        
        this.physics.add.collider(this.dino, foreground);

        
        // // add platform
        // this.platforms = this.physics.add.staticGroup();
        // const platform = this.platforms.create(512, 600, 'brownPlatform').setScale(50, 1).refreshBody();
        // this.physics.add.collider(this.dino, this.platforms);

        // // add cactus (DO NOT EDIT CONFIGURATIONS I ALLIGNED IT)
        // this.cactus = this.physics.add.staticGroup();
        // const cactus = this.cactus.create(800, platform.y - platform.displayHeight / 2 - 25, 'cactus').setScale(1.8).refreshBody();
        // cactus.body.setSize(cactus.width - 10, cactus.height);
        // this.physics.add.collider(this.dino, this.cactus, this.loseLife, null, this);

        // // add rocks (DO NOT EDIT CONFIGURATIONS I ALLIGNED IT)
        // this.rock = this.physics.add.staticGroup();
        // const rock1 = this.rock.create(200, 500, 'rock').setScale(2).refreshBody();
        // rock1.body.setSize(rock1.width, rock1.height);
        // rock1.body.setOffset(9,-0.2);
        // this.physics.add.collider(this.dino, this.rock, null, null, this);

        // this.rock = this.physics.add.staticGroup();
        // const rock2 = this.rock.create(300, 400, 'rock').setScale(2).refreshBody();
        // rock1.body.setSize(rock2.width, rock2.height);
        // rock1.body.setOffset(9,-0.2);
        // this.physics.add.collider(this.dino, this.rock, null, null, this);

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
