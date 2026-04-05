import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import type { HospitalResult } from '../../services/insuranceService';

interface HospitalCardProps {
  hospital: HospitalResult;
  isActive?: boolean;
  onClick?: () => void;
  activeInsurance?: string;
}

export default function HospitalCard({ hospital, isActive, onClick, activeInsurance }: HospitalCardProps) {
  const { t } = useTranslation();
  const { toggleSaveHospital, isHospitalSaved } = useAppContext();
  const isSaved = isHospitalSaved(hospital.id);

  let insuranceBadgeClass = 'bg-surface-container-high text-on-surface-variant';
  let insuranceBadgeLabel = t('hospitals.coverage_unknown');
  let insuranceIcon = 'help';

  if (hospital.acceptsInsurance === true) {
    insuranceBadgeClass = 'bg-primary/20 text-primary border border-primary/30';
    insuranceBadgeLabel = activeInsurance === 'Self-pay' 
      ? t('hospitals.self_pay_accepted', 'Self-Pay Accepted') 
      : t('hospitals.in_network');
    insuranceIcon = 'check_circle';
  } else if (hospital.acceptsInsurance === false) {
    insuranceBadgeClass = 'bg-error/20 text-error border border-error/30';
    insuranceBadgeLabel = t('hospitals.out_of_network');
    insuranceIcon = 'cancel';
  }

  return (
    <div
      onClick={onClick}
      className={`bg-surface-container-lowest p-6 rounded-xl border-l-4 transition-all cursor-pointer hover:shadow-lg ${
        isActive
          ? 'border-primary shadow-lg scale-[1.02] ring-4 ring-primary/10'
          : 'border-outline-variant/30 hover:border-primary/40 focus:outline-none'
      }`}
    >
      <div className="flex flex-wrap justify-between items-start gap-4 mb-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
          <span className="material-symbols-outlined text-sm">local_hospital</span>
          {hospital.type || 'Hospital'}
          {hospital.matchScore > 0 && (
            <span className="ml-2 bg-tertiary/10 text-tertiary px-2 py-0.5 rounded-md text-[10px] whitespace-nowrap">
              Match Score: {hospital.matchScore}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${insuranceBadgeClass}`}>
            <span className="material-symbols-outlined text-[10px]">{insuranceIcon}</span>
            {insuranceBadgeLabel}
          </div>
          {hospital.rating > 0 && (
            <div className="flex items-center gap-1 text-sm font-bold text-on-surface">
              <span className="material-symbols-outlined text-tertiary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              {hospital.rating.toFixed(1)} <span className="text-on-surface-variant text-xs font-medium">({hospital.userRatingsTotal})</span>
            </div>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); toggleSaveHospital(hospital); }}
            className={`p-2 rounded-full flex items-center justify-center transition-colors ${
              isSaved ? 'text-primary bg-primary/10' : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
            title={isSaved ? t('hospitals.unsave', 'Remove saved hospital') : t('hospitals.save', 'Save hospital')}
          >
            <span
              className="material-symbols-outlined text-[18px]"
              style={isSaved ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              bookmark
            </span>
          </button>
        </div>
      </div>

      <h3 className="text-xl font-headline font-bold text-on-surface mb-1 leading-tight">{hospital.name}</h3>
      <p className="text-sm text-on-surface-variant mb-3">{hospital.address}</p>

      <div className="flex items-center gap-3 text-sm mb-4">
        <span className="font-bold text-on-surface">{hospital.distanceMiles.toFixed(1)} {t('hospitals.miles_away')}</span>
        <span className="text-outline-variant/50">•</span>
        {hospital.isOpenNow ? (
          <span className="font-bold text-primary flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-primary" /> {t('hospitals.open_now')}
          </span>
        ) : (
          <span className="font-bold text-error">{t('hospitals.closed')}</span>
        )}
        {hospital.estimatedWaitTime && (
          <>
            <span className="text-outline-variant/50">•</span>
            <span className="font-bold text-secondary flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">schedule</span> {hospital.estimatedWaitTime}
            </span>
          </>
        )}
      </div>

      {hospital.insuranceNote && (
        <div className="bg-primary/5 border border-primary/10 p-3 rounded-lg flex flex-col gap-2 mb-6 items-start">
          <div className="flex gap-3 items-start w-full">
            <span className="material-symbols-outlined text-primary text-lg mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            <p className="text-sm italic text-on-surface-variant leading-relaxed">
              "{hospital.insuranceNote}"
            </p>
          </div>
          {hospital.matchReason && (
            <div className="mt-1 ml-8 flex flex-wrap gap-1">
              {hospital.matchReason.split('; ').map((reason, idx) => (
                <span key={idx} className="bg-surface-container-high text-on-surface-variant text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  {reason}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 mt-auto border-t border-outline-variant/15 pt-4">
        {hospital.phone ? (
          <a
            href={`tel:${hospital.phone}`}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 min-w-[100px] flex justify-center items-center gap-2 py-2 px-3 rounded-lg font-bold text-sm bg-surface text-secondary border border-outline-variant/30 hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-sm">call</span>
            {t('hospitals.call')}
          </a>
        ) : (
          <button disabled className="flex-1 min-w-[100px] flex justify-center items-center gap-2 py-2 px-3 rounded-lg font-bold text-sm bg-surface text-on-surface-variant/30 border border-outline-variant/10 cursor-not-allowed">
            <span className="material-symbols-outlined text-sm">call</span>
            {t('hospitals.call')}
          </button>
        )}
        
        <a
          href={hospital.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex-1 min-w-[100px] flex justify-center items-center gap-2 py-2 px-3 rounded-lg font-bold text-sm bg-primary text-white hover:bg-primary-container transition-colors shadow-lg shadow-primary/20"
        >
          <span className="material-symbols-outlined text-sm">directions</span>
          {t('hospitals.directions')}
        </a>
        
        {hospital.website && (
          <a
            href={hospital.website}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-1 min-w-[100px] flex justify-center items-center gap-2 py-2 px-3 rounded-lg font-bold text-sm bg-surface text-secondary border border-outline-variant/30 hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-sm">language</span>
            {t('hospitals.website')}
          </a>
        )}
      </div>
    </div>
  );
}
