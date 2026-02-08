import { render, screen } from "@testing-library/react";
import QRAccessResult from "./QRAccessResult";

describe("QRAccessResult", () => {
  test("muestra acceso concedido", () => {
    render(<QRAccessResult status="GRANTED" name="Juan" />);
    expect(screen.getByText(/Acceso concedido a Juan/i)).toBeInTheDocument();
  });

  test("muestra acceso denegado", () => {
    render(<QRAccessResult status="DENIED" />);
    expect(screen.getByText(/Acceso denegado/i)).toBeInTheDocument();
  });

  test("usa role alert para accesibilidad", () => {
    render(<QRAccessResult status="GRANTED" name="Juan" />);
    const alert = screen.getByRole("alert");
    expect(alert).toBeInTheDocument();
  });
});
