import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    { 
        // Display the background
        this.add.image(512, 384, 'background');
        
        // Display the logo
        this.logo = this.add.image(512, 300, 'logo').setDepth(100);

        // A simple progress bar outline
        this.outline = this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        // The progress bar (filled)
        this.bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

        // Update the progress bar width as loading progresses
        this.load.on('progress', (progress) => {
            this.bar.width = 4 + (460 * progress);
        });

            // When loading is complete, show a Start button
            this.load.on('complete', () => {
                // Hide the progress bar
                this.bar.setVisible(false);
                this.outline.setVisible(false);
    
                // Create a Start button (you can style it differently or use an image instead)
                const buttonImage = this.add.image(0, 0, 'uiButton')
                    .setInteractive()
                    .setScale(0.35);
    
                const buttonText = this.add.text(0, -10, 'START', {
                    fontFamily: 'Oxanium', fontSize: 18, color: '#411909'
                }).setOrigin(0.5);
    
                const startButton = this.add.container(512, 400, [buttonImage, buttonText])
                    .setSize(buttonImage.width * 0.35, buttonImage.height * 0.35)
                    .setInteractive();
    
                // Add hover effect to the image
                buttonImage.on('pointerover', () => {
                    buttonImage.setTint(0xdddddd);
                });
                buttonImage.on('pointerout', () => {
                    buttonImage.clearTint();
                });
    
                // On click, go to MainMenu
                buttonImage.on('pointerdown', () => {
                    this.scene.start('MainMenu');
                });
        });
    }

    preload ()
    {
        // Adjust the asset path for your project
        this.load.setPath('assets');

        // Load your assets
        this.load.image('star', 'star.png');
        this.load.spritesheet('dino', 'DinoSprites - doux.png', { frameWidth: 24, frameHeight: 24});
        this.load.image('pausebutton', 'pausebutton (2).png');
        this.load.image('scroll','scroll.png');
        this.load.tilemapTiledJSON('l1', 'jsonmaps/l1.json');
        this.load.tilemapTiledJSON('l2', 'jsonmaps/l2.json');
        this.load.tilemapTiledJSON('l3', 'jsonmaps/l3.json');
        this.load.image('tileset', 'tilemap.png');
        this.load.image('characterset', 'tilemap-characters.png');
        this.load.image('heart', 'heart.png');
        this.load.image('gem', 'gem.png');
        this.load.image('gameBackground1', 'gameBackground1.png');
        this.load.image('github', 'github-mark.png');
        this.load.audio('buttonHoverAudio','audio/click3.ogg');
        this.load.audio('buttonClickAudio', 'audio/click4.ogg');
        this.load.audio('scream', 'audio/scream.wav');
        this.load.audio('pickupgem', 'audio/pickupgem.mp3');
        this.load.audio('nextlevel', 'audio/nextlevel.mp3');
        this.load.audio('bgMusicMainMenu', 'audio/bgMusic.mp3');
    }

    create ()
    {
        // Create any global animations or set up anything else you need
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('dino', { start: 3, end: 9 }),
            frameRate: 10,
            repeat: -1
        });
        
        this.anims.create({
            key: 'hurt',
            frames: this.anims.generateFrameNumbers('dino', { start: 14, end: 15 }),
            frameRate: 10,
            repeat: -1
        });
    }
}
