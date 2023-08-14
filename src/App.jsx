import { useState, useEffect }  from 'react'
import './App.css'
import Die from './components/Die'
import { nanoid } from 'nanoid'

function App() {
  const [diceValues, setDiceValues] = useState(allNewDice())
  const [won, setWon] = useState(false);


  useEffect(() =>{
    const allHeld = diceValues.every(die => die.isHeld);
    const firstValue = diceValues[0].value;
    const allSameValue = diceValues.every(die => die.value === firstValue)
    if(allHeld && allSameValue) {
      setWon(true);
      console.log("You won");
    }
  },[diceValues])

  function allNewDice() {
    const newDice = [];
    for(let i = 0; i < 10; i++){
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

  function rollDice() {
    setDiceValues(prevDice => 
        prevDice.map(die => {
          return die.isHeld ?
            die :
            generateNewDie()
        }))
  }

  function holdDice(id) {
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
  

  const diceElement = diceValues.map(die => 
      <Die 
      key={die.id} 
      value={die.value} 
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
      />)

  return (
    <main className='main--container'>
      <h1>Tenzies</h1>
      <h4>Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</h4>
      <div className='dies--container'>
        {diceElement}
     </div>
      <button onClick={rollDice}>Roll</button>
    </main>
  )
}

export default App
