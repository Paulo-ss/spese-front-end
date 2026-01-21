interface IArgs {
  value: string | number;
  toFixed?: number;
  setFieldValue?: (formattedValue: number) => void;
  returnValue?: boolean;
}

export const formatDecimalNumber = ({
  value,
  toFixed = 2,
  setFieldValue,
  returnValue = false,
}: IArgs) => {
  const noCommaValue = Number(String(value).replace(",", "."));
  const fixedValue = noCommaValue.toFixed(toFixed);
  const finalValue = isNaN(Number(fixedValue)) ? 0 : Number(fixedValue);

  if (setFieldValue) {
    setFieldValue(Number(finalValue));
  }

  if (returnValue) {
    return fixedValue;
  }
};
