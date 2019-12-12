import React from 'react';
import Navigation from "../Navigation";
import photo from './random_photo.jpg';
import './Landing.css';

const Landing = () => (
    <div>
        <Navigation />
        <main>
            <div>
                <h1>About Courses</h1>
                <p>A certain king had a beautiful garden, and in the garden stood a tree which bore golden apples. These apples were always counted, and about the time when they began to grow ripe it was found that every night one of them was gone. The king became very angry at this, and ordered the gardener to keep watch all night under the tree. The gardener set his eldest son to watch; but about twelve o’clock he fell asleep, and in the morning another of the apples was missing. Then the second son was ordered to watch; and at midnight he too fell asleep, and in the morning another apple was gone. Then the third son offered to keep watch; but the gardener at first would not let him, for fear some harm should come to him: however, at last he consented, and the young man laid himself under the tree to watch.</p>
                <img src={photo} className="photo" alt="random"/>
                <p>Time passed on again, and the youngest son too wished to set out into the wide world to seek for the golden bird; but his father would not listen to it for a long while, for he was very fond of his son, and was afraid that some ill luck might happen to him also, and prevent his coming back. However, at last it was agreed he should go, for he would not rest at home; and as he came to the wood, he met the fox, and heard the same good counsel. But he was thankful to the fox, and did not attempt his life as his brothers had done; so the fox said, ‘Sit upon my tail, and you will travel faster.’ So he sat down, and the fox began to run, and away they went over stock and stone so quick that their hair whistled in the wind.</p>
            </div>
        </main>
    </div>
);

export default Landing;