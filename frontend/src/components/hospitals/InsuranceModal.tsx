import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import { getInsuranceProviders, type InsuranceProvider } from '../../services/insuranceService';

interface InsuranceModalProps {
  onClose: () => void;
  onSave: () => void;
}

export default function InsuranceModal({ onClose, onSave }: InsuranceModalProps) {
  const { t } = useTranslation();
  const { insuranceInfo, setInsuranceInfo } = useAppContext();

  const [providers, setProviders] = useState<InsuranceProvider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string>(
    insuranceInfo?.isCustom ? 'other' : insuranceInfo?.provider || ''
  );
  const [selectedPlan, setSelectedPlan] = useState<string>(
    insuranceInfo?.isCustom ? 'other' : insuranceInfo?.planName || ''
  );
  const [customProvider, setCustomProvider] = useState<string>(
    insuranceInfo?.isCustom && insuranceInfo.provider ? insuranceInfo.provider : ''
  );
  const [customPlan, setCustomPlan] = useState<string>(
    insuranceInfo?.isCustom && insuranceInfo.planName ? insuranceInfo.planName : ''
  );

  useEffect(() => {
    let mounted = true;
    getInsuranceProviders().then((data) => {
      if (mounted) setProviders(data);
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  const handleSave = () => {
    if (selectedProvider === 'none') {
      setInsuranceInfo(null);
      onSave();
      return;
    }
    const isCustom = selectedProvider === 'other' || selectedPlan === 'other';
    const finalProvider = selectedProvider === 'other' ? customProvider : selectedProvider;
    const finalPlan = selectedPlan === 'other' ? customPlan : selectedPlan;

    if (!finalProvider) return;

    setInsuranceInfo({
      provider: finalProvider,
      planName: finalPlan,
      isCustom,
    });
    onSave(); // Triggers the re-search
  };

  const availablePlans = selectedProvider !== 'other' 
    ? providers.find((p) => p.name === selectedProvider)?.plans || [] 
    : [];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-scrim/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest rounded-3xl w-full max-w-lg shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-outline-variant/20">
          <h2 className="text-xl font-headline font-bold text-on-surface">
            {t('hospitals.modal_title')}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-surface-container transition-colors text-on-surface-variant">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          <div>
            <label className="block text-sm font-bold text-on-surface-variant mb-2">
              {t('onboarding.insurance_provider_label')}
            </label>
            <div className="relative">
              <select
                value={selectedProvider}
                onChange={(e) => {
                  setSelectedProvider(e.target.value);
                  setSelectedPlan('');
                }}
                className="w-full p-4 rounded-xl border border-outline-variant/30 bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none text-on-surface"
              >
                <option value="" disabled>{t('onboarding.insurance_provider_placeholder')}</option>
                <option value="none">{t('onboarding.insurance_none') || 'None'}</option>
                {providers.map((p) => (
                  <option key={p.name} value={p.name}>{p.name}</option>
                ))}
                <option value="other">{t('onboarding.insurance_other_provider') || 'Enter your provider'}</option>
              </select>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">expand_more</span>
            </div>
          </div>

          {selectedProvider === 'other' && (
            <div>
              <input
                type="text"
                placeholder={t('onboarding.insurance_custom_provider')}
                value={customProvider}
                onChange={(e) => setCustomProvider(e.target.value)}
                className="w-full p-4 rounded-xl border border-outline-variant/30 bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20 text-on-surface"
              />
            </div>
          )}

          {(availablePlans.length > 0 || selectedProvider === 'other') && (
            <div>
              <label className="block text-sm font-bold text-on-surface-variant mb-2">
                {t('onboarding.insurance_plan_label')}
              </label>
              <div className="relative">
                <select
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                  className="w-full p-4 rounded-xl border border-outline-variant/30 bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none text-on-surface"
                >
                  <option value="">{t('onboarding.insurance_plan_placeholder')}</option>
                  {availablePlans.map((plan) => (
                    <option key={plan} value={plan}>{plan}</option>
                  ))}
                  <option value="other">{t('onboarding.insurance_other_plan') || 'Enter your plan'}</option>
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">expand_more</span>
              </div>
            </div>
          )}

          {selectedPlan === 'other' && (
            <div>
              <input
                type="text"
                placeholder={t('onboarding.insurance_custom_plan')}
                value={customPlan}
                onChange={(e) => setCustomPlan(e.target.value)}
                className="w-full p-4 rounded-xl border border-outline-variant/30 bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20 text-on-surface"
              />
            </div>
          )}
        </div>

        <div className="p-6 border-t border-outline-variant/20 flex gap-4 bg-surface-container-low rounded-b-3xl">
          <button
            onClick={onClose}
            className="flex-1 py-4 font-bold text-secondary bg-surface rounded-xl hover:bg-surface-bright transition-colors border border-outline-variant/20"
          >
            {t('hospitals.modal_cancel')}
          </button>
          <button
            onClick={handleSave}
            disabled={!selectedProvider || (selectedProvider === 'other' && !customProvider)}
            className="flex-1 py-4 font-bold text-white bg-primary rounded-xl hover:bg-primary-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
          >
            {t('hospitals.modal_save')}
          </button>
        </div>
      </div>
    </div>
  );
}
