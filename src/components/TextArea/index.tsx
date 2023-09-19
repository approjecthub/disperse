import { useMemo, useRef, useState } from "react";
import styles from "./index.module.css";

type TextAreaProps = {
  value: string;
  onChange: (arg: string) => void;
  numOfLines?: number;
};

const TextArea = ({
  numOfLines = 5,
  value,
  onChange,
}: TextAreaProps): JSX.Element => {
  const handleOnChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(evt.target.value);
  };
  const lineCount = useMemo(() => value.split("\n").length, [value]);
  const linesArr = useMemo(
    () =>
      Array.from({ length: Math.max(numOfLines, lineCount) }, (_, i) => i + 1),
    [lineCount, numOfLines]
  );
  const [currentLineNumber, setCurrentLineNumber] = useState<number | null>(
    null
  );
  const lineCounterRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const handleTextareaScroll = () => {
    if (lineCounterRef.current && textareaRef.current) {
      lineCounterRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };
  const handleCurrentLineNumber = () => {
    const currentLine = value
      .substr(0, textareaRef.current?.selectionStart)
      .split("\n").length;
    setCurrentLineNumber(currentLine);
  };

  return (
    <div className={styles.text_editor_container}>
      <div
        className={styles.text_editor_line_number_container}
        ref={lineCounterRef}
      >
        {linesArr.map((line) => (
          <div
            key={line}
            style={line === currentLineNumber ? { color: "blue" } : {}}
          >
            {line}
          </div>
        ))}
      </div>
      <textarea
        className={styles.text_editor}
        wrap="off"
        value={value}
        onChange={handleOnChange}
        onScroll={handleTextareaScroll}
        ref={textareaRef}
        onKeyUp={handleCurrentLineNumber}
        onClick={handleCurrentLineNumber}
      ></textarea>
    </div>
  );
};

export default TextArea;
