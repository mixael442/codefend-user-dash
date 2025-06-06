import { useScanProgress } from '@hooks/useScanProgress';
import { useWelcomeStore } from '@stores/useWelcomeStore';
import css from './dashscanstart.module.scss';
import { useScanDashboardView } from '@/app/views/pages/panel/layouts/dashboard/components/DashboardScanStart/useScanDashboardView';
import Show from '@/app/views/components/Show/Show';
import Tablev3 from '@table/v3/Tablev3';
import type { ColumnTableV3 } from '@interfaces/table';
import { PrimaryButton } from '@buttons/index';
import { useNavigate } from 'react-router';
import { StatAsset } from '@/app/views/components/stat-asset/StatAsset';

const scanColumns: ColumnTableV3[] = [
  {
    header: 'date',
    key: 'creacion',
    render: val => (val ? val.split(' ')[0] : '--/--/--'),
    styles: 'item-cell-1',
    weight: '35%',
  },
  {
    header: 'domain',
    key: 'resource_address',
    render: (value: any) => value,
    styles: 'item-cell-2',
    weight: '40%',
  },
  {
    header: 'total issues',
    key: 'issues_parsed',
    render: (value: any) => value,
    styles: 'item-cell-3',
    weight: '25%',
  },
];
export const DashboardScanStart = () => {
  const { progress } = useScanProgress();
  const { scanDashboardView, isScanRunning, issueScanFound, issuesParsed, initialDomain } =
    useScanDashboardView();
  const navigate = useNavigate();

  return (
    <div>
      <Show when={isScanRunning}>
        <div className={css['scan-start']}>
          <h2>Escaneo en curso</h2>
          <p>Los escaners automaticos estan analizando uno de sus recursos web: {initialDomain}</p>
          <div className={css['scan-start-progress']}>
            <div className={css[`scan-start-progress-bar`]} style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        <div className={css['scan-start-actions']}>
          <StatAsset value={issueScanFound} valueTitle="Total Findings" />
          <StatAsset value={`${issuesParsed}/${issueScanFound}`} valueTitle="Analisis completado" />
          <StatAsset value={`${Math.round(progress)}%`} valueTitle="Progress" />
        </div>
      </Show>
      <Show when={!isScanRunning}>
        <div className={css['scan-start']}>
          <h2>Escaneo automaticos</h2>
          <p>No hay escaneos en curso</p>
          <Tablev3
            columns={scanColumns}
            rows={scanDashboardView}
            showRows={scanDashboardView.length >= 0}
          />
          <PrimaryButton
            text="View all scans"
            buttonStyle="dark-black"
            click={() => navigate('/scans')}
          />
        </div>
      </Show>
    </div>
  );
};
