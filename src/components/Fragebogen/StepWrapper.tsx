import { QuestionareFormData } from "@/app/(service)/fragebogen/page";
import FragebogenStepOne from "@/components/Fragebogen/Steps/StepOne";
// Over50 Flow (51-800 & über 800 Immobilien)
import StepTwoOver50 from "@/components/Fragebogen/Steps/Over50/StepTwoOver50";
import StepThreeOver50 from "@/components/Fragebogen/Steps/Over50/StepThreeOver50";
import StepFourOver50 from "@/components/Fragebogen/Steps/Over50/StepFourOver50";
import StepFiveOver50 from "@/components/Fragebogen/Steps/Over50/StepFiveOver50";
import StepSixOver50 from "@/components/Fragebogen/Steps/Over50/StepSixOver50";
// Under50 Flow (1-50 Immobilien)
import StepTwoUnder50 from "@/components/Fragebogen/Steps/Under50/StepTwoUnder50";
import StepThreeUnder50 from "@/components/Fragebogen/Steps/Under50/StepThreeUnder50";
import StepFourUnder50 from "@/components/Fragebogen/Steps/Under50/StepFourUnder50";
import type {
	FieldErrors,
	UseFormRegister,
	UseFormSetValue,
	UseFormWatch,
} from "react-hook-form";

export type BaseStepProps = {
	register: UseFormRegister<QuestionareFormData>;
	watch: UseFormWatch<QuestionareFormData>;
	errors: FieldErrors<QuestionareFormData>;
	setValue: UseFormSetValue<QuestionareFormData>;
};

export type StepWrapperProps = BaseStepProps & {
	activeStep: number;
};

export default function StepWrapper({
	activeStep,
	register,
	watch,
	setValue,
	errors,
}: StepWrapperProps) {
	const propertyCategory = watch("property_count_category");
	// Over50 flow: 51-800 and über 800 Immobilien
	const isOver50Flow = propertyCategory === "51-800 Immobilien" || propertyCategory === "über 800 Immobilien";
	// Under50 flow: 1-50 Immobilien
	const isUnder50Flow = propertyCategory === "1-50 Immobilien";

	const renderStep = () => {
		// Step 0 is always the same (property count selection)
		if (activeStep === 0) {
			return (
				<FragebogenStepOne
					register={register}
					watch={watch}
					errors={errors}
					setValue={setValue}
					key="step-1"
				/>
			);
		}

		// Over50 Flow: 51-800 and über 800 Immobilien
		if (isOver50Flow) {
			switch (activeStep) {
				case 1:
					return (
						<StepTwoOver50
							register={register}
							watch={watch}
							errors={errors}
							setValue={setValue}
							key="step-2-over50"
						/>
					);
				case 2:
					return (
						<StepThreeOver50
							register={register}
							watch={watch}
							errors={errors}
							setValue={setValue}
							key="step-3-over50"
						/>
					);
				case 3:
					return (
						<StepFourOver50
							register={register}
							watch={watch}
							errors={errors}
							setValue={setValue}
							key="step-4-over50"
						/>
					);
				case 4:
					return (
						<StepFiveOver50
							register={register}
							watch={watch}
							errors={errors}
							setValue={setValue}
							key="step-5-over50"
						/>
					);
				case 5:
					return (
						<StepSixOver50
							register={register}
							watch={watch}
							errors={errors}
							setValue={setValue}
							key="step-6-over50"
						/>
					);
				default:
					return null;
			}
		}

		// Under50 Flow: 1-50 Immobilien
		if (isUnder50Flow) {
			switch (activeStep) {
				case 1:
					return (
						<StepTwoUnder50
							register={register}
							watch={watch}
							errors={errors}
							setValue={setValue}
							key="step-2-under50"
						/>
					);
				case 2:
					return (
						<StepThreeUnder50
							register={register}
							watch={watch}
							errors={errors}
							setValue={setValue}
							key="step-3-under50"
						/>
					);
				case 3:
					return (
						<StepFourUnder50
							register={register}
							watch={watch}
							errors={errors}
							setValue={setValue}
							key="step-4-under50"
						/>
					);
				case 4:
					// Reuse StepSixOver50 for personal contact form
					return (
						<StepSixOver50
							register={register}
							watch={watch}
							errors={errors}
							setValue={setValue}
							key="step-5-under50-contact"
						/>
					);
				default:
					return null;
			}
		}

		// Fallback
		return null;
	};

	return renderStep();
}
