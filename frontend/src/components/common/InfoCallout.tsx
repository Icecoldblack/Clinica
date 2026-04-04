interface InfoCalloutProps {
  title: string;
  body: string;
}

export default function InfoCallout({ title, body }: InfoCalloutProps) {
  return (
    <div className="p-5 bg-tertiary/10 border-b border-tertiary/20">
      <div className="flex gap-3">
        <div className="bg-tertiary text-white rounded-full p-1 h-fit flex-shrink-0">
          <span
            className="material-symbols-outlined text-[20px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            shield
          </span>
        </div>
        <div>
          <h3 className="font-headline font-bold text-tertiary text-sm leading-tight">
            {title}
          </h3>
          <p className="text-on-surface-variant text-xs mt-1">{body}</p>
        </div>
      </div>
    </div>
  );
}
