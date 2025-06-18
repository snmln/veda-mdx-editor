'use client';

import React, { useEffect, useRef, useState } from 'react';

import {
  TextInput,
  TextInputMask,
  Textarea,
  Label,
  DatePicker,
  Checkbox,
  Select,
} from '@trussworks/react-uswds';
import {
  createMask,
  dateFormatValidation,
  dateStringToregex,
  handleChartDateValidation,
} from './inputValidation';

interface FieldProps {
  fieldName: string;
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
  customClass?: string;
  placeHolder?: string;
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

const setInput = (props) => {
  const {
    value,
    isRequired,
    type,
    fieldName,
    hint,
    onChange,
    chartProps,
    propName,
    placeHolder,
    validateAgainst,
    draftDateFormats,
    setDraftDateFormats,
    dateErrors,
    setDateErrors,
  } = props;
  const cleanedType = type !== undefined && type.toLowerCase();

  const [draft, setDraft] = useState(value);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (
      propName === 'dateFormat' &&
      draft != draftDateFormats.draftDateFormat
    ) {
      setDraftDateFormats({ ...draftDateFormats, draftDateFormat: draft });
    }
    if (
      propName === 'highlightStart' &&
      draft != draftDateFormats.draftHighlightStart
    ) {
      setDraftDateFormats({ ...draftDateFormats, draftHighlightStart: draft });
    }
    if (
      propName === 'highlightEnd' &&
      draft != draftDateFormats.draftHighlightEnd
    ) {
      setDraftDateFormats({ ...draftDateFormats, draftHighlightEnd: draft });
    }
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (validateAgainst) {
        if (
          propName === 'dateFormat' ||
          propName === 'highlightStart' ||
          propName === 'highlightEnd'
        ) {
          handleChartDateValidation(
            propName,
            draftDateFormats,
            setDateErrors,
            dateErrors,
            draft,
            onChange,
            chartProps,
          );
        } else {
          onChange({ ...chartProps, [propName]: draft });
        }
      }
    }, 400);

    return () => clearTimeout(timeoutRef.current);
  }, [draft, draftDateFormats]);

  //Format date and submitted dates need to work or else the chart will throw an error.

  switch (cleanedType) {
    case 'date':
      return (
        //CHORE: Need to clean up or delete
        <>
          <Label htmlFor='input-type-text' className='margin-top-2'>
            {fieldName}
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
          id={fieldName}
          name='checkbox'
          label={fieldName}
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
            {fieldName}
          </Label>
          <span className='usa-hint'>{hint}</span>
          <Select
            id={fieldName}
            name={fieldName}
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
    case 'area':
      return (
        <>
          <Label htmlFor='input-type-text' className='margin-top-2'>
            {fieldName}
          </Label>
          <span className='usa-hint'>{hint}</span>
          <Textarea
            id='input-type-text'
            name='input-type-text'
            value={value}
            onChange={(e) => {
              onChange({ ...chartProps, [propName]: e.target.value });
            }}
            className=''
            {...checkRequired(isRequired, value)}
          />
        </>
      );
      break;
    default:
      return (
        <>
          <Label htmlFor='input-type-text' className='margin-top-2'>
            {fieldName}
          </Label>

          <span className='usa-hint'>{hint}</span>
          <TextInput
            id='input-type-text'
            name='input-type-text'
            type='text'
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={placeHolder}
            {...checkRequired(isRequired, value)}
            validationStatus={dateErrors[propName] ? 'error' : undefined}
          />
        </>
      );
  }
};
export const InputField: React.FC<FieldProps> = (props) => {
  const { propName, customClass } = props;

  return (
    <div key={propName} className={customClass}>
      {setInput(props)}
    </div>
  );
};
