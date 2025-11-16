[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/BhShQpq1)
                                                     GeoKahoot (Turkey City Guessing Geo-Game)
 Project Description:
GeoKahoot is an interactive, map-based geo-game where players attempt to guess Turkish provinces based on given hints.
The game supports both single-player and two-player sequential multiplayer modes.
It includes difficulty levels, time-based progression, scoring, lives, and optional analytical visualizations.
The game is implemented entirely in HTML, CSS, JavaScript, with Leaflet.js for mapping, Turf.js for spatial validation, and optional Chart.js for graphical summaries.

Requirements:
✔ Functional Requirements
The game uses a map of Turkey as the play area.
Each round shows a random province and provides a hint.
The player clicks on the map to make a guess.
Supports three difficulty levels: Easy, Normal, Hard.
Time-based gameplay: e.g., each player has 60 seconds.
Life system (depends on difficulty).
Multiplayer mode:
Player 1 plays first
Player 2 plays under the same conditions
Highest score wins
GeoJSON + Turf.js used for accurate province boundary checks (point-in-polygon).
A local leaderboard using localStorage.
Optional bonus: performance charts using Chart.js.
✔ Technical Requirements
HTML
CSS
Vanilla JavaScript 
Leaflet.js 
Turf.js 
Chart.js 


Frontend Design & Layout
<img width="957" height="521" alt="image" src="https://github.com/user-attachments/assets/b499611d-0a10-4d10-a072-94754664643f" />
<img width="930" height="491" alt="image" src="https://github.com/user-attachments/assets/3c0dd723-690b-46b7-b9a8-d48f7abd9c41" />
<img width="659" height="306" alt="image" src="https://github.com/user-attachments/assets/23c6381b-2b37-4094-b206-43330a711e6e" />

How Will the Game Progress:
🎯 Start Phase
Players enter their names.
A difficulty level is selected.
A time limit (e.g., 60 seconds) is entered.
If multiplayer is enabled, the game runs sequentially: Player 1 → Player 2.
🎯 Gameplay Flow
A random province is selected.
A random hint type is shown:
License plate number
Neighboring provinces
Geographic region
Famous place/food
Short descriptive clue
The player clicks on the map to guess.
GeoJSON + Turf.js validate the click:
✔ If the clicked point lies inside the province polygon → correct
Correct answers give points (base + combo + time bonus).
Incorrect answers reduce lives.
The player's turn ends when the timer reaches zero or lives reach zero.
In multiplayer, Player 2 starts immediately after Player 1 finishes.
🎯 End Phase
Scores are compared.
A winner is displayed.
Player(s) can save their score to the leaderboard.

Number of Questions:
GeoKahoot uses a time-based design, meaning:
👉 The number of questions depends on how many the player can answer within the time limit.
Optionally, a fixed-question mode (e.g., 20 questions) may be added later.

Life System
Easy	3	Very Easy	Larger tolerance (60 km if not using GeoJSON)
Normal	3	Standard	Moderate tolerance (40 km)
Hard	2	Hard	Strict: any click outside the boundary is wrong







