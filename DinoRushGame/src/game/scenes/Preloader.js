import { Scene } from 'phaser';

export class Preloader extends Scene {
    constructor() {
        super('Preloader');
    }

    preload() {
        // Create loading UI
        this.add.image(512, 384, 'background');
        this.logo = this.add.image(512, 300, 'logo').setDepth(100);
        
        // Progress bar
        this.outline = this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);
        this.bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

        // Track loading progress
        this.load.on('progress', (value) => {
            this.bar.width = 4 + (460 * value);
        });

        this.load.on('complete', () => {
            this.bar.setVisible(false);
            this.outline.setVisible(false);
            this.createStartButton();
        });

        this.load.on('loaderror', (file) => {
            console.error('Error loading asset:', file.src);
        });

        // Set asset path and load assets
        this.load.setPath('assets');
        // Load your assets
        this.load.spritesheet('dino', 'gameObjects/DinoSprites - doux.png', { frameWidth: 24, frameHeight: 24});
        this.load.image('pausebutton', 'UI/pausebutton (2).png');
        this.load.image('scroll','UI/scroll.png');
        this.load.tilemapTiledJSON('l1', 'jsonmaps/l1.json');
        this.load.tilemapTiledJSON('l2', 'jsonmaps/l2.json');
        this.load.tilemapTiledJSON('l3', 'jsonmaps/l3.json');
        this.load.image('tileset', 'tilemap.png');
        this.load.image('characterset', 'tilemap-characters.png');
        this.load.image('heart', 'gameObjects/heart.png');
        this.load.image('gem', 'gameObjects/gem.png');
        this.load.image('crab1', 'gameObjects/enemy11.png');
        this.load.image('crab2', 'gameObjects/enemy12.png');
        this.load.image('crab3', 'gameObjects/enemy13.png');
        this.load.image('gameBackground1', 'backgrounds/gameBackground1.png');
        this.load.image('github', 'UI/github-mark.png');
        this.load.audio('buttonHoverAudio','audio/click3.ogg');
        this.load.audio('buttonClickAudio', 'audio/click4.ogg');
        this.load.audio('scream', 'audio/scream.wav');
        this.load.audio('pickupgem', 'audio/pickupgem.mp3');
        this.load.audio('nextlevel', 'audio/nextlevel.mp3');
        this.load.audio('bgMusicMainMenu', 'audio/bgMusic.mp3');
    }

    createStartButton() {
        const buttonImage = this.add.image(0, 0, 'uiButton')
            .setInteractive()
            .setScale(0.35);

        const buttonText = this.add.text(0, -10, 'START', {
            fontFamily: 'Oxanium', 
            fontSize: 18, 
            color: '#411909'
        }).setOrigin(0.5);

        const startButton = this.add.container(512, 400, [buttonImage, buttonText])
            .setSize(buttonImage.width * 0.35, buttonImage.height * 0.35)
            .setInteractive();

        buttonImage.on('pointerover', () => buttonImage.setTint(0xdddddd));
        buttonImage.on('pointerout', () => buttonImage.clearTint());
        buttonImage.on('pointerdown', () => this.scene.start('MainMenu'));
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

        this.anims.create({
            key: 'crabWalk',
            frames: [
                { key: 'crab1' },
                { key: 'crab2' }
            ],
            frameRate: 5,
            repeat: -1
        });
    }
}

    
