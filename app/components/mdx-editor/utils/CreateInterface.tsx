'use client';

import React, { useEffect, useState } from 'react';
import {
  TextInput,
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
  onChange: (value: any) => void;
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
  validateAgainst?: string;
}

const checkRequired = (isRequired, value) => {
  return isRequired && !value ? { validationStatus: 'error' } : '';
};

const colorSchemes = [
  'Blues', 'Greens', 'Greys', 'Oranges', 'Purples', 'Reds',
  'Turbo', 'Viridis', 'Inferno', 'Magma', 'Plasma', 'Cividis',
  'Warm', 'Cool', 'CubehelixDefault',
];

export const InputField: React.FC<FieldProps> = (props) => {
  const {
    value,
    fieldName,
    hint,
    onChange,
    isRequired,
    type,
    componentProps,
    propName,
    placeHolder,
    draftInputs,
    setDraftInputs,
    inputErrors,
    setInputErrors,
    validateAgainst,
    customClass,
  } = props;

  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const handleBlur = () => {
    if (validateAgainst) {
      if (["dateFormat", "highlightStart", "highlightEnd"].includes(propName)) {
        handleChartDateValidation(
          propName,
          draftInputs,
          setInputErrors,
          inputErrors,
          draft,
          onChange,
          componentProps
        );
      } else if (validateAgainst === 'defaultDateFormat') {
        handleMapDateValidation(
          propName,
          draftInputs,
          inputErrors,
          setInputErrors,
          draft,
          onChange,
          componentProps
        );
      } else if (validateAgainst === 'centerFormat') {
        handleMapArrayValidation(
          propName,
          draftInputs,
          inputErrors,
          setInputErrors,
          draft,
          onChange,
          componentProps
        );
      } else {
        onChange({ ...componentProps, [propName]: draft });
      }
    } else {
      onChange({ ...componentProps, [propName]: draft });
    }
  };

  const cleanedType = type?.toLowerCase();

  const commonProps = {
    id: fieldName,
    name: fieldName,
    value: draft,
    onChange: (e) => setDraft(e.target.value),
    onBlur: handleBlur,
    placeholder: placeHolder,
    ...checkRequired(isRequired, draft),
    validationStatus: validateAgainst && inputErrors?.[propName] ? 'error' : undefined,
  };

  return (
    <div key={propName} className={customClass}>
      <Label htmlFor={fieldName} className='margin-top-2'>{fieldName}</Label>
      {hint && <span className='usa-hint'>{hint}</span>}

      {cleanedType === 'area' ? (
        <Textarea {...commonProps} />
      ) : cleanedType === 'select' ? (
        <Select {...commonProps}>
          {colorSchemes.map((scheme) => (
            <option key={scheme} value={scheme}>{scheme}</option>
          ))}
        </Select>
      ) : cleanedType === 'checkbox' ? (
        <Checkbox
          id={fieldName}
          name={fieldName}
          label={fieldName}
          checked={draft === 'true'}
          onChange={(e) => setDraft(e.target.checked ? 'true' : 'false')}
          onBlur={handleBlur}
        />
      ) : cleanedType === 'date' ? (
        <DatePicker
          defaultValue={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={handleBlur}
          {...checkRequired(isRequired, draft)}
        />
      ) : (
        <TextInput {...commonProps} />
      )}
    </div>
  );
};
