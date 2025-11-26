#GeoKahoot 🗺️

A fun geography game where you must find all 81 provinces of Türkiye on a map. You can play solo or competitively with friends.

## 🎮 Game Modes

### 🟢 Easy Mode
- **Hint:** City license plate number (e.g., 34 = Istanbul, 35 = Izmir)
- **Mission:** Find the correct city by clicking on the map.
- **Starting Lives:** 3 lives
- **Scoring:**
- 0-20 km: **+20 points** (excellent)
- 20-60 km: **+10 points** (good)
- 60-150 km: **+5 points** (medium)
- >150 km: **0 points + loss of life** (very far)

### 🔴 Hard Mode
- **Hint:** Information about the city's cultural characteristics, history, and famous places.
- **Sample Hint:** "Pamukkale is known worldwide for its travertines and the ancient city of Hierapolis." → Denizli
- **Starting Lives:** 2 lives
- **Scoring:** Correct answer + bonuses
- ⚡ **Speed ​​Bonus:** Within 3 seconds = +10 points, within 8 seconds = +5 points
- 🔥 **Combo Bonus:** 3 correct answers in a row = +5 points, 5 correct answers in a row = +20 points

## 📁 File Structure

```
kahoot/
├── index.html # Homepage and game interface
├── script.js # Game logic and map interactions
├── style.css # Style and design
├── rules.html # Detailed game rules page
├── login.jpg # Homepage background
├── mor.jpg # Game page background
└── README.md # This file
```

## 🚀 How to Play

### Game Setup
1. **Number of Players:** Select 1-4 players
2. **Enter Name:** Type the name of each player
3. **Select Mode:** Easy or Hard
4. **Set Time:** Time for each player (default 60 seconds)
5. **Start:** Click the "Start Game" button

### Game Order
- Read the hint displayed on the hint screen
- Select the correct province by clicking on the map
- Your score is calculated based on the proximity of the click location to the target
- Skip:** You will lose -2 points and -1 life for skipping the question
- Finish Turn:** You can end your turn early

### Game End
- The player with the highest score after all players have finished their turns wins
- Your final score is calculated by **Score You can save it to your table**
- Saved scores are stored in browser storage.

## 🛠️ Technical Details

### Cultural Hints
- Cultural hints for all 81 provinces are embedded directly in `script.js`
- No external resources or API calls required
- **Benefits:** Works offline, loads quickly, no CORS issues

### Centroids
- The center coordinates of each province are stored in the `plateCentroids` table.
- No GeoJSON file needed.
- The game runs completely without GeoJSON.

### Point System
- A map click is evaluated based on the nearest province center.
- Distance is calculated using the Haversine formula.
- In Easy mode: tiered scoring based on distance.
- In Hard mode: combo and speed bonuses are applied.

## 📖 Learn the Rules

For detailed game rules, click the **Rules** button in-game or open the `rules.html` file.

## 🎯 Strategy Tips

- **Learn Turkey's Geography:** Where are the provinces located by region?
- **Remember License Plate Numbers:** Learned if you start in Easy mode.
- **Cultural Knowledge:** Identify famous places (Pamukkale, Nemrut, Cappadocia, etc.) in Hard mode.
- **Speed ​​vs. Accuracy:** Quick answers give bonus points, but wrong answers cost lives.
- **Life Management:** Avoid risky guesses; If you run out of lives, your turn ends.

## 📝 Features

✅ Turkish interface and rules
✅ Single and multiplayer support
✅ Two difficulty modes (Easy & Hard)
✅ Interactive map (Leaflet + OpenStreetMap)
✅ Scoreboard (browser storage)
✅ Responsive design
✅ Runs entirely client-side (no server required)

## 🌐 Browser Compatibility

Modern browsers are compatible:
- ✅ Google Chrome
- ✅ Mozilla Firefox
- ✅ Safari
- ✅ Microsoft Edge

## 📄 About

This game was developed to playfully learn the geography of Türkiye. Map data is provided by **OpenStreetMap** and **Leaflet.js**.

---

**Have fun playing! 🎮🗺️**


