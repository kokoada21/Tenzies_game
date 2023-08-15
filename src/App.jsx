import { useState, useEffect, useRef }  from 'react'
import './App.css'
import Die from './components/Die'
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'

function App() {
  const numberOfDice = 10;
  const intervalRef = useRef();

  const [diceValues, setDiceValues] = useState(allNewDice())
  const [rolls, setRolls] = useState(0);
  const [time, setTime] = useState(0);
  const [gameStatus, setGameStatus] = useState("start");
  const [highscore, setHighscore] = useState({});
  

  useEffect(() => {
    if("highscore" in localStorage){
       setHighscore(JSON.parse(localStorage.getItem("highscore")));
      }
  }, [gameStatus])

  function allNewDice() {
    const newDice = [];
    for(let i = 0; i < numberOfDice; i++){
      newDice.push(generateNewDie());
    }
    return newDice
  }

  function generateNewDie() {
    return {
      value: Math.floor(Math.random() * 6) + 1,
      isHeld: false,
      id: nanoid()
    }
  }

  function play() {
    if(gameStatus =="start") {
      setGameStatus("playing")
      rollDice()
    }else if(gameStatus == "playing") {
      rollDice()
    }else {
      resetGame()
    }
  }

  function rollDice(){
    setDiceValues(prevDice => 
      prevDice.map(die => {
        return die.isHeld ?
          die :
          generateNewDie()
      }))
    setRolls(rolls => rolls + 1)
  }

  function holdDice(id) {
    if(gameStatus === "start") setGameStatus("playing")
    setDiceValues((prevDicevalues) => 
       prevDicevalues.map((prevDie) => {
        if(prevDie.id === id){
          return({
            ...prevDie,
            isHeld: !prevDie.isHeld
          });
        }else{
          return prevDie
        }
      }))
  }
  //Timer setup
  useEffect(() => {
      if(gameStatus === "playing"){
        intervalRef.current = setInterval(() => {
          setTime(time => time +1)
        }, 1000);
      }
      return () => clearInterval(intervalRef.current);
  }, [gameStatus])

  //Winning condition
  useEffect(() =>{
    const allHeld = diceValues.every(die => die.isHeld);
    const firstValue = diceValues[0].value;
    const allSameValue = diceValues.every(die => die.value === firstValue)
    if(allHeld && allSameValue) {
      pushHighscore();
      setGameStatus("won");
    }
  },[diceValues])

  function pushHighscore(){
    let currectHighscore;
    if(JSON.stringify(highscore) === "{}"){
      currectHighscore = {rolls: rolls, time: time}
    }else{
      currectHighscore = {
        rolls: rolls < highscore.rolls ? rolls : highscore.rolls,
        time: time < highscore.time ? time : highscore.time
      }
    }
    localStorage.setItem("highscore", JSON.stringify(currectHighscore));
  }

  function resetGame() {
    setGameStatus("start")
    setRolls(0);
    setTime(0);
    setDiceValues(allNewDice()); 
  }

  const diceElement = diceValues.map(die => 
      <Die 
      key={die.id} 
      value={die.value} 
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
      />)
  
  return (
    <main>
    <section className='main--container'>
      {gameStatus==="won" && <Confetti/>}
      <h1>Tenzies</h1>
      <h4>Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</h4>
      <div className='dies--container'>
        {diceElement}
     </div>
      <button
        className='roll--button' 
        onClick={play}>
        {gameStatus=="won" ? "New game" : "Roll"}
      </button>
    </section>
    <section className='stats--panel'>
      <h4>Rolls: {rolls}</h4>
      <h4>Time: {time}</h4>
      <h4>Min rolls: {highscore.rolls}</h4>
      <h4>Best time: {highscore.time}</h4>
    </section>
    </main>
  )
}

export default App
