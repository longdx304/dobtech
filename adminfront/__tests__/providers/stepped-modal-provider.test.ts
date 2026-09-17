/** @jest-environment node */

import { expect } from '@jest/globals';
import {
	StepActions,
	stepReducer,
} from '@/lib/providers/stepped-modal-state';

describe('stepReducer', () => {
	it('does not create another render when the next-step state is unchanged', () => {
		const enabled = { currentStep: 1, nextEnabled: true };
		const disabled = { currentStep: 1, nextEnabled: false };

		expect(Object.is(stepReducer(enabled, { type: StepActions.ENABLE_NEXT }), enabled)).toEqual(true);
		expect(Object.is(stepReducer(disabled, { type: StepActions.DISABLE_NEXT }), disabled)).toEqual(true);
	});
});
