import { type FC } from 'react';
import { ScopeOption, type OrderOffensive, type OrderTeamSize } from '@interfaces/order';
import { formatReverseDate } from '@utils/helper';
import { IconTextPairs } from '@/app/views/components/utils/IconTextPairs';
import { BugIcon } from '@icons';
import '../ordercards.scss';
import { OrderCardTemplate } from '@/app/views/components/order-card-template/OrderCardTemplate';
import useOrderScopeStore from '@stores/orderScope.store';

export interface ConfirmOrderCardProps {
  sizeOrder: OrderTeamSize | 'small' | 'medium' | 'full';
  offensive: OrderOffensive | 'careful' | 'offensive' | 'adversary';
  type: string;
  provider: string;
  scope: ScopeOption | 0 | 1;
  distributor: string;
  price: string;
  finishDate: string;
  handleActivate: (id: string) => void;
  id: string;
  isSelected?: boolean;
  resourcesScope: any;
  companyName: string;
}

export const FinishOrderCard: FC<ConfirmOrderCardProps> = ({
  sizeOrder,
  offensive,
  type,
  provider,
  scope,
  distributor,
  price,
  id,
  isSelected,
  handleActivate,
  finishDate,
  resourcesScope,
  companyName,
}) => {
  const { updateOpen, updateScope, updateViewConfirm } = useOrderScopeStore();
  const resources = `all ${scope == ScopeOption.ALL ? 'company' : type} resources`;
  const handleOpenScope = () => {
    updateOpen(true);
    updateScope(resourcesScope);
    updateViewConfirm(false);
  };
  return (
    <OrderCardTemplate
      id={id}
      handleActivate={handleActivate}
      isSelected={Boolean(isSelected)}
      offensive={offensive}
      companyName={companyName}
      price={price}
      provider={provider}
      sizeOrder={sizeOrder}
      state="Finished"
      type={type}
      viewPrice
      viewScope={
        <IconTextPairs icon={<BugIcon className="codefend-text-red" />} className="icon-text">
          <span className="text-bold">Resources:</span>
          <span className="text-light border">{resources}</span>
          <span className="codefend-text-red all-scope" onClick={handleOpenScope}>
            view scope
          </span>
        </IconTextPairs>
      }>
      <div className="provider-order-main-content flex-col">
        <div className="order-price-dist expand">
          <span className="current-extend">Finish date {formatReverseDate(finishDate)}</span>

          <span className="current-extend">Distributor: {distributor}</span>
        </div>
      </div>
    </OrderCardTemplate>
  );
};
