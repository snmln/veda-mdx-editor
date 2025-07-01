export const inputValidation = () => {};

export const dateStringToregex = (format) => {
  const tokens = {
    '%d': '(0[1-9]|[12][0-9]|3[01])',
    '%m': '(0[1-9]|1[0-2])',
    '%Y': '\\d{4}',
    '%y': '\\d{2}',
    '%H': '([01][0-9]|2[0-3])',
    '%M': '([0-5][0-9])',
    '%S': '([0-5][0-9])',
  };

  const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  let pattern = '';

  for (let i = 0; i < format.length; i++) {
    if (format[i] === '%' && i < format.length - 1) {
      const directive = format[i] + format[i + 1];
      pattern += tokens[directive] || escape(directive); // unknown: treat literally
      i++; // skip the directive's second char
    } else {
      pattern += escape(format[i]);
    }
  }

  return new RegExp(`^${pattern}$`);
};

export const dateFormatValidation = (format, input) => {
  const regexToTest = dateStringToregex(format);

  //return false no errors if regex passes, return true there are erros if fails
  return regexToTest.test(input) ? false : true;
};

export const handleChartDateValidation = (
  propName,
  draftInputs,
  setInputErrors,
  inputErrors,
  draft,
  onChange,
  chartProps,
) => {
  if (propName === 'highlightStart' || propName === 'highlightEnd') {
    if (dateFormatValidation(draftInputs.draftDateFormat, draft) === false) {
      setInputErrors({
        highlightStart: dateFormatValidation(
          draftInputs.draftDateFormat,
          draftInputs.draftHighlightStart,
        ),
        highlightEnd: dateFormatValidation(
          draftInputs.draftDateFormat,
          draftInputs.draftHighlightEnd,
        ),
      });
      if (
        inputErrors.highlightStart == false &&
        inputErrors.highlightEnd == false
      ) {
        onChange({
          ...chartProps,
          dateFormat: draftInputs.draftDateFormat,
          highlightStart: draftInputs.draftHighlightStart,
          highlightEnd: draftInputs.draftHighlightEnd,
        });
      }
    } else {
      setInputErrors({
        highlightStart: dateFormatValidation(
          draftInputs.draftDateFormat,
          draftInputs.draftHighlightStart,
        ),
        highlightEnd: dateFormatValidation(
          draftInputs.draftDateFormat,
          draftInputs.draftHighlightEnd,
        ),
      });
    }
  } else if (propName === 'dateFormat') {
    setInputErrors({
      highlightStart: dateFormatValidation(draft, chartProps.highlightStart),
      highlightEnd: dateFormatValidation(draft, chartProps.highlightEnd),
    });
  } else if (
    inputErrors.highlightStart == false &&
    inputErrors.highlightEnd == false
  ) {
    onChange({
      ...chartProps,
      dateFormat: draftInputs.draftDateFormat,
      highlightStart: draftInputs.draftHighlightStart,
      highlightEnd: draftInputs.draftHighlightEnd,
    });
  }
};
export const handleMapDateValidation = (
  propName,
  draftInputs,
  inputErrors,
  setInputErrors,
  draft,
  onChange,
  componentProps,
) => {
  if (
    dateFormatValidation(draftInputs.defaultDateFormat, draft) === false ||
    draft === ''
  ) {
    setInputErrors({ ...inputErrors, [propName]: false });
    onChange({ ...componentProps, [propName]: draft });
  } else {
    setInputErrors({ ...inputErrors, [propName]: true });
  }
};

export const handleMapArrayValidation = (
  propName,
  draftInputs,
  inputErrors,
  setInputErrors,
  draft,
  onChange,
  componentProps,
) => {
  const numberPattern =
    /^\[[+-]?(0|[1-9][0-9]*)(\.[0-9]+)?(?:,\s*[+-]?(0|[1-9][0-9]*)(\.[0-9]+)?)*\]$/;
  //This regex checks that the input is wrapped in [...]
  //Checks for no trailing decimal points ex: -91.
  //Checks that there is no leading 0 unless followed by a . ex 0.12 or 0 are acceptable
  const cleanedDraft = draft.replace(/\s/g, '');
  if (numberPattern.test(cleanedDraft)) {
    const parsedValues = JSON.parse(cleanedDraft);
    const checkLong = (long) => (long <= 180 && long >= -180 ? true : false);
    const checkLat = (lat) => (lat <= 90 && lat >= -90 ? true : false);
    //validating upper and lower limits of long and lat
    if (checkLong(parsedValues[0]) && checkLat(parsedValues[1])) {
      setInputErrors({ ...inputErrors, [propName]: false });
      onChange({ ...componentProps, [propName]: draft });
    } else {
      setInputErrors({ ...inputErrors, [propName]: true });
    }
  } else {
    setInputErrors({ ...inputErrors, [propName]: true });
  }
};
