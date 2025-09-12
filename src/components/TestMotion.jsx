import { useState } from "react";

export default function ColorTransitionBox() {
    const [focused, setFocused] = useState(false);
    const triggerAnimation = () =>{
        setFocused(false);
        setTimeout(() => {setFocused(true)}, 10);
    }
    return (
        <div style={{ padding: "2rem" }}>
        <div
        className={focused ? "box active" : "box"}
            style={{
            width: "100px",
            height: "100px",
            borderRadius: "8px",
            }}
        />

        <button
            onClick={triggerAnimation}
            style={{ marginTop: "1rem" }}
        >
            Farbe animieren
        </button>
        </div>
    );
}
