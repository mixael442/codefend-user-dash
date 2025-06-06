import { useFetcher } from '#commonHooks/useFetcher';
import { useUserData } from '#commonUserHooks/useUserData';
import { MODAL_KEY_OPEN, TABLE_KEYS } from '@/app/constants/app-texts';
import { APP_MESSAGE_TOAST, SCAN_PAGE_TEXT, WEB_PANEL_TEXT } from '@/app/constants/app-toast-texts';
import { apiErrorValidation, companyIdIsNull } from '@/app/constants/validations';
import { SearchBar } from '@/app/views/components/SearchBar/SearchBar';
import { SimpleSection } from '@/app/views/components/SimpleSection/SimpleSection';
import { useVerifyScanList } from '#commonHooks/useVerifyScanList';
import { KnifeIcon, ScanSearchIcon, StatIcon, TrashIcon, XCircleIcon } from '@icons';
import type { ColumnTableV3 } from '@interfaces/table';
import { verifyDomainName } from '@resourcesHooks/web/useAddWebResources';
import type { useWelcomeStore } from '@stores/useWelcomeStore';
import Tablev3 from '@table/v3/Tablev3';
import { useState, type ChangeEvent } from 'react';
import { toast } from 'react-toastify';
import css from './scanSection.module.scss';
import { ConfirmModal, ModalTitleWrapper } from '@modals/index';
import useModalStore from '@stores/modal.store';
import { ScanStepType } from '@/app/constants/welcome-steps';
import { useGlobalFastField } from '@/app/views/context/AppContextProvider';
import { useAutoScan } from '@panelHooks/useAutoScan';

const scansColumns: ColumnTableV3[] = [
  {
    header: 'ID',
    key: 'id',
    styles: 'item-cell-1.1',
    weight: '3%',
    render: val => val,
  },
  {
    header: 'Resource ID',
    key: 'resource_id',
    styles: 'item-cell-2',
    weight: '3%',
    render: val => val,
  },

  {
    header: 'Domain',
    key: 'resource_address',
    styles: 'item-cell-2',
    weight: '7%',
    render: val => val,
  },
  {
    header: 'USER-ID',
    key: 'user_id',
    styles: 'item-cell-2',
    weight: '3%',
    render: val => val,
  },
  {
    header: 'Email',
    key: 'user_email',
    styles: 'item-cell-2',
    weight: '7.5%',
    render: val => val,
  },
  {
    header: 'Phase',
    key: 'phase',
    styles: 'item-cell-3',
    weight: '5%',
    render: val => val,
  },
  {
    header: 'Found/Parsed',
    key: 'issues_found',
    type: TABLE_KEYS.FULL_ROW,
    styles: 'item-cell-4',
    weight: '6%',
    render: val => `${val?.issues_found} / ${val?.issues_parsed}`,
  },
  {
    header: 'Proccess-UUID',
    key: 'process_uuid',
    styles: 'item-cell-5',
    weight: '12%',
    render: val => val,
  },
  {
    header: 'Scan PID',
    key: 'scanner_pid',
    styles: 'item-cell-6',
    weight: '5%',
    render: val => val,
  },
  {
    header: 'Version',
    key: 'scanner_version',
    styles: 'item-cell-7',
    weight: '4%',
    render: val => val,
  },
  {
    header: 'LLM',
    key: 'llm_provider',
    styles: 'item-cell-8',
    weight: '4%',
    render: val => val,
  },
  {
    header: 'LLM-Balance-Inicial',
    key: 'llm_balance_inicial',
    styles: 'item-cell-9',
    weight: '5%',
    render: val => val,
  },
  {
    header: 'LLM-Balance-Final',
    key: 'llm_balance_final',
    styles: 'item-cell-10',
    weight: '5%',
    render: val => val,
  },
  {
    header: 'Demora',
    key: 'demora',
    styles: 'item-cell-11',
    weight: '5.5%',
    render: val => (val ? val : '---'),
  },
  {
    header: 'Demora Scan',
    key: 'demora_scanner',
    styles: 'item-cell-12',
    weight: '5.5%',
    render: val => (val ? val : '---'),
  },
  {
    header: 'Demora Parser',
    key: 'demora_parser',
    styles: 'item-cell-13',
    weight: '5.5%',
    render: val => (val ? val : '---'),
  },
  {
    header: 'Started',
    key: 'creacion',
    styles: 'item-cell-14',
    weight: '6%',
    render: val => (val ? val : ''),
  },
  {
    header: 'Finished',
    key: 'finalizacion',
    styles: 'item-cell-15',
    weight: '6%',
    render: val => (val ? val : '--/--/--'),
  },
];

