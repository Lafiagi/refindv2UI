interface Props {
  status: string;
  size?: 'sm' | 'md';
}

const statusStyles: Record<string, string> = {
  requested: 'bg-yellow-100 text-yellow-800',
  accepted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  appealed: 'bg-blue-100 text-blue-800',
  closed: 'bg-gray-100 text-gray-800',
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-xs',
};

export default function ClaimStatusPill({ status, size = 'md' }: Props) {
  const key = status || 'requested';
  const label = key.charAt(0).toUpperCase() + key.slice(1);
  const cls = statusStyles[key] || statusStyles.requested;
  const sizeCls = sizeStyles[size];

  return (
    <span className={`inline-flex items-center rounded-full font-semibold ${cls} ${sizeCls}`}>
      {label}
    </span>
  );
}


