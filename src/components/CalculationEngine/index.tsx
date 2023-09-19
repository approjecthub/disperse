import { useState } from "react";
import TextArea from "../TextArea";
import styles from "./index.module.css";

const CalculationEngine = (): JSX.Element => {
  const [val, setVal] = useState<string>("");
  const [calculationEngineError, setCalculationEngineError] = useState<
    CalculationEngineErrorMessage[]
  >([]);

  const validAddressPattern = /^0x[a-fA-F0-9]{40}$/i;

  const onChange = (arg: string) => {
    setVal(arg);
  };

  const handleValidate = () => {
    const allDatas: string[] = val.split(/[\n,=]/);
    const addressToLineNumberMap: { [key: string]: number[] } = {};

    for (let idx = 0; idx < allDatas.length; idx++) {
      const currentLineDatas = allDatas[idx]?.split(" ");

      //validate current line data length
      if (!Array.isArray(currentLineDatas) || currentLineDatas.length !== 2) {
        setCalculationEngineError((prev) => [
          ...prev,
          {
            lineNumbers: [idx + 1],
          },
        ]);
        return;
      }

      const address = currentLineDatas[0];
      const amount = currentLineDatas[1];

      //validate the address
      if (!validAddressPattern.test(address)) {
        setCalculationEngineError((prev) => [
          ...prev,
          {
            lineNumbers: [idx + 1],
          },
        ]);
        return;
      }

      //validate the amount
      if (!/[0-9]/.test(amount)) {
        setCalculationEngineError((prev) => [
          ...prev,
          {
            lineNumbers: [idx + 1],
          },
        ]);
        return;
      }

      if (addressToLineNumberMap[address]) {
        addressToLineNumberMap[address].push(idx + 1);
      }
      if (!addressToLineNumberMap[address]) {
        addressToLineNumberMap[address] = [idx + 1];
      }
    }

    const duplicateAddressErrors: CalculationEngineErrorMessage[] = [];
    Object.keys(addressToLineNumberMap).forEach((address) => {
      if (addressToLineNumberMap[address].length > 1) {
        duplicateAddressErrors.push({
          lineNumbers: addressToLineNumberMap[address],
        });
      }
    });

    if (duplicateAddressErrors.length > 0) {
      setCalculationEngineError(duplicateAddressErrors);
    }
  };

  return (
    <div className={styles.calculation_engine_container}>
      <TextArea value={val} onChange={onChange} />
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
