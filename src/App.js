import React, { useState } from 'react';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState([]);

  const isOperator = (char) => ['+', '-', '*', '/'].includes(char);

  const handleButtonClick = (value) => {
    if (value === 'C') {
      setInput('');
      setResult('');
    } else if (value === '=') {
      try {
        const evaluated = evaluateExpression(input);
        const formattedResult = formatResult(evaluated);
        const calculation = `${input} = ${formattedResult}`;
        setHistory((prevHistory) => [calculation, ...prevHistory].slice(0, 10));
        setResult(formattedResult);
        setInput('');// this will clear the input field 
      } catch (error) {
        setResult('Error');
      }
    } else if (value === 'DEL') {
      setInput((prevInput) => prevInput.slice(0, -1));
    } else {
      setInput((prevInput) => prevInput + value);
    }
  };
  
  const formatResult = (result) => {
    // Format the result with thousands separators and up to 2 decimal places
    return result.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };
  

  const evaluateExpression = (expr) => {
    const tokens = [];
    let numBuffer = '';

    for (let i = 0; i < expr.length; i++) {
      const char = expr[i];

      if (!isNaN(char) || char === '.') {
        // Collect digits and decimal points to form numbers
        numBuffer += char;
      } else if (isOperator(char)) {
        // Push the collected number (if any) and the operator to the tokens array
        if (numBuffer !== '') {
          tokens.push(parseFloat(numBuffer));
          numBuffer = '';
        }
        tokens.push(char);
      }
    }
    // Push the last collected number (if any)
    if (numBuffer !== '') {
      tokens.push(parseFloat(numBuffer));
    }

    // Perform the calculations manually
    let result = tokens[0];
    for (let i = 1; i < tokens.length; i += 2) {
      const operator = tokens[i];
      const operand = tokens[i + 1];
      if (operator === '+') {
        result += operand;
      } else if (operator === '-') {
        result -= operand;
      } else if (operator === '*') {
        result *= operand;
      } else if (operator === '/') {
        if (operand === 0) {
          throw new Error('Division by zero');
        }
        result /= operand;
      }
    }

    return result;
  };

  const buttons = [
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    '0', '.', '=', '+',
    'C', 'DEL',
  ];

  return (
    <div className="App">
      <div className="calculator">
        <input
        type="text"
        id="textBox1"
        name="textBox"
        placeholder="Enter any number" 
        autocomplete="on" 
        minlength="3" 
        maxlength="50" 
        aria-label="Calculator"
          className="input"
          value={input}
          readOnly
        />
        <label for="textBox1">Enter any number:</label>
        <div className="buttons">
          {buttons.map((button, index) => (
            <button
            button id="myButton" type="submit" aria-label="Example Submit Button"
            key={index}
            onClick={() => handleButtonClick(button)}
            >
              {button === 'DEL' ? 'Delete' : button}
            </button>
          ))}
        </div>
        <div className="result">
          {result}
        </div>
        <div className="history">
          <h3>Calculation History:</h3>
          <ul>
            {history.map((calculation, index) => (
              <li key={index}>{calculation}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
