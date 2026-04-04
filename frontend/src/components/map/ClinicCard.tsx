import { useTranslation } from 'react-i18next';
import type { Clinic } from '../../services/clinicService';

interface ClinicCardProps {
  clinic: Clinic;
  isActive?: boolean;
  onClick?: () => void;
}

export default function ClinicCard({ clinic, isActive = false, onClick }: ClinicCardProps) {
  const { t } = useTranslation();

  return (
    <div
      onClick={onClick}
      className={`group relative bg-surface-container-lowest rounded-xl p-5 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all cursor-pointer border ${
        isActive ? 'border-primary/30 shadow-lg shadow-primary/10' : 'border-transparent hover:border-primary/10'
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-headline font-bold text-lg leading-tight text-on-surface group-hover:text-primary transition-colors">
          {clinic.name} {clinic.isFqhc && '✦'}
        </h4>
        <span className="text-xs font-bold text-secondary whitespace-nowrap ml-2">
          {clinic.distanceMiles.toFixed(1)} mi
        </span>
      </div>

      {/* Address */}
      <p className="text-sm text-on-surface-variant mb-4">{clinic.address}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {clinic.acceptsUninsured && (
          <span className="px-2 py-1 bg-secondary-container text-on-secondary-container text-[10px] font-bold rounded uppercase">
            Sin Seguro ✓
          </span>
        )}
        {clinic.hasMentalHealth && (
          <span className="px-2 py-1 bg-surface-container-high text-on-surface-variant text-[10px] font-bold rounded uppercase">
            Salud Mental ✓
          </span>
        )}
        {clinic.isFqhc && (
          <span className="px-2 py-1 bg-surface-container-high text-on-surface-variant text-[10px] font-bold rounded uppercase">
            FQHC
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-3 border-t border-outline-variant/10">
        {clinic.phone && (
          <a
            href={`tel:${clinic.phone}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-sm font-bold text-secondary hover:underline"
          >
            <span className="material-symbols-outlined text-sm">call</span>
            {clinic.phone}
          </a>
        )}
        <a
          href={`https://maps.google.com/?q=${encodeURIComponent(clinic.address)}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1 text-sm font-bold text-primary hover:underline ml-auto"
        >
          <span className="material-symbols-outlined text-sm">directions</span>
          {t('map.card_directions')}
        </a>
      </div>
    </div>
  );
}
