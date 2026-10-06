export default function Input({tipo = "text", valor, onChange, placeholder, onKeyDown}) {
  return (
    <input
      type={tipo}
      value={valor}
      placeholder={placeholder}
      onKeyDown={onKeyDown}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
