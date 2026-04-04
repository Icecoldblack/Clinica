import { useTranslation } from 'react-i18next';
import { useAppContext, type Filters } from '../../context/AppContext';

export default function FilterPanel() {
  const { t } = useTranslation();
  const { filters, setFilters } = useAppContext();

  const toggle = (key: keyof Filters) => {
    setFilters({ ...filters, [key]: !filters[key] });
  };

  const clearAll = () => {
    setFilters({ noInsurance: false, noDocuments: false, mentalHealth: false });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-headline font-extrabold text-xl tracking-tight text-primary">
          {t('map.filter_title')}
        </h2>
        <button
          onClick={clearAll}
          className="text-xs font-semibold text-secondary hover:underline"
        >
          {t('map.filter_clear')}
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <label className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low cursor-pointer hover:bg-surface-container-high transition-colors">
          <span className="text-sm font-medium">{t('map.filter_no_insurance')}</span>
          <input
            type="checkbox"
            checked={filters.noInsurance}
            onChange={() => toggle('noInsurance')}
            className="rounded-lg text-primary focus:ring-primary border-outline-variant/30 w-5 h-5"
          />
        </label>

        <label className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low cursor-pointer hover:bg-surface-container-high transition-colors">
          <span className="text-sm font-medium">{t('map.filter_no_documents')}</span>
          <input
            type="checkbox"
            checked={filters.noDocuments}
            onChange={() => toggle('noDocuments')}
            className="rounded-lg text-primary focus:ring-primary border-outline-variant/30 w-5 h-5"
          />
        </label>

        <label className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low cursor-pointer hover:bg-surface-container-high transition-colors">
          <span className="text-sm font-medium">{t('map.filter_mental_health')}</span>
          <input
            type="checkbox"
            checked={filters.mentalHealth}
            onChange={() => toggle('mentalHealth')}
            className="rounded-lg text-primary focus:ring-primary border-outline-variant/30 w-5 h-5"
          />
        </label>
      </div>
    </div>
  );
}
