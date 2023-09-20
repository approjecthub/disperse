import { useState } from "react";
import TextArea from "../TextArea";
import styles from "./index.module.css";
import {
  CALCULATION_DUPLICATION_ACTION_TYPE,
  CALCULATION_ERROR_TYPE,
} from "./constant";

const CalculationEngine = (): JSX.Element => {
  const [val, setVal] = useState<string>("");
  const [calculationEngineError, setCalculationEngineError] = useState<
    | CalculationEngineInvalidDataErrorMessage
    | CalculationEngineDuplicatedDataErrorMessage
    | null
  >(null);

  const validAddressPattern = /^0x[a-fA-F0-9]{40}$/i;
  const validAmountPattern = /^[0-9]+$/;
  const validAddressAmountSeparatorPattern = /[ ]+|[=,]/g;

  const onChange = (arg: string) => {
    setVal(arg);
    setCalculationEngineError(null);
  };

  const handleValidate = () => {
    const allDatas: string[] = val.split("\n");
    const addressToLineNumberMap: { [key: string]: number[] } = {};

    for (let idx = 0; idx < allDatas.length; idx++) {
      const currentLineDatas = allDatas[idx]?.split(
        validAddressAmountSeparatorPattern
      );

      //validate current line data length
      if (!Array.isArray(currentLineDatas) || currentLineDatas.length !== 2) {
        setCalculationEngineError({
          errorType: CALCULATION_ERROR_TYPE.INVALID_DATA,
          lineNumber: idx + 1,
        });
        return;
      }

      const address = currentLineDatas[0];
      const amount = currentLineDatas[1];

      //validate the address
      if (!validAddressPattern.test(address)) {
        setCalculationEngineError({
          errorType: CALCULATION_ERROR_TYPE.INVALID_DATA,
          lineNumber: idx + 1,
        });
        return;
      }

      //validate the amount
      if (!validAmountPattern.test(amount)) {
        setCalculationEngineError({
          errorType: CALCULATION_ERROR_TYPE.INVALID_DATA,
          lineNumber: idx + 1,
        });
        return;
      }

      if (addressToLineNumberMap[address]) {
        addressToLineNumberMap[address].push(idx + 1);
      }
      if (!addressToLineNumberMap[address]) {
        addressToLineNumberMap[address] = [idx + 1];
      }
    }

    const duplicateAddressErrors: CalculationEngineDuplicatedDataErrorMessage =
      {
        errorType: CALCULATION_ERROR_TYPE.DUPLICATE_DATA,
        addressToLineNumbersMap: {},
      };
    Object.keys(addressToLineNumberMap).forEach((address) => {
      if (addressToLineNumberMap[address].length > 1) {
        duplicateAddressErrors.addressToLineNumbersMap = {
          ...duplicateAddressErrors.addressToLineNumbersMap,
          [address]: addressToLineNumberMap[address],
        };
      }
    });

    if (
      Object.keys(duplicateAddressErrors.addressToLineNumbersMap).length > 0
    ) {
      setCalculationEngineError(duplicateAddressErrors);
    }
  };

  const handleDuplicateErrors = (
    actionType: CALCULATION_DUPLICATION_ACTION_TYPE
  ) => {
    const allDatas: string[] = val.split("\n");
    const addressToAmountMap: { [key: string]: number } = {};

    allDatas.forEach((data) => {
      const currentLineDatas = data.split(validAddressAmountSeparatorPattern);
      const address = currentLineDatas[0];
      const amount = +currentLineDatas[1];

      if (addressToAmountMap[address]) {
        if (actionType === CALCULATION_DUPLICATION_ACTION_TYPE.COMBINE_ALL) {
          addressToAmountMap[address] += amount;
        }
      } else {
        addressToAmountMap[address] = amount;
      }
    });

    setVal(
      Object.keys(addressToAmountMap)
        .map((address) => {
          return `${address} ${addressToAmountMap[address]}`;
        })
        .join("\n")
    );
    setCalculationEngineError(null);
  };

  const getErrorMessgae = () => {
    if (!calculationEngineError) return null;

    if (
      calculationEngineError.errorType === CALCULATION_ERROR_TYPE.INVALID_DATA
    ) {
      return (
        <p>
          {`Line ${
            (calculationEngineError as CalculationEngineInvalidDataErrorMessage)
              .lineNumber
          } wrong amount`}
        </p>
      );
    } else if (
      calculationEngineError.errorType === CALCULATION_ERROR_TYPE.DUPLICATE_DATA
    ) {
      const { addressToLineNumbersMap } =
        calculationEngineError as CalculationEngineDuplicatedDataErrorMessage;
      return (
        <>
          {Object.keys(addressToLineNumbersMap).map((address) => (
            <p>
              {`Address ${address} encountered duplicate in Line: ${addressToLineNumbersMap[address]}`}
            </p>
          ))}
        </>
      );
    } else return null;
  };

  return (
    <div className={styles.calculation_engine_container}>
      <TextArea value={val} onChange={onChange} />
      <p className={styles.calculation_engine_textarea_instruction}>
        Separated By ',' or '' or '='
      </p>
      {calculationEngineError && (
        <div className={styles.calculation_engine_error_container}>
          {calculationEngineError.errorType ===
            CALCULATION_ERROR_TYPE.DUPLICATE_DATA && (
            <div
              className={
                styles.calculation_engine_duplicate_error_action_container
              }
            >
              <p>Duplicated</p>
              <p>
                <button
                  className={styles.calculation_engine_action}
                  onClick={() =>
                    handleDuplicateErrors(
                      CALCULATION_DUPLICATION_ACTION_TYPE.KEEP_FIRST
                    )
                  }
                >
                  Keep the first one
                </button>
                |
                <button
                  className={styles.calculation_engine_action}
                  onClick={() =>
                    handleDuplicateErrors(
                      CALCULATION_DUPLICATION_ACTION_TYPE.COMBINE_ALL
                    )
                  }
                >
                  Combine Balance
                </button>
              </p>
            </div>
          )}
          <div
            className={styles.calculation_engine_error_description_container}
          >
            {getErrorMessgae()}
          </div>
        </div>
      )}
      <button
        onClick={handleValidate}
        className={styles.calculation_engine_validate_button}
      >
        Next
      </button>
    </div>
  );
};

export default CalculationEngine;
