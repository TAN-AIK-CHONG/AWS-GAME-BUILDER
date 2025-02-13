import { Boot } from './scenes/Boot';
import { GameL1 } from './scenes/GameL1';
import { GameL2 } from './scenes/GameL2';
import { GameL3 } from './scenes/GameL3';
import { GameL4 } from './scenes/GameL4';
import { GameL5 } from './scenes/GameL5';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import { PauseMenu } from './scenes/PauseMenu';
import Phaser from 'phaser';
import { Preloader } from './scenes/Preloader';
import { Finish } from './scenes/Finish';

// Find out more information about the Game Config at:
// https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    parent: 'game-container',
    physics: {
        default: 'arcade'
    },
    parent: 'game-container',
    backgroundColor: '#028af8',
    pixelArt: true,
    scene: [
        Boot,
        Preloader,
        MainMenu,
        GameL1,
        GameL2,
        GameL3,
        GameL4,
        GameL5,
        GameOver,
        PauseMenu,
        Finish
    ],
    dom: {
        createContainer: true // Enables the DOM container to interact with HTML elements
    }
};

const StartGame = (parent) => {

    return new Phaser.Game({ ...config, parent });

}

export default StartGame;
