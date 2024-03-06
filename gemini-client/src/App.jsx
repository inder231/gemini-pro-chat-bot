import React from "react";
import Loader from "./components/Loader";

function App() {
  const [searchValue, setSearchValue] = React.useState("");
  const [error, setError] = React.useState("");
  const [chatHistory, setChatHistory] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const surpriseOptions = [
    "Who won the latest Novel Peace Prize?",
    "Where does Pizza come from?",
    "Who do you make a BLT sandwich?",
  ];

  const surprise = () => {
    const randomValue =
      surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
    setSearchValue(randomValue);
  };

  const getResponse = async () => {
    if (!searchValue) {
      setError("Error: Please ask a question!");
      return;
    }
    try {
      setLoading(true);
      const options = {
        method: "POST",
        body: JSON.stringify({
          history: chatHistory,
          message: searchValue,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await fetch("http://localhost:8080/gemini", options);
      const result = await response.json();

      setChatHistory((oldHistory) => [
        { role: "user", parts: searchValue },
        { role: "model", parts: result.message },
        ...oldHistory,
      ]);

      setSearchValue("");
    } catch (error) {
      console.error(error);
      setError("Error: Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setSearchValue("");
    setError("");
    setChatHistory([]);
  };

  return (
    <section className="app">
      <p className="title">A product of gemini ai pro</p>
      <p>
        What do you want to know?
        <button className="surprise" onClick={surprise} disabled={!chatHistory}>
          Surprise me!
        </button>
      </p>
      <div className="input-container">
        <input
          type="text"
          value={searchValue}
          placeholder="When is Holi...?"
          onChange={(e) => setSearchValue(e.target.value)}
        />
        {!error && (
          <button onClick={getResponse} disabled={loading}>
            Ask me
          </button>
        )}
        {error && <button onClick={clear}>Clear</button>}
      </div>
      {true && <p className="error">{error}</p>}
      <div className="search-results">
        <div className="loading">{loading && <Loader />}</div>
        {chatHistory?.map((chatItem, _index) => (
          <div key={_index}>
            <p className="answer">
              {chatItem.role} : {chatItem.parts}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default App;
