export enum StepActions {
	NEXT,
	PREV,
	RESET,
	SET_PAGE,
	ENABLE_NEXT,
	DISABLE_NEXT,
}

export type StepState = {
	currentStep: number;
	nextEnabled: boolean;
};

export const stepReducer = (
	state: StepState,
	action: { type: StepActions; payload?: number }
): StepState => {
	switch (action.type) {
		case StepActions.NEXT:
			return { ...state, currentStep: state.currentStep + 1 };
		case StepActions.PREV:
			return { ...state, currentStep: Math.max(0, state.currentStep - 1) };
		case StepActions.RESET:
			return state.currentStep === 0 && state.nextEnabled
				? state
				: { currentStep: 0, nextEnabled: true };
		case StepActions.SET_PAGE:
			return state.currentStep === action.payload
				? state
				: { ...state, currentStep: action.payload ?? state.currentStep };
		case StepActions.ENABLE_NEXT:
			return state.nextEnabled ? state : { ...state, nextEnabled: true };
		case StepActions.DISABLE_NEXT:
			return state.nextEnabled ? { ...state, nextEnabled: false } : state;
		default:
			return state;
	}
};
