import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

export default function App() {

    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [rolls, setRolls] = React.useState(0)
    const [duration, setDuration] = React.useState(Date.now())
    

    const prevBestDuration = localStorage.getItem('bestDuration')
    if ((!prevBestDuration) || (prevBestDuration && duration < prevBestDuration)){
        localStorage.setItem('bestDuration', duration);
    }

    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
            setDuration(prevDuration => Math.floor((Date.now() - prevDuration) / 1000))

        }
    }, [dice])

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    function rollDice() {
        if(!tenzies) {
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
            setRolls(prevRoll => prevRoll + 1)
        } else {
            setTenzies(false)
            setDice(allNewDice())
            setRolls(0)
            setDuration(Date.now())
        }
    }
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {value: die.value, id: die.id, isHeld: !die.isHeld} :
                die
        }))
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))
    
    return (
        <main>
            {tenzies && <Confetti />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. 
            Click each die to freeze it at its current value between rolls.</p>
            {prevBestDuration && prevBestDuration < 1000 &&  !tenzies && <h3 className="prev-best">Previous Best: {prevBestDuration} seconds</h3>}
            <div className="dice-container">
                {diceElements}
            </div>
            {
            tenzies && 
                <div className="stats-container">
                    <h3 className="stats-roll">Number of Rolls to finish: {rolls}</h3>
                    <h3 className="stats-duration">Time to finish: {duration} seconds</h3>
                    {duration < prevBestDuration ? <h3 className="new-best">{`New Personal Best Set: ${duration} seconds`}</h3>
                                                 : <h3 className="prev-best">{`Previous Personal Best Stands: ${prevBestDuration} seconds`}</h3>}
    
                </div>
            }
            <button 
                className="roll-dice" 
                onClick={rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>
        </main>
    )
}