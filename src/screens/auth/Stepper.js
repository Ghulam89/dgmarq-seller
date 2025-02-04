import React from "react";

const Stepper = ({ currentStep }) => {
  const steps = [
    { id: 1, label: "Business details" },
    { id: 4, label: "Attachments" },
  ];

  return (
    <div className="flex items-center space-x-6">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center space-x-2">
          <div
            className={`w-8 h-8 flex items-center justify-center rounded-full font-semibold text-white ${
              step.id === currentStep ? "bg-blue-500" : "bg-gray-400"
            }`}
          >
            {step.id}
          </div>
          <span
            className={`${
              step.id === currentStep ? "font-bold text-black" : "text-gray-500"
            }`}
          >
            {step.label}
          </span>
          {index < steps.length - 1 && <div className="w-12 border-t border-gray-300"></div>}
        </div>
      ))}
    </div>
  );
};

export default Stepper;
