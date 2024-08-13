'use client';
import { Button } from '@/components/Button';
import { Modal, ModalProps } from 'antd';
import clsx from 'clsx';
import { Undo2, X } from 'lucide-react';
import {
	createContext,
	ReactNode,
	useContext,
	useMemo,
	useReducer,
} from 'react';

enum LayeredModalActions {
	PUSH,
	POP,
	RESET,
}

export type LayeredModalScreen = {
	title: string;
	subtitle?: string;
	onBack: () => void;
	onConfirm?: () => void;
	view: ReactNode;
};

export type ILayeredModalContext = {
	screens: LayeredModalScreen[];
	push: (screen: LayeredModalScreen) => void;
	pop: () => void;
	reset: () => void;
};

const defaultContext: ILayeredModalContext = {
	screens: [],
	push: (screen) => {},
	pop: () => {},
	reset: () => {},
};

export const LayeredModalContext = createContext(defaultContext);

const reducer = (state: any, action: any) => {
	switch (action.type) {
		case LayeredModalActions.PUSH: {
			return { ...state, screens: [...state.screens, action.payload] };
		}
		case LayeredModalActions.POP: {
			return { ...state, screens: state.screens.slice(0, -1) };
		}
		case LayeredModalActions.RESET: {
			return { ...state, screens: [] };
		}
	}
};

type LayeredModalProps = {
	context: ILayeredModalContext;
	onCancel: () => void;
} & ModalProps;

export const LayeredModalProvider = ({ children }: any) => {
	const [state, dispatch] = useReducer(reducer, defaultContext);

	const contextValue = useMemo(
		() => ({
			...state,
			push: (screen: LayeredModalScreen) => {
				dispatch({ type: LayeredModalActions.PUSH, payload: screen });
			},

			pop: () => {
				dispatch({ type: LayeredModalActions.POP });
			},

			reset: () => {
				dispatch({ type: LayeredModalActions.RESET });
			},
		}),
		[state, dispatch]
	);

	return (
		<LayeredModalContext.Provider value={contextValue}>
			{children}
		</LayeredModalContext.Provider>
	);
};

export const useLayeredModal = () => {
	const context = useContext(LayeredModalContext);
	if (context === null) {
		throw new Error(
			'useLayeredModal must be used within a LayeredModalProvider'
		);
	}
	return context;
};

const LayeredModal = ({
	context,
	children,
	onCancel,
	open,
	...props
}: LayeredModalProps) => {
	const emptyScreensAndClose = () => {
		context.reset();
		onCancel();
	};
	const screen = context.screens[context.screens.length - 1];

	return (
		<Modal
			open={open}
			onCancel={onCancel}
			okText="Đồng ý"
			cancelText="Hủy"
			styles={{
				header: { borderBottom: '1px solid #e5e7eb', paddingBottom: '12px' },
				footer: { borderTop: '1px solid #e5e7eb', paddingTop: '16px' },
				body: { padding: '0px 16px' },
			}}
			{...props}
		>
			<div
				className={clsx(
					'flex flex-col justify-between transition-transform duration-200',
					{
						'translate-x-0': typeof screen !== 'undefined',
						'translate-x-full': typeof screen === 'undefined',
					}
				)}
			>
				{screen ? (
					<>
						<div className="flex justify-between items-center">
							<div className="flex items-center">
								<Button
									type="text"
									size="small"
									className="text-gray-500 h-8 w-8 border"
									onClick={screen.onBack}
								>
									<Undo2 size={20} />
								</Button>
								<div className="gap-4 flex items-center">
									<h2 className="font-normal ml-4">{screen.title}</h2>
									{screen.subtitle && (
										<span className="font-medium text-gray-500">
											({screen.subtitle})
										</span>
									)}
								</div>
							</div>
							<Button
								type="text"
								size="small"
								className="text-gray-500 h-8 w-8 border"
								onClick={emptyScreensAndClose}
							>
								<X />
							</Button>
						</div>
						{screen.view}
					</>
				) : (
					<></>
				)}
			</div>
			<div
				className={clsx('transition-transform duration-200', {
					'-translate-x-full': typeof screen !== 'undefined',
				})}
			>
				<div
					className={clsx('transition-display', {
						'hidden opacity-0 delay-500': typeof screen !== 'undefined',
					})}
				>
					{children}
				</div>
			</div>
		</Modal>
	);
};

export default LayeredModal;
