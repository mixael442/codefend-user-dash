import { useFetcher } from '#commonHooks/useFetcher';
import { useUserData } from '#commonUserHooks/useUserData';
import { TABLE_KEYS } from '@/app/constants/app-texts';
import { apiErrorValidation, companyIdIsNull, verifySession } from '@/app/constants/validations';
import { ModalWrapper } from '@modals/index';
import Tablev3 from '@table/v3/Tablev3';
import { useEffect, useRef, useState } from 'react';
import css from './welcomedomain.module.scss';
import { SearchIcon } from '@icons';
import { useWelcomeStore } from '@stores/useWelcomeStore';
import TextChild from '@/app/views/components/utils/TextChild';
import { LocationItem } from '@/app/views/components/utils/LocationItem';
import { toast } from 'react-toastify';
import { APP_MESSAGE_TOAST } from '@/app/constants/app-toast-texts';
import { PrimaryButton } from '@buttons/index';

const columns = [
  {
    header: 'domain',
    key: 'resource_domain',
    type: TABLE_KEYS.FULL_WITH_NEXT,
    styles: 'item-cell-2 item-domain-cell',
    weight: '43%',
    render: (row: any, next?: any) =>
      !row?.address_domain ? (
        row?.resource_domain
      ) : (
        <TextChild
          subNetwork={row?.address_domain}
          isLast={!next || (next && !next?.address_domain)}
        />
      ),
  },
  {
    header: 'server ip',
    key: 'main_server',
    styles: 'item-cell-3',
    weight: '28%',
    render: (ip: any) => (ip === 'unreachable' ? 'non available' : ip),
  },
  {
    header: 'area',
    key: 'main_server_area_name',
    type: TABLE_KEYS.FULL_ROW,
    styles: 'item-cell-4',
    weight: '29%',
    render: (row: any) => (
      <LocationItem
        country={row?.main_server_area_name || 'non available'}
        countryCode={row?.main_server_area_code || ''}
      />
    ),
  },
];

export const WelcomeDomain = ({
  close,
  startScan,
}: {
  close: () => void;
  startScan: () => void;
}) => {
  const [initialDomain, setInitialDomain] = useState('');
  const [domains, setDomains] = useState<any[]>([]);
  const [fetcher, _, isLoading] = useFetcher();
  const { getCompany, logout } = useUserData();
  const { saveInitialDomain, setDomainId, initialDomain: initDomain } = useWelcomeStore();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInitialDomain(prev => (!prev ? initDomain : prev));
    const companyID = getCompany();
    fetcher('post', {
      requireSession: true,
      body: {
        company_id: companyID,
        resource_address_domain: initialDomain || initDomain,
        subdomain_scan: 'yes',
      },
      path: 'resources/web/preview',
      timeout: 180000,
    }).then(({ data }: any) => {
      if (verifySession(data, logout)) return;
      if (apiErrorValidation(data?.error, data?.response)) {
        toast.error(data?.info || APP_MESSAGE_TOAST.API_UNEXPECTED_ERROR);
      } else {
        setDomains(data?.resource ? [data.resource] : []);
      }
    });
  }, [initialDomain]);

  const changeInitialDomain = () => {
    const input = inputRef.current;
    if (!input) return;
    const value = input.value;
    setInitialDomain(prev => (!!value && prev !== value ? value : prev));
  };

  const nextStep = () => {
    const companyID = getCompany();
    if (companyIdIsNull(companyID)) return;
    fetcher('post', {
      body: {
        company_id: companyID,
        resource_address_domain: initialDomain,
        subdomain_scan: 'yes',
      },
      path: 'resources/web/add',
      timeout: 180000,
    }).then(({ data }: any) => {
      if (verifySession(data, logout)) return;
      if (apiErrorValidation(data?.error, data?.response)) {
        toast.error(data?.info || APP_MESSAGE_TOAST.API_UNEXPECTED_ERROR);
      } else {
        saveInitialDomain(initialDomain);
        setDomainId(data?.resource?.id);
        startScan();
      }
    });
  };

  return (
    <ModalWrapper showCloseBtn={false} type={css['welcome-modal-container']}>
      <div>
        <img src="/codefend/brand-iso.png" width={350} height={60} />
        <p className={css['welcome-text']}>
          <b>
            Your account has been created! Please verify your domain and its scope, then click
            'Continue' to add your first resource.
          </b>{' '}
          Next, we’ll run an automated analysis on your main domain.
        </p>
        <div className={css['input-container']}>
          <label htmlFor="initialScope">
            <b>confirm your initial scope</b>
          </label>
          <input
            type="text"
            id="initialScope"
            name="initialScope"
            autoComplete="off"
            placeholder="Wite domain..."
            defaultValue={initialDomain}
            ref={inputRef}
          />
          <button
            type="button"
            className={`btn ${css['btn-search']}`}
            onClick={changeInitialDomain}>
            <SearchIcon isButton />
          </button>
        </div>
        <div className={css['limit-container']}>
          <Tablev3
            columns={columns}
            rows={domains}
            showRows={!!domains && !isLoading}
            limit={7}
            isNeedSort={false}
          />
        </div>
        <div className={css['btn-container']}>
          <PrimaryButton text="close assistant" buttonStyle="gray" click={close} />
          <button className={`btn ${css['btn-add']}`} type="button" onClick={nextStep}>
            Continue
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};
