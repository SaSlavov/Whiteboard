import React, { useState } from "react";

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");
  
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const setButtonsTheme = () => {
    return {
      color: `${theme === "light" ? "white" : "lightgreen"}`
    };
  };

  const setLabelsTheme = () => {
    return {
      color: `${theme === "light" ? "darkblue" : "lightgreen"}`
    };
  };

  const color = theme === "light" ? "#333" : "#FFF";
  const backgroundColor = theme === "light" ? "#FFF" : "#333";

  document.body.style.color = color;
  document.body.style.backgroundColor = backgroundColor;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setButtonsTheme, setLabelsTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const ThemeContext = React.createContext({ theme: "light", updateFn: () => { } });