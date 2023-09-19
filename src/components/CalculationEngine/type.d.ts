declare interface CalculationEngineErrorMessage {
  errorType: CALCULATION_ERROR_TYPE;
}

declare interface CalculationEngineInvalidDataErrorMessage
  extends CalculationEngineErrorMessage {
  lineNumber: number;
}

declare interface CalculationEngineDuplicatedDataErrorMessage
  extends CalculationEngineErrorMessage {
  addressToLineNumbersMap: { [key: string]: number[] };
}
