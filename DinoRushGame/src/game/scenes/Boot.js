import { Scene } from 'phaser';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

        this.load.image('background', 'assets/backgrounds/background.jpg');
        this.load.image('logo', 'assets/UI/logo.png');
        this.load.image('uiButton','assets/UI/uiButton.png');
        this.load.image('uiButton','assets/UI/uiButtonPressed.png');
    }

    create ()
    {
        this.scene.start('Preloader');
    }
}
