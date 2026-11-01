import Link from "next/link";

const styles = {
  primary:
    "inline-flex rounded-full bg-rail px-4 py-2 text-sm font-semibold text-surface hover:bg-raildeep disabled:cursor-not-allowed disabled:opacity-50",
  quiet:
    "inline-flex rounded-full bg-surface px-4 py-2 text-sm font-semibold shadow-[inset_0_0_0_1px_var(--line)] hover:text-rail disabled:cursor-not-allowed disabled:opacity-50",
};

export function Button({
  href,
  children,
  variant = "primary",
  disabled = false,
  onClick,
}: {
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "quiet";
  disabled?: boolean;
  onClick?: () => void;
}) {
  const className = styles[variant];

  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" disabled={disabled} className={className} onClick={onClick}>
      {children}
    </button>
  );
}