import { useState } from "react";
import TextArea from "../TextArea";

const CalculationEngine = (): JSX.Element => {
  const [val, setVal] = useState("");
  const onChange = (arg: string) => {
    setVal(arg);
  };
  return (
    <>
      <TextArea value={val} onChange={onChange} />
    </>
  );
};

export default CalculationEngine;
