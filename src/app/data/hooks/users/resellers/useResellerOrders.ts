import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useRef } from 'react';
import { useUserData } from '#commonUserHooks/useUserData';
import type { FullOrder } from '@interfaces/order';
import { apiErrorValidation, companyIdIsNull } from '@/app/constants/validations';
import { verifySession } from '@/app/constants/validations';

export const useResellerOrders = () => {
  const [fetcher, _, isLoading] = useFetcher();
  const { getCompany, logout } = useUserData();
  const orders = useRef<FullOrder[]>([]);

  const getResellerOrders = () => {
    const companyID = getCompany();
    if (companyIdIsNull(companyID)) return;
    fetcher('post', {
      body: {
        company_id: getCompany(),
      },
      path: 'resellers/dashboard/orders',
    }).then(({ data }: any) => {
      if (verifySession(data, logout)) return;
      if (apiErrorValidation(data?.error, data?.response)) {
        throw new Error('An error has occurred on the server');
      }
      orders.current = data.orders ? data.orders : [];
    });
  };

  return [orders, { getResellerOrders, isLoading }] as const;
};
