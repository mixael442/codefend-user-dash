import { useCallback, type FC } from 'react';
import { Sort } from '@interfaces/table.ts';
import { TABLE_KEYS } from '@/app/constants/app-texts';
import Show from '@/app/views/components/Show/Show';

interface TableColumnsProps {
  columns: any[];
  sortedColumn: string;
  sort: Sort;
  isNeedMultipleCheck: boolean;
  setSortColumn: (updated: string) => void;
  setSort: (updated: Sort) => void;
  isNeedSort: boolean;
}

const TableColumnsV3: FC<TableColumnsProps> = ({
  sortedColumn,
  sort,
  columns,
  setSort,
  setSortColumn,
  isNeedSort,
}) => {
  const handleSort = useCallback((cn: string, cds: string, cs: Sort) => {
    if (cn === cds) {
      setSort(cs === Sort.asc ? Sort.desc : Sort.asc);
    } else {
      setSortColumn(cn);
      setSort(Sort.asc);
    }
  }, []);
  const onClickColumn = (column: string) => {
    if (column === TABLE_KEYS.ACTION || !isNeedSort) return;
    handleSort(column, sortedColumn, sort);
  };

  return (
    <div className="columns-name">
      {columns.map((column: any, i: number) => (
        <div
          className={`column item-cell ${column.styles} ${!isNeedSort && 'not-sort'}`}
          key={`cv3-${i}`}
          style={{ '--cell-expand': column.weight } as any}
          onClick={() => onClickColumn(column.key)}>
          {column.header}
          <Show when={isNeedSort}>
            {sortedColumn === column.key && (
              <span className="sort">{sort === Sort.asc ? '↑' : '↓'}</span>
            )}
          </Show>
        </div>
      ))}
    </div>
  );
};

export default TableColumnsV3;
