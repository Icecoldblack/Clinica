import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { HospitalResult } from '../../services/insuranceService';

interface Props {
  hospitals: HospitalResult[];
  hospitalSearchContext?: string;
  searchInsurance?: string;
  searchPlan?: string;
}

export default function EmbeddedHospitalCards({ hospitals, hospitalSearchContext, searchInsurance, searchPlan }: Props) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const getUrlParams = (highlightId?: string) => {
    const params = new URLSearchParams();
    if (hospitalSearchContext) params.set('context', hospitalSearchContext);
    if (searchInsurance) params.set('insurance', searchInsurance);
    if (searchPlan) params.set('plan', searchPlan);
    if (highlightId) params.set('highlight', highlightId);
    
    const qs = params.toString();
    return qs ? `?${qs}` : '';
  };

  const handleSeeAll = () => {
    navigate(`/hospitals${getUrlParams()}`);
  };

  const handleCardClick = (hospital: HospitalResult) => {
    navigate(`/hospitals${getUrlParams(hospital.id)}`);
  };

  return (
    <div className="mt-3">
      <p className="text-xs font-bold text-on-surface-variant/70 uppercase tracking-wider mb-2 flex items-center gap-1">
        <span className="material-symbols-outlined text-sm">local_hospital</span>
        {t('chat.hospitals_found', 'Nearby hospitals that can help:')}
      </p>

      <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory">
        {hospitals.slice(0, 4).map((h) => (
          <button
            key={h.id}
            onClick={() => handleCardClick(h)}
            className="flex-shrink-0 w-44 snap-start bg-surface-container-lowest border border-outline-variant/15 rounded-xl p-3 text-left hover:border-primary/30 hover:shadow-md transition-all active:scale-[0.97] group"
          >
            {/* Insurance badge */}
            <div className="mb-2">
              {h.acceptsInsurance === true && (
                <span className="text-[10px] font-bold bg-primary/15 text-primary px-2 py-0.5 rounded-full">
                  {t('hospitals.in_network', 'In-Network')} ✓
                </span>
              )}
              {h.acceptsInsurance === false && (
                <span className="text-[10px] font-bold bg-error/15 text-error px-2 py-0.5 rounded-full">
                  {t('hospitals.out_of_network', 'Out of Network')}
                </span>
              )}
              {h.acceptsInsurance === null && (
                <span className="text-[10px] font-bold bg-surface-container-high text-on-surface-variant/70 px-2 py-0.5 rounded-full">
                  {t('hospitals.coverage_unknown', 'Coverage Unknown')}
                </span>
              )}
            </div>

            {/* Name */}
            <p className="text-sm font-bold text-on-surface leading-tight line-clamp-2 mb-1 group-hover:text-primary transition-colors">
              {h.name}
            </p>

            {/* Distance + type */}
            <p className="text-[11px] text-on-surface-variant/70">
              {h.distanceMiles} mi · {h.type}
            </p>

            {/* Rating */}
            {h.rating > 0 && (
              <p className="text-[11px] text-on-surface-variant/60 mt-0.5">
                {'★'.repeat(Math.round(h.rating))} {h.rating}
              </p>
            )}
          </button>
        ))}

        {/* "See all" card */}
        <button
          onClick={handleSeeAll}
          className="flex-shrink-0 w-28 snap-start bg-primary/5 border border-primary/20 rounded-xl p-3 flex flex-col items-center justify-center gap-2 hover:bg-primary/10 transition-all active:scale-[0.97]"
        >
          <span className="material-symbols-outlined text-primary text-2xl">arrow_forward</span>
          <span className="text-xs font-bold text-primary">
            {t('chat.see_all_hospitals', 'See all')}
          </span>
        </button>
      </div>
    </div>
  );
}
