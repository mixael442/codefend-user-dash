import {
  type ChangeEvent,
  Fragment,
  useCallback,
  type FC,
  type KeyboardEvent,
  type FormEvent,
  type ReactNode,
} from 'react';
import { generateIDArray } from '../../../data';
import Show from '@/app/views/components/Show/Show';
import { PrimaryButton } from '@buttons/index';

interface SearchBarSelect {
  options: any;
  placeHolder: string;
  value: string;
  defaultSelectOption?: any;
  change: (e: ChangeEvent<HTMLSelectElement>) => void;
}

interface SearchBarProps {
  placeHolder: string;
  inputValue: string;
  handleSubmit: () => void;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  searchIcon: ReactNode;

  isActiveSelect?: boolean;
  selectOptions?: SearchBarSelect;
}

export const SearchBar: FC<SearchBarProps> = props => {
  const handleKeyPress = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        props.handleSubmit();
      }
    },
    [props.handleSubmit]
  );

  const options = !props.isActiveSelect || !props.selectOptions ? [] : props.selectOptions.options;

  const optionsKeys = Object.keys(options);

  const optionUUID = optionsKeys.length !== 0 ? generateIDArray(optionsKeys.length) : [];

  const inputClass = !props.isActiveSelect ? 'only-btn' : 'with-select';

  return (
    <div className="search-bar">
      <div className="search-bar-wrapper">
        <form
          onSubmit={(e: FormEvent) => {
            e.preventDefault();
            props.handleSubmit();
          }}
          className="search-bar-wrapper-form">
          <input
            type="text"
            value={props.inputValue}
            onChange={props.handleChange}
            onKeyDown={handleKeyPress}
            placeholder={props.placeHolder}
            className={`text search-input ${inputClass}`}
            required
          />
          <Show when={props.isActiveSelect === true && props.selectOptions !== undefined}>
            <select
              className="search-select log-inputs"
              onChange={props?.selectOptions?.change}
              value={props.selectOptions?.value}>
              {optionsKeys.map((keyOption, i: number) => (
                <Fragment key={optionUUID[i]}>
                  <option value={String(keyOption)}>
                    {String(options[keyOption as keyof typeof options])}
                  </option>
                </Fragment>
              ))}
            </select>
          </Show>
          <PrimaryButton
            text={props.searchIcon}
            click={() => {}}
            type="submit"
            className="search-button no-border-height"
          />
        </form>
      </div>
    </div>
  );
};
