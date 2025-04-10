import { QuestionareFormData } from "@/app/(service)/fragebogen/page";
import FragebogenStepFive from "@/components/Fragebogen/Steps/StepFive";
import FragebogenStepFour from "@/components/Fragebogen/Steps/StepFour";
import FragebogenStepOne from "@/components/Fragebogen/Steps/StepOne";
import FragebogenStepSeven from "@/components/Fragebogen/Steps/StepSeven";
import FragebogenStepSix from "@/components/Fragebogen/Steps/StepSix";
import FragebogenStepThree from "@/components/Fragebogen/Steps/StepThree";
import FragebogenStepTwo from "@/components/Fragebogen/Steps/StepTwo";
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
	const renderStep = () => {
		switch (activeStep) {
			case 0:
				return (
					<FragebogenStepOne
						register={register}
						watch={watch}
						errors={errors}
						setValue={setValue}
						key="step-1"
					/>
				);
			case 1:
				return (
					<FragebogenStepTwo
						register={register}
						watch={watch}
						errors={errors}
						setValue={setValue}
						key="step-2"
					/>
				);
			case 2:
				return (
					<FragebogenStepThree
						register={register}
						watch={watch}
						errors={errors}
						setValue={setValue}
						key="step-3"
					/>
				);
			case 3:
				return (
					<FragebogenStepFour
						register={register}
						watch={watch}
						errors={errors}
						setValue={setValue}
						key="step-4"
					/>
				);
			case 4:
				return (
					<FragebogenStepFive
						register={register}
						watch={watch}
						errors={errors}
						setValue={setValue}
						key="step-5"
					/>
				);
			case 5:
				return (
					<FragebogenStepSix
						register={register}
						watch={watch}
						errors={errors}
						setValue={setValue}
						key="step-6"
					/>
				);
			case 6:
				return (
					<FragebogenStepSeven
						register={register}
						watch={watch}
						errors={errors}
						setValue={setValue}
						key="step-7"
					/>
				);
		}
	};

	return renderStep();
}
