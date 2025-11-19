import { JSX } from "react"
import { ContentEditable as LexicalContentEditable } from "@lexical/react/LexicalContentEditable"

import { useRef, useEffect } from "react"

type Props = {
  placeholder: string
  className?: string
  placeholderClassName?: string
  value?: string
  onChange?: (value: string) => void
}

export function ContentEditable({
  placeholder,
  className,
  placeholderClassName,
  value = "",
  onChange,
}: Props): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && ref.current.innerText !== value) {
      ref.current.innerText = value;
    }
  }, [value]);

  return (
    <LexicalContentEditable
      ref={ref}
      className={
        className ??
        `ContentEditable__root relative block min-h-72 min-h-full overflow-auto px-8 py-4 focus:outline-none`
      }
      aria-placeholder={placeholder}
      placeholder={
        <div
          className={
            placeholderClassName ??
            `text-muted-foreground pointer-events-none absolute top-0 left-0 overflow-hidden px-8 py-[18px] text-ellipsis select-none`
          }
        >
          {placeholder}
        </div>
      }
      onInput={e => {
        if (onChange) {
          onChange((e.target as HTMLDivElement).innerText);
        }
      }}
      suppressContentEditableWarning
    />
  );
}
