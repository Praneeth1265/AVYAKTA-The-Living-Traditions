// Very low opacity paisley/geometric background texture
export default function PaisleyBg() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 opacity-[0.04]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2392791b' fill-rule='evenodd'%3E%3Ccircle cx='40' cy='40' r='3'/%3E%3Cpath d='M40 10 Q55 25 40 40 Q25 25 40 10z'/%3E%3Cpath d='M40 70 Q55 55 40 40 Q25 55 40 70z'/%3E%3Cpath d='M10 40 Q25 55 40 40 Q25 25 10 40z'/%3E%3Cpath d='M70 40 Q55 55 40 40 Q55 25 70 40z'/%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: "80px 80px",
      }}
    />
  );
}
