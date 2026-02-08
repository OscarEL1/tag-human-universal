import { useEffect, useRef } from "react";

export default function QRAccessResult({ status, name }) {
  const messageRef = useRef(null);

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.focus();
    }
  }, [status]);

  let message = "";
  let bgColor = "#6b7280";

  if (status === "GRANTED") {
    message = `Acceso concedido a ${name}`;
    bgColor = "#16a34a";
  }

  if (status === "DENIED") {
    message = "Acceso denegado";
    bgColor = "#dc2626";
  }

  return (
    <div
      ref={messageRef}
      tabIndex="-1"
      role="alert"
      aria-live="assertive"
      style={{
        marginTop: "1rem",
        padding: "1rem",
        borderRadius: "0.5rem",
        backgroundColor: bgColor,
        color: "white",
        fontWeight: "bold",
      }}
    >
      {message || "Esperando escaneo..."}
    </div>
  );
}
