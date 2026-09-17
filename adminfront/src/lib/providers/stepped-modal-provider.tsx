'use client';

import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Modal, Steps } from 'antd';
import { clsx } from 'clsx';
import React, {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useMemo,
	useReducer,
} from 'react';
import { StepActions, stepReducer } from './stepped-modal-state';

// Types
type StepModalScreen = {
	title: string;
	content: ReactNode;
};

interface StepModalProps {
	open: boolean;
	onCancel: () => void;
	title: string;
	steps: StepModalScreen[];
	onFinish: () => void;
	isMobile?: boolean;
	loading?: boolean;
	desktopWidth?: number | string;
	desktopBodyMaxHeight?: number | string;
}

interface SteppedContextType {
	currentStep: number;
	nextEnabled: boolean;
	goToNext: () => void;
	goToPrev: () => void;
	reset: () => void;
	setStep: (step: number) => void;
	enableNext: () => void;
	disableNext: () => void;
}

export const SteppedContext = createContext<SteppedContextType | null>(null);

// Step Provider Component
export const StepModalProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [state, dispatch] = useReducer(stepReducer, {
		currentStep: 0,
		nextEnabled: true,
	});
	const goToNext = useCallback(() => dispatch({ type: StepActions.NEXT }), []);
	const goToPrev = useCallback(() => dispatch({ type: StepActions.PREV }), []);
	const reset = useCallback(() => dispatch({ type: StepActions.RESET }), []);
	const setStep = useCallback((step: number) =>
		dispatch({ type: StepActions.SET_PAGE, payload: step }), []);
	const enableNext = useCallback(() => dispatch({ type: StepActions.ENABLE_NEXT }), []);
	const disableNext = useCallback(() => dispatch({ type: StepActions.DISABLE_NEXT }), []);

	const contextValue = useMemo(
		() => ({
			currentStep: state.currentStep,
			nextEnabled: state.nextEnabled,
			goToNext,
			goToPrev,
			reset,
			setStep,
			enableNext,
			disableNext,
		}),
		[
			disableNext,
			enableNext,
			goToNext,
			goToPrev,
			reset,
			setStep,
			state.currentStep,
			state.nextEnabled,
		]
	);

	return (
		<SteppedContext.Provider value={contextValue}>
			{children}
		</SteppedContext.Provider>
	);
};

// Hook for using step context
export const useStepModal = () => {
	const context = useContext(SteppedContext);
	if (!context) {
		throw new Error('useStepModal must be used within a StepModalProvider');
	}
	return context;
};

// Main StepModal Component
export const StepModal: React.FC<StepModalProps> = ({
	open,
	onCancel,
	title,
	steps,
	onFinish,
	isMobile = false,
	loading = false,
	desktopWidth = 800,
	desktopBodyMaxHeight = 600,
}) => {
	const SteppedContext = useStepModal();

	const handleClose = () => {
		SteppedContext.reset();
		onCancel();
	};

	const handleNext = () => {
		if (SteppedContext.currentStep === steps.length - 1) {
			onFinish();
		} else {
			SteppedContext.goToNext();
		}
	};

	const renderTitle = () => (
		<div className="flex items-center gap-4">
			{SteppedContext.currentStep > 0 && (
				<Button
					icon={<ArrowLeftOutlined />}
					type="text"
					onClick={SteppedContext.goToPrev}
				/>
			)}
			<span className="text-lg font-medium">{title}</span>
		</div>
	);

	return (
		<Modal
			open={open}
			onCancel={handleClose}
			title={renderTitle()}
			maskClosable={false}
			footer={[
				<Button
					key="back"
					onClick={SteppedContext.goToPrev}
					disabled={SteppedContext.currentStep === 0}
				>
					Quay lại
				</Button>,
				<Button
					key="next"
					type="primary"
					onClick={handleNext}
					loading={loading}
					disabled={!SteppedContext.nextEnabled || loading}
				>
					{SteppedContext.currentStep === steps.length - 1 ? 'Tạo' : 'Tiếp tục'}
				</Button>,
			]}
			width={isMobile ? '95%' : desktopWidth}
			centered
			styles={{
				body: {
					maxHeight: isMobile ? '65vh' : desktopBodyMaxHeight,
					overflowY: 'auto',
				},
			}}
			style={{
				top: isMobile ? 20 : undefined,
			}}
			className={isMobile ? 'mobile-step-modal' : ''}
			loading={loading}
		>
			<div className={`mb-6 ${isMobile ? 'px-2' : ''}`}>
				<Steps
					current={SteppedContext.currentStep}
					items={steps.map((step) => ({ title: step.title }))}
					size={isMobile ? 'small' : 'default'}
					direction="horizontal"
					className="flex-row"
				/>
			</div>
			<div
				className={clsx(
					'transition-all duration-200',
					'min-h-[200px]',
					isMobile ? 'p-2' : 'p-4'
				)}
			>
				{steps[SteppedContext.currentStep].content}
			</div>
		</Modal>
	);
};
