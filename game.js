// LIFE 
(function() {
    // <---------- DOM Element ---------->
    const cardsContainer = document.querySelector(".cards-container")
    const timerEl = document.querySelector(".timer .num")
    const tryEl = document.querySelector(".try span")
    const scoreEl = document.querySelector(".score .num")
    const resetBtn = document.querySelector(".reset-container")
    const toast = document.getElementById("toast")
        // <---------- Variables ---------->
    const cardIcons = {
        ball: "icons/ball.svg",
        boot: "icons/boot.svg",
        flag: "icons/flag.svg",
        goal: "icons/goal.svg",
        medal: "icons/medal.svg",
        shirt: "icons/shirt.svg",
        trophy: "icons/trophy.svg",
        stadium: "icons/stadium.svg",
        manchester: "icons/manchester-united.png",
        realMadrid: "icons/real-madrid.png",
        worldCup: "icons/world-cup.png",
        ballonDor: "icons/ballon-dor.png"
    }
    const specialMessages = {
        manchester: { emoji: "😈", title: "Red Devils!", message: "Old Trafford is calling your name" },
        realMadrid: { emoji: "👑", title: "Hala Madrid!", message: "Greatest club in history" },
        worldCup: { emoji: "🏆", title: "World Cup!", message: "The pinnacle of football" },
        ballonDor: { emoji: "⭐", title: "Ballon d'Or!", message: "Best player in the world" },
        genericMessages: [
            { emoji: "🔥", title: "Nice one!", message: "Keep that focus going" },
            { emoji: "👏", title: "Well played", message: "That's how it's done" },
            { emoji: "💪", title: "Strong match!", message: "You're on a roll" }
        ]
    }
    const ratings = {
        perfect: { icon: "🏆", title: "Perfect!", message: "Flawless performance, world class" },
        veryGood: { icon: "⭐", title: "Very Good!", message: "Sharp memory, strong game" },
        good: { icon: "👏", title: "Good!", message: "Solid effort, keep it up" },
        bad: { icon: "😅", title: "Not bad", message: "You made it through, barely" },
        lose: { icon: "😢", title: "You Lose", message: "Better luck next match" },
    }
    const sounds = {
        incorrect: new Audio("Sounds/mixkit-losing-bleeps-2026.wav"),
        correct: new Audio("Sounds/mixkit-retro-arcade-casino-notification-211.wav"),
        win: new Audio("Sounds/preview (1).mp3"),
        lose: new Audio("Sounds/preview.mp3"),
    }
    let arrCards = []
    let arrFlipped = []
    let isClosedPanel = false
    let isGameStarted = false
    let counter;
    let increment = 0
    let attemptsNumber = 0
    let score = 0
        // <---------- Functions ---------->

    // Creating cards using the Factory function
    function createCards(name, value, id) {
        return {
            name: name,
            value: value,
            id: id,
            isMatch: false,
            isFlipped: false
        }
    }
    // Building cards by adding a new Array
    function cardBuilding(cardIcons) {
        arrCards = []
        let cardId = 0
        Object.entries(cardIcons).forEach(([name, value]) => {
            arrCards.push(createCards(name, value, cardId++))
            arrCards.push(createCards(name, value, cardId++))
        });
        arrCards.sort(() => Math.random() - 0.5)
        cardRendering(arrCards)
    }
    // Display cards and create DOM elements
    function cardRendering(cards) {
        cards.forEach(card => {
            const mainCard = document.createElement("div")
            mainCard.className = "main-card"
            mainCard.dataset.id = card.id
            cardsContainer.appendChild(mainCard)
            const frontCard = document.createElement("div")
            frontCard.className = "front-card"
            const frontImg = document.createElement("img")
            frontImg.className = "opacity-40"
            frontImg.src = "icons/shot.png"
            frontImg.width = 45
            const backCard = document.createElement("div")
            backCard.className = "back-card"
            mainCard.appendChild(frontCard)
            frontCard.appendChild(frontImg)
            mainCard.appendChild(backCard)
            const img = document.createElement("img")
            img.src = card.value
            img.alt = card.name
            img.width = 45
            backCard.appendChild(img)

            mainCard.addEventListener("click", () => {
                cardHandel(cards, card.id)
            })
        })
    }
    // Create a timer
    function setTimer() {
        clearInterval(counter)
        counter = setInterval(() => {
            increment++
            const minutes = Math.floor(increment / 60)
            const seconds = increment % 60
            const setSeconds = seconds < 10 ? "0" + seconds : seconds
            timerEl.textContent = `${minutes}:${setSeconds}`
        }, 1000)
    }

    // <---------- Logic Game ---------->
    // Start a game and Flip the cards
    function cardHandel(cards, id) {
        const card = cards.find(c => c.id == id)
        if (card.isFlipped || card.isMatch || isClosedPanel) return
        if (!isGameStarted) {
            isGameStarted = true
            setTimer()
        }

        flipped(card)
        arrFlipped.push(card)
        if (arrFlipped.length === 2) {
            cardMatched(card)
        }
    }
    // Flip the Cards
    function flipped(card) {
        card.isFlipped = true
        const flipCard = document.querySelector(`[data-id="${card.id}"]`)
        flipCard.classList.add("transform-[rotateY(180deg)]")
    }
    // Re-flip the cards
    function unFlipped(card) {
        card.isFlipped = false
        const flipCard = document.querySelector(`[data-id="${card.id}"]`)
        flipCard.classList.remove("transform-[rotateY(180deg)]")
    }
    // Organizing card matching events
    function cardMatched(card) {
        countTry()
        const [fristCard, scoundCard] = arrFlipped
        isClosedPanel = true
        if (fristCard.name === scoundCard.name) {
            fristCard.isMatch = true
            scoundCard.isMatch = true
            setScore()
            reset()
            matchingFavoriteTeam(fristCard, scoundCard)
            choosingPremiumCard(fristCard)
            sounds.correct.currentTime = 0
            sounds.correct.play().catch(() => {})
            gameEnd()
        } else {
            setTimeout(() => {
                isClosedPanel = false
                unFlipped(fristCard)
                unFlipped(scoundCard)
                reset()
            }, 1000)
            sounds.incorrect.currentTime = 0
            sounds.incorrect.play().catch(() => {})
        }
    }
    // Refilling the array
    function reset() {
        arrFlipped = []
        isClosedPanel = false
    }
    // Create the number of try
    function countTry() {
        attemptsNumber++
        tryEl.textContent = attemptsNumber
    }
    // Create the number of scores
    function setScore() {
        score += 10
        scoreEl.textContent = score
    }
    // To set the correct card matches
    function matchingFavoriteTeam(fristCard, scoundCard) {
        const fristCardEl = document.querySelector(`[data-id="${fristCard.id}"] .back-card`)
        const scoundCardEl = document.querySelector(`[data-id="${scoundCard.id}"] .back-card`)
        fristCardEl.classList.add("true")
        scoundCardEl.classList.add("true")
    }
    // Choosing premium cards and attaching messages
    function choosingPremiumCard(fristCard) {
        const randomToast = specialMessages[fristCard.name] ? specialMessages[fristCard.name] :
            specialMessages.genericMessages[Math.floor(Math.random() * specialMessages.genericMessages.length)];

        toast.querySelector(".emoji").textContent = randomToast.emoji
        toast.querySelector(".title").textContent = randomToast.title
        toast.querySelector(".message").textContent = randomToast.message

        toast.classList.remove("opacity-0", "scale-95", "-translate-y-3")
        toast.classList.add("opacity-100", "scale-100", "-translate-y-0")

        clearTimeout(toast._timer)
        toast._timer = setTimeout(() => {
            toast.classList.remove("opacity-100", "scale-100", "-translate-y-0")
            toast.classList.add("opacity-0", "scale-95", "-translate-y-3")
        }, 3000)
    }
    //Reset and switch games
    function resetGame() {
        clearInterval(counter)
        reset()
        isGameStarted = false
        score = 0
        attemptsNumber = 0
        tryEl.textContent = "0"
        scoreEl.textContent = "0"
        timerEl.textContent = "0:0"
        cardsContainer.innerHTML = ""
        cardBuilding(cardIcons)
    }
    resetBtn.addEventListener("click", resetGame)

    // To Set the user level and the end of the game
    function gameEnd() {
        const allMatched = arrCards.every(card => card.isMatch)
        if (allMatched) {
            let rating;
            clearInterval(counter)
            switch (true) {
                case (increment <= 40 && attemptsNumber <= 12 && score >= 100):
                    rating = ratings.perfect
                    sounds.win.play()
                    break;
                case (increment <= 60 && attemptsNumber <= 16 && score >= 80):
                    rating = ratings.veryGood
                    sounds.win.play()
                    break;
                case (increment <= 80 && attemptsNumber <= 25 && score >= 60):
                    rating = ratings.good
                    sounds.win.play()
                    break;
                case (increment <= 120 && attemptsNumber <= 35):
                    rating = ratings.bad
                    sounds.lose.play()
                    break;
                default:
                    rating = ratings.lose
                    sounds.lose.play()
            }
            showEndModal(rating)
        }
    }
    // pop-up display User level
    function showEndModal(rating) {
        const modal = document.getElementById("end-modal")
        const panel = modal.querySelector("div")

        modal.querySelector(".end-icon").textContent = rating.icon
        modal.querySelector(".end-title").textContent = rating.title
        modal.querySelector(".end-message").textContent = rating.message
        modal.querySelector(".end-score").textContent = score
        modal.querySelector(".end-moves").textContent = attemptsNumber
        modal.querySelector(".end-time").textContent = increment + "s"

        modal.classList.remove("opacity-0", "pointer-events-none")
        modal.classList.add("opacity-100")
        panel.classList.remove("scale-90")
        panel.classList.add("scale-100")
    }

    document.querySelector(".end-play-again").addEventListener("click", () => {
        const modal = document.getElementById("end-modal")
        const panel = modal.querySelector("div")

        modal.classList.add("opacity-0", "pointer-events-none")
        modal.classList.remove("opacity-100")
        panel.classList.add("scale-90")
        panel.classList.remove("scale-100")

        resetGame()
    })

    cardBuilding(cardIcons)
}())