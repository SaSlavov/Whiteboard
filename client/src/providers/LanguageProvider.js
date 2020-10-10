import React, { useState } from "react";

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState("english");

    const toggleLanguage = () => {
        setLanguage(language === "bulgarian" ? "english" : "bulgarian");
    };

    const setLabels = (label, reverse = false) => {

        const english = {
            register: "Register",
            logIn: "Log in",
            logOut: "Log Out",
            home: "Home",
            createBoard: "Create Board",
            allBoards: "All Boards",
            homepage: "Homepage",
            mode: "",
            dark: "dark",
            light: "light",
            english: (reverse) ? "Англ." : "EN",
            bulgarian: (reverse) ? "БГ" : "BG",
            chat: "Chat room",
            eraser: "Eraser",
            selectColor: "Select color",
            pen: "Pen",
            marker: "Marker",
            brush: "Brush",
            calligraph: "Calligraph",
            spray: "Spray",
            save: "Save",
            load: "Load",
            undo: "Undo",
            author: "Author",
            theme: "Theme",
            username: "Username",
            password: "Password",
            usernameMinLength: "Username should be at least 4 letters",
            usernameMaxLength: "Username should be no more than 10 letters",
            passwordMinLength: "Password should be at least 4 letters",
            passwordMaxLength: "Password should be no more than 10 letters",
            passwordRequirement1: "Password should contain at least one letter",
            passwordRequirement2: "Password should contain at least one number",
            email: "E-Mail",
            passwordConfirmation: "Confirm",
            enterValidEmail: "Invalid E-mail",
            confirmWarning: "Confirm should match the password",
            confirm: "Confirm",
            from: "From",
            send: "Send",
            change: "Change",
            newPass: "New password",
            topic: "Topic",
            resetPass: "Reset password",
            recoverPassMsg: "A link to make a new password has been sent to the provided email!",

        };

        const bulgarian = {
            register: "Регистрация",
            logIn: "Вписване",
            logOut: "Отписване",
            home: "Начало",
            createBoard: "Създай Дъска",
            allBoards: "Всички Дъски",
            homepage: "Начална страница",
            mode: "",
            dark: "тъмен",
            light: "светъл",
            english: (reverse) ? "EN" : "Англ.",
            bulgarian: (reverse) ? "BG" : "БГ",
            chat: "Лаф",
            eraser: "Гума",
            selectColor: "Избор на цвят",
            pen: "Молив",
            marker: "Маркер",
            brush: "Четка",
            calligraph: "Писалка",
            spray: "Спрей",
            save: "Съхрани",
            load: "Зареди",
            undo: "Стъпка назад",
            author: "Автор",
            theme: "Тема",
            username: "Потребител",
            password: "Парола",
            usernameMinLength: "Потребителското име трябва да съдържа поне 4 символа",
            usernameMaxLength: "Потребителското име не трябва да надвишава 10 символа",
            passwordMinLength: "Паролата трябва да съдържа поне 4 символа",
            passwordMaxLength: "Паролата не трябва да надвишава 10 символа",
            passwordRequirement1: "Паролата трябва да съдържа поне една буква",
            passwordRequirement2: "Паролата трябва да съдържа поне една цифра",
            email: "Е-поща",
            passwordConfirmation: "Потвърди паролата",
            enterValidEmail: "Невалидна Е-поща",
            confirmWarning: "Потвърждението не съвпада с паролата",
            confirm: "Потвърдете",
            from: "От",
            send: "Изпрати",
            change: "Промени",
            newPass: "Нова парола",
            topic: "Тема",
            resetPass: "Промяна на парола",
            recoverPassMsg: "На посочената Е-поща беше изпратен линк за промяна на паролата!"
        };

        return eval(language)[label];
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, setLabels }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const LanguageContext = React.createContext({ language: "english", updateFn: () => { } });