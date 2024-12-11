import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { FaChevronDown } from "react-icons/fa";

const AccordionContext = createContext();
function Accordion({ children, value, onChange, ...props }) {
  const [selected, setSelected] = useState(value);
  useEffect(() => {
    onChange?.(selected);
  }, [selected]);

  return (
    <div {...props}>
      <AccordionContext.Provider value={{ selected, setSelected }}>
        {children}
      </AccordionContext.Provider>
    </div>
  );
}

export default Accordion;

export function AccordionItem({ children, value, trigger, ...props }) {
  const { selected, setSelected } = useContext(AccordionContext);
  const open = selected === value;
  const ref = useRef(null);
  return (
    <div className="border-b" {...props}>
      <button
        onClick={() => setSelected(open ? null : value)}
        className="w-full flex items-center justify-between gap-3 p-4 font-semibold"
      >
        {trigger}
        <FaChevronDown
          size={16}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className="overflow-y-hidden transition-all"
        style={{ height: open ? ref.current?.offsetHeight || 0 : 0 }}
      >
        <div className="pt-2 p-4" ref={ref}>
          {children}
        </div>
      </div>
    </div>
  );
}