export const ScanSection = () => {
  const [domainScanned, setDomainScanned] = useState<string>('');
  const [fetcher] = useFetcher();
  const { autoScan } = useAutoScan();
  const { getCompany } = useUserData();
  const { scans } = useVerifyScanList();
  const { setIsOpen, setModalId, isOpen, modalId } = useModalStore();
  const [selectScan, setSelectScan] = useState<any>(null);
  const company = useGlobalFastField('company');

  const killScan = () => {
    const neuroscan_id = selectScan.id;
    if (!neuroscan_id) {
      setIsOpen(false);
      toast.error(SCAN_PAGE_TEXT.SCAN_KILL_NO_SELECTED);
      return;
    }
    fetcher('post', {
      body: {
        neuroscan_id,
        company_id: getCompany(),
      },
      path: 'modules/neuroscan/kill',
      requireSession: true,
    }).then(() => {
      toast.success(SCAN_PAGE_TEXT.SCAN_KILLED_SUCCESS);
      setIsOpen(false);
    });
  };

  const startKillScan = (row: any) => {
    if (row?.phase === ScanStepType.Killed || row?.phase === ScanStepType.Finished) {
      return;
    }
    setIsOpen(true);
    setModalId(MODAL_KEY_OPEN.START_KILL_SCAN);
    setSelectScan(row);
  };

  const scansColumnAction = [
    ...scansColumns,
    {
      header: '',
      key: TABLE_KEYS.ACTION,
      type: TABLE_KEYS.FULL_ROW,
      styles: `item-cell-16 action ${css['disabled-btn']}`,
      weight: '2%',
      render: (row: any) => (
        <div className="publish" key={`actr-${row.id}`}>
          <span
            title="Kill process"
            aria-disabled={
              row?.phase === ScanStepType.Killed || row?.phase === ScanStepType.Finished
            }
            className={
              row?.phase === ScanStepType.Killed || row?.phase === ScanStepType.Finished
                ? 'disabled-this'
                : ''
            }
            onClick={() => startKillScan(row)}>
            <XCircleIcon />
          </span>
        </div>
      ),
    },
  ];

  const startAndAddedDomain = () => {
    if (verifyDomainName(domainScanned || '')) return;
    const companyID = getCompany();
    if (companyIdIsNull(companyID)) return;
    const toastId = toast.loading(WEB_PANEL_TEXT.VERIFY_DOMAIN, {
      closeOnClick: true,
    });
    fetcher<any>('post', {
      body: {
        company_id: companyID,
        resource_address_domain: domainScanned || '',
        subdomain_scan: 'no',
      },
      path: 'resources/web/add',
      timeout: 180000,
    })
      .then(({ data }) => {
        toast.dismiss(toastId);
        const resourceId = data?.resource?.id;
        if (resourceId) {
          if (data?.company) company.set(data.company);
          autoScan(resourceId, false).then(result => {
            if (result?.neuroscan?.id) {
              toast.success(APP_MESSAGE_TOAST.START_SCAN);
            }
          });
        } else {
          throw new Error(data?.info || APP_MESSAGE_TOAST.API_UNEXPECTED_ERROR);
        }
      })
      .catch((error: any) => {
        toast.error(error?.info || error?.message || '');
      });
  };

  return (
    <div className={css['scan-section-container']}>
      <ModalTitleWrapper
        isActive={isOpen && modalId === MODAL_KEY_OPEN.START_KILL_SCAN}
        close={() => setIsOpen(false)}
        type="med-w"
        headerTitle="Confirm Kill Scan">
        <ConfirmModal
          confirmText="Confirm"
          cancelText="Cancel"
          header="Are you sure you want to kill this automatic analysis process?"
          action={killScan}
          close={() => setIsOpen(false)}
        />
      </ModalTitleWrapper>
      <div className={css['scan-search-box']}>
        <SearchBar
          handleChange={(e: ChangeEvent<HTMLInputElement>) => setDomainScanned(e.target.value)}
          placeHolder="Search"
          inputValue={domainScanned}
          handleSubmit={startAndAddedDomain}
          searchIcon={<ScanSearchIcon isButton />}
        />
        <div className={css['scan-search-box-info']}>
          <span>Disponibles</span>
          <span>{company.get.disponibles_neuroscan}</span>
        </div>
      </div>
      <div className="card">
        <SimpleSection header="Company Scanners" icon={<StatIcon />}>
          <div className="content">
            <Tablev3 rows={scans} columns={scansColumnAction} showRows={true} />
          </div>
        </SimpleSection>
      </div>
    </div>
  );
};
