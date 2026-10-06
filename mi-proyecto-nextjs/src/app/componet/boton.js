import Image from "next/image";
import styles from "./page.module.css";

export default function Boton({onClick, texto}) {
  return (
    <button onClick={onClick}>{texto}</button>
  );
}
