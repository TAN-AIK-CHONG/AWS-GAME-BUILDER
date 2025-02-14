import { useRef } from 'react';
import { PhaserGame } from './game/PhaserGame';

function App ()
{
    
    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef();

    const changeScene = () => {

        const scene = phaserRef.current.scene;

        if (scene)
        {
            scene.changeScene();
        }
    }

    // Event emitted from the PhaserGame component
    const currentScene = (scene) => {
        console.log('Current scene:', scene);
    }

    return (
        <div id="app">
            <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
            <div>
                <button className="button" onClick={changeScene} style={{ marginLeft: '-100px', marginRight: '50px' }}>Change Scene</button>
            </div>
        </div>
    )
}

export default App
