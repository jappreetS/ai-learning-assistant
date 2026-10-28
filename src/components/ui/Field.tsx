type Choice = string | { value: string; label: string };

function choiceValue(choice: Choice) {
  return typeof choice === "string" ? choice : choice.value;
}

function choiceLabel(choice: Choice) {
  return typeof choice === "string" ? choice : choice.label;
}

export function Field({
  label,
  value,
  onChange,
  multiline = false,
  options,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  options?: Choice[];
  type?: string;
}) {
  const className =
    "mt-1.5 w-full rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-rail focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--rail)_12%,transparent)]";

  return (
    <label className="block text-sm font-semibold">
      {label}
      {options ? (
        <select
          className={className}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          {options.map((option) => (
            <option key={choiceValue(option)} value={choiceValue(option)}>
              {choiceLabel(option)}
            </option>
          ))}
        </select>
      ) : multiline ? (
        <textarea
          className={`${className} min-h-32`}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          type={type}
          className={className}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </label>
  );
}