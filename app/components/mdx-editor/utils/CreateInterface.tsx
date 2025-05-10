'use client';

import React from 'react';

import {
  TextInput,
  Label,
  DatePicker,
  Checkbox,
  Select,
} from '@trussworks/react-uswds';

interface FieldProps {
  label: string;
  value: string;
  hint?: string;
  onChange: (value: string) => void;
  isRequired?: boolean;
  isDate?: boolean;
  numeric?: boolean;
  onBlur?: (value: string) => void;
  onFocus?: (value: string) => void;
  type?: string;
  chartProps: any;
  propName: string;
}
const checkRequired = (isRequired, value) => {
  return isRequired && !value ? { validationStatus: 'error' } : '';
};

const colorSchemes = [
  'Blues',
  'Greens',
  'Greys',
  'Oranges',
  'Purples',
  'Reds',
  'Turbo',
  'Viridis',
  'Inferno',
  'Magma',
  'Plasma',
  'Cividis',
  'Warm',
  'Cool',
  'CubehelixDefault',
];

const setInput = (
  value,
  isRequired,
  type,
  label,
  hint,
  onChange,
  chartProps,
  propName,
) => {
  const cleanedType = type !== undefined && type.toLowerCase();

  switch (cleanedType) {
    case 'date':
      return (
        <>
          {console.log('from date', value)}
          <Label htmlFor='input-type-text' className='margin-top-2'>
            {label}
          </Label>
          <span className='usa-hint'>{hint}</span>
          <DatePicker
            defaultValue={value}
            onChange={(e) => console.log('DatePicker', e)}
            {...checkRequired(isRequired, value)}
          />
        </>
      );
      break;
    case 'checkbox':
      return (
        <Checkbox
          id={label}
          name='checkbox'
          label={label}
          onChange={(e) =>
            onChange({ ...chartProps, [propName]: e.target.value })
          }
        />
      );
      break;
    case 'select':
      return (
        <>
          <Label htmlFor='input-type-text' className='margin-top-2'>
            {label}
          </Label>
          <span className='usa-hint'>{hint}</span>
          <Select
            id={label}
            name={label}
            onChange={(e) =>
              onChange({ ...chartProps, [propName]: e.target.value })
            }
          >
            {colorSchemes.map((scheme) => {
              return (
                <option key={scheme} value={scheme}>
                  {scheme}
                </option>
              );
            })}
          </Select>
        </>
      );
      break;
    default:
      return (
        <>
          <Label htmlFor='input-type-text' className='margin-top-2'>
            {label}
          </Label>
          <span className='usa-hint'>{hint}</span>
          <TextInput
            id='input-type-text'
            name='input-type-text'
            // type={numeric ? 'number' : 'text'}
            value={value}
            onChange={(e) => {
              onChange({ ...chartProps, [propName]: e.target.value });
            }}
            className=''
            {...checkRequired(isRequired, value)}
            // {...checkDate(propName, chartProps)}
          />
        </>
      );
  }
};
export const MapField: React.FC<FieldProps> = (props) => {
  const {
    label,
    hint,
    value,
    onChange,
    isRequired,
    type,
    chartProps,
    propName,
  } = props;

  return (
    <div key={propName}>
      {setInput(
        value,
        isRequired,
        type,
        label,
        hint,
        onChange,
        chartProps,
        propName,
      )}
    </div>
  );
};
