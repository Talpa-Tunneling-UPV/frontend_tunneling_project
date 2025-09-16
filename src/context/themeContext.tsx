import { createContext, useEffect, useState, type PropsWithChildren } from "react";

type Theme = "light" | "dark";

type ThemeContextType = {
    theme: Theme,
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider = ({ children }: PropsWithChildren) => {

    const [theme, setTheme] = useState<Theme>("dark");

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") as Theme | null;
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }, [])
    useEffect(() => {
        const root = window.document.documentElement;

        root.classList.remove("light", "dark")
        root.classList.add(theme);
        localStorage.setItem("theme", theme)
    })

    return <ThemeContext.Provider value={{ theme, setTheme}}>
        {children}
    </ThemeContext.Provider>
}