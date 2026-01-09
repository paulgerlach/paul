import { QuestionareFormData } from "@/app/(service)/fragebogen/page";
import { create } from "zustand";

export type QuestionareStoreType = {
	formData: QuestionareFormData;
	setFormData: (data: QuestionareFormData) => void;
	resetFormData: () => void;
	resetQuestionnaire: () => void;
	increment: () => void;
	decrement: () => void;
	totalStepsNumber: number;
	totalSteps: number[];
	activeStep: number;
	setActiveStep: (step: number) => void;
	handleNextStep: () => void;
	handlePrevStep: () => void;
	onChange: <K extends keyof QuestionareFormData>(
		key: K,
		value: QuestionareFormData[K],
	) => void;
	onChangeForvard: <K extends keyof QuestionareFormData>(
		key: K,
		value: QuestionareFormData[K],
	) => void;
};

export const useQuestionareStore = create<QuestionareStoreType>((set, get) => ({
	formData: {
		property_count_category: null,
		// TOP FLOW fields
		messdienstleister_count: 10,
		zusammenarbeit_status: null,
		akuter_handlungsbedarf: null,
		// Contact form fields
		verwaltung_name: "",
		postleitzahl: "",
		ort: "",
		email: "",
		first_name: "",
		last_name: "",
		form_confirm: false,
		// Legacy fields
		appartment_number: 2,
		central_heating_system: null,
		energy_sources: "Fernwärme",
		heating_costs: null,
		central_water_supply: null,
		heating_available: null,
	},
	setFormData: (data) => set({ formData: data }),
	resetFormData: () => set({ formData: {} as QuestionareFormData }),
	resetQuestionnaire: () => set({ 
		activeStep: 0,
		formData: {
			property_count_category: null,
			messdienstleister_count: 10,
			zusammenarbeit_status: null,
			akuter_handlungsbedarf: null,
			wohnungen_count: 3,
			funkzaehler_status: null,
			standort_schwerpunkt: "",
			verwaltung_name: "",
			postleitzahl: "",
			ort: "",
			email: "",
			first_name: "",
			last_name: "",
			form_confirm: false,
			appartment_number: 2,
			central_heating_system: null,
			energy_sources: "Fernwärme",
			heating_costs: null,
			central_water_supply: null,
			heating_available: null,
		} as QuestionareFormData
	}),
	increment: () =>
		set((state) => ({
			formData: {
				...state.formData,
				appartment_number: (state.formData.appartment_number ?? 0) + 1,
			},
		})),
	onChange: (key, value) =>
		set((state) => ({
			formData: { ...state.formData, [key]: value },
		})),
	onChangeForvard: (key, value) => {
		set((state) => ({
			formData: { ...state.formData, [key]: value },
		}));
		get().handleNextStep();
	},
	decrement: () =>
		set((state) => ({
			formData: {
				...state.formData,
				appartment_number: Math.max(
					(state.formData.appartment_number ?? 0) - 1,
					1,
				),
			},
		})),
	activeStep: 0,
	setActiveStep: (step) =>
		set(() => ({
			activeStep: step,
		})),
	totalSteps: [0, 1, 2, 3, 4, 5],
	totalStepsNumber: 6,
	handleNextStep: () => {
		if (get().activeStep < get().totalStepsNumber - 1) {
			get().setActiveStep(get().activeStep + 1);
		}
	},
	handlePrevStep: () => {
		if (get().activeStep > 0) {
			get().setActiveStep(get().activeStep - 1);
		}
	},
}));
