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
  handleMapDateValidation,
  handleMapArrayValidation,
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
  componentProps: any;
  propName: string;
  customClass?: string;
  placeHolder?: string;
  draftInputs?: any;
  inputErrors?: any;
  setDraftInputs?: (value: any) => void;
  setInputErrors?: (value: any) => void;
  options?: string[];
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
    componentProps,
    propName,
    placeHolder,
    validateAgainst,
    draftInputs,
    setDraftInputs,
    inputErrors,
    setInputErrors,
    options,
  } = props;

if (options && Array.isArray(options)) {
    return (
      <>
        <Label htmlFor={propName} className='margin-top-2'>
          {fieldName}
        </Label>
        <span className='usa-hint'>{hint}</span>
        <Select
          id={propName}
          name={propName}
          value={value}
          onChange={(e) =>
            onChange({ ...componentProps, [propName]: e.target.value })
          }
          {...checkRequired(isRequired, value)}
        >
          <option value=''>- Select option -</option>
          {options.map((option) => {
            // Check if option is a string or an object with value/label
            const value = typeof option === 'object' ? option.value : option;
            const label = typeof option === 'object' ? option.label : option;

            return (
              <option key={value} value={value}>
                {label}
              </option>
            );
          })}
        </Select>
      </>
    );
  }

  const cleanedType = type !== undefined && type.toLowerCase();

  const [draft, setDraft] = useState(value);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {

    if (propName === 'dateFormat' && draft != draftInputs.draftDateFormat) {
      setDraftInputs({ ...draftInputs, draftDateFormat: draft });
    }
    if (
      propName === 'highlightStart' &&
      draft != draftInputs.draftHighlightStart
    ) {
      setDraftInputs({ ...draftInputs, draftHighlightStart: draft });
    }
    if (propName === 'highlightEnd' && draft != draftInputs.draftHighlightEnd) {
      setDraftInputs({ ...draftInputs, draftHighlightEnd: draft });
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
            draftInputs,
            setInputErrors,
            inputErrors,
            draft,
            onChange,
            componentProps,
          );
        } else if (validateAgainst === 'defaultDateFormat') {
          handleMapDateValidation(
            propName,
            draftInputs,
            inputErrors,
            setInputErrors,
            draft,
            onChange,
            componentProps,
          );
        } else if (validateAgainst === 'centerFormat') {
          handleMapArrayValidation(
            propName,
            draftInputs,
            inputErrors,
            setInputErrors,
            draft,
            onChange,
            componentProps,
          );
        } else {
          onChange({ ...componentProps, [propName]: draft });
        }
      }
    }, 400);

    return () => clearTimeout(timeoutRef.current);
  }, [draft, draftInputs]);

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
            onChange({ ...componentProps, [propName]: e.target.value })
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
              onChange({ ...componentProps, [propName]: e.target.value })
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
              onChange({ ...componentProps, [propName]: e.target.value });
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
            value={validateAgainst ? draft : value}
            onChange={(e) => {
              if (validateAgainst) {

                setDraft(e.target.value);
              } else {

                onChange({ ...componentProps, [propName]: e.target.value });
              }
            }}
            placeholder={placeHolder}
            {...checkRequired(isRequired, value)}
            validationStatus={
              validateAgainst && (inputErrors[propName] ? 'error' : undefined)
            }
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
