import { useState } from "react";
import { Link } from "react-router-dom";

const Game = () => {
    const [typeOfTimer, setTypeOfTimer] = useState("");

    function handleRadioClick() {
        const option1 = document.getElementById("One Minute Timer");
        const option2 = document.getElementById("Two Minute Timer");

        option1.addEventListener("change", () => {
            if (option1.checked) option2.checked = false;
        });

        option2.addEventListener("change", () => {
            if (option2.checked) option1.checked = false;
        });
    }

    return (
        <footer className="absolute bottom-5 left-1/3">
            <div>
                <ul className=" px-5">
                    <input
                        type="radio"
                        id="Two Minute Timer"
                        className="bg-slate-800 text-white"
                        onClick={() => {
                            setTypeOfTimer("twoMin");
                            handleRadioClick();
                        }}
                    />
                    {"Two Minute Timer"}
                    <input
                        type="radio"
                        id="One Minute Timer"
                        className="bg-slate-800 text-white"
                        onClick={() => {
                            setTypeOfTimer("oneMin");
                            handleRadioClick();
                        }}
                    />
                    {" One Minute Timer"}
                </ul>

                <Link
                    to={typeOfTimer === "oneMin" ? "timer2" : "timer1"}
                    className="text-3xl px-5"
                >
                    Start
                </Link>
                <Link to="/" className="text-3xl px-5">
                    Back To Home
                </Link>
            </div>
        </footer>
    );
};

export default Game;