import { useState } from "react";
import { type BaseStepProps } from "../StepWrapper";

export default function FragebogenStepSix({
  register,
  watch,
  setValue,
}: BaseStepProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedValue = watch("energy_sources") || "Fernwärme";

  const handleSelect = (value: string) => {
    setValue("energy_sources", value);
    setIsOpen(false);
  };

  return (
    <div data-step="6" className="questionare-step mb-10">
      <p className="mb-6 text-[40px] max-small:text-2xl text-dark_text">
        Energiequellen
      </p>
      <p className="mb-12 text-xl max-small:text-base text-dark_text">
        Mit welchen Energiequellen wird geheizt?
      </p>
      <div className="custom-select-wrapper">
        <div
          className={`custom-select`}
          onClick={() => setIsOpen(!isOpen)}>
          <div className="custom-select-trigger">
            <span>{selectedValue}</span>
            <div className="arrow"></div>
          </div>
          {isOpen && (
            <div className={`custom-options ${isOpen ? "open" : ""}`}>
              {[
                "Fernwärme",
                "Gas",
                "Heizöl",
                "Pellets",
                "Solar",
                "Wärmepumpe",
                "Hybride Energiequelle",
                "sonstiges",
              ].map((option) => (
                <span
                  key={option}
                  className={`custom-option ${
                    selectedValue === option ? "selected" : ""
                  }`}
                  data-value={option}
                  onClick={() => handleSelect(option)}>
                  {option}
                </span>
              ))}
            </div>
          )}
        </div>
        <select
          {...register("energy_sources")}
          id="energy_sources"
          className="hidden">
          {[
            "Fernwärme",
            "Gas",
            "Heizöl",
            "Pellets",
            "Solar",
            "Wärmepumpe",
            "Hybride Energiequelle",
            "Sonstiges",
          ].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
