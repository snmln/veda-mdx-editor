'use client';

import React from 'react';

import {
  TextInput,
  Label,
  DatePicker,
  Checkbox,
} from '@trussworks/react-uswds';

interface FieldProps {
  label: string;
  value: string;
  hint?: string;
  //   onChange: (value: string) => void;
  isRequired?: boolean;
  isDate?: boolean;
  numeric?: boolean;
  onBlur?: (value: string) => void;
  onFocus?: (value: string) => void;
  type?: string;
}
const checkRequired = (isRequired, value) => {
  return isRequired && !value ? { validationStatus: 'error' } : '';
};

const setInput = (value, isRequired, type, label, hint) => {
  const cleanedType = type !== undefined && type.toLowerCase();
  console.log('setInput', value);
  switch (cleanedType) {
    case 'date':
      return (
        <>
          <Label htmlFor='input-type-text' className='margin-top-2'>
            {label}
          </Label>
          <span className='usa-hint'>{hint}</span>
          <DatePicker
            defaultValue={value}
            //   onChange={(e) => onChange(e)}
            {...checkRequired(isRequired, value)}
          />
        </>
      );

      break;
    case 'checkbox':
      return <Checkbox id={label} name='checkbox' label={label} />;
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
            //   onChange={(e) => onChange(e.target.value)}
            className=''
            {...checkRequired(isRequired, value)}
          />
        </>
      );
  }
};
export const MapField: React.FC<FieldProps> = (props) => {
  const { label, hint, value, onChange, isRequired, type } = props;
  console.log('MapField', value);
  return <div>{setInput(value, isRequired, type, label, hint)}</div>;
};
