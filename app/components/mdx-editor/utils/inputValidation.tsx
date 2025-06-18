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

export const createMask = (format) => {
  const placeholders = {
    '%d': '__',
    '%m': '__',
    '%y': '__',
    '%Y': '____',
    '%H': '__',
    '%M': '__',
    '%S': '__',
  };

  const escapeNonWord = (ch) => (/\w/.test(ch) ? ch : ` ${ch} `); // pad delimiters with spaces

  let mask = '';

  for (let i = 0; i < format.length; i++) {
    if (format[i] === '%' && i < format.length - 1) {
      const directive = format.slice(i, i + 2); // e.g. "%m"
      mask += placeholders[directive] ?? '__'; // unknown → two underscores
      i++; // skip directive's second char
    } else {
      mask += escapeNonWord(format[i]);
    }
  }

  return mask.replace(/\s{2,}/g, ' '); // collapse double spaces, if any
};

export const dateFormatValidation = (format, input) => {
  const regexToTest = dateStringToregex(format);

  //return false no errors if regex passes, return true there are erros if fails
  return regexToTest.test(input) ? false : true;
};

export const handleChartDateValidation = (
  propName,
  draftDateFormats,
  setDateErrors,
  dateErrors,
  draft,
  onChange,
  chartProps,
) => {

  if (propName === 'highlightStart' || propName === 'highlightEnd') {
    if (dateFormatValidation(draftDateFormats.draftDateFormat, draft) === false) {
      console.log('inside falsey check');
      setDateErrors({
        highlightStart: dateFormatValidation(
          draftDateFormats.draftDateFormat,
          draftDateFormats.draftHighlightStart,
        ),
        highlightEnd: dateFormatValidation(
          draftDateFormats.draftDateFormat,
          draftDateFormats.draftHighlightEnd,
        ),
      });
      if (
        dateErrors.highlightStart == false &&
        dateErrors.highlightEnd == false
      ) {
        console.log(' HIGHLIGHT CHECK onchagen called');
        onChange({
          ...chartProps,
          dateFormat: draftDateFormats.draftDateFormat,
          highlightStart: draftDateFormats.draftHighlightStart,
          highlightEnd: draftDateFormats.draftHighlightEnd,
        });
      }
    } else {
      console.log('There is an error');
      setDateErrors({
        highlightStart: dateFormatValidation(
          draftDateFormats.draftDateFormat,
          draftDateFormats.draftHighlightStart,
        ),
        highlightEnd: dateFormatValidation(
          draftDateFormats.draftDateFormat,
          draftDateFormats.draftHighlightEnd,
        ),
      });
    }
  } else if (propName === 'dateFormat') {
    setDateErrors({
      highlightStart: dateFormatValidation(draft, chartProps.highlightStart),
      highlightEnd: dateFormatValidation(draft, chartProps.highlightEnd),
    });
  } else if (
    dateErrors.highlightStart == false &&
    dateErrors.highlightEnd == false
  ) {
    console.log('onchagen called');
    onChange({
      ...chartProps,
      dateFormat: draftDateFormats.draftDateFormat,
      highlightStart: draftDateFormats.draftHighlightStart,
      highlightEnd: draftDateFormats.draftHighlightEnd,
    });
  }
};
