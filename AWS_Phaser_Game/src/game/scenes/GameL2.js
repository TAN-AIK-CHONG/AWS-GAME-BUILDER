import { EventBus } from '../EventBus';
import { GameScene } from './GameScene';

export class GameL2 extends GameScene
{
    constructor ()
    {
        super('GameL2');
    }

    create ()
    {
        super.create();

        // add platform
        this.platforms = this.physics.add.staticGroup();
        const platform = this.platforms.create(512, 600, 'brownPlatform').setScale(50, 1).refreshBody();
        this.physics.add.collider(this.dino, this.platforms);
        
        //start timer
        this.startTime = this.time.now;

        EventBus.emit('current-scene-ready', this);
    }

    update ()
    {
        super.update();
    }

    pauseGame ()
    {
        this.scene.pause();
        this.scene.launch('PauseMenu', { returnScene: 'GameL2' });
    }

    resumeGame ()
    {
        this.scene.resume('GameL2');
    }

}
