import '@testing-library/jest-dom';
import {
	fireEvent,
	render,
	screen,
	cleanup,
	waitFor,
	within
} from '@testing-library/react';
import LoginTemplate from '@/modules/account/components/login';
import { adminLogIn } from '@/services/accounts';
import userEvent from '@testing-library/user-event';

jest.mock('react-dom', () => ({
	useFormState: jest.fn(() => []),
	useFormStatus: jest.fn(() => []),
}));

jest.mock('../../src/services/accounts', () => ({ adminLogIn: jest.fn() }));

afterEach(cleanup);

describe('Login', () => {
	it('renders login', () => {
		render(<LoginTemplate />);

		// check if all component are rendered
		expect(screen.getByTestId('email')).toBeInTheDocument();
		expect(screen.getByTestId('password')).toBeInTheDocument();
		expect(screen.getByTestId('submitBtn')).toBeInTheDocument();
	});

	it('should submit form when button is clicked', async () => {
		adminLogIn.mockResolvedValueOnce({});
		render(<LoginTemplate />);

		const emailInput = screen.getByTestId('email');
		const passwordInput = screen.getByTestId('password');
		const submitBtn = screen.getByTestId('submitBtn');

		fireEvent.change(emailInput, { target: { value: 'admin@test.com' } });
		fireEvent.change(passwordInput, { target: { value: '123456' } });
		expect(submitBtn).toBeEnabled();
		userEvent.click(submitBtn);
		await waitFor(() => {
			// console.log(
			// 	"screen.queryByText('Error Logging In')",
			// 	screen.getByTestId('error1')
			// );
			expect(
				screen.queryByText('Email hoặc mật khẩu không đúng!')
			).toBeNull();
			// expect(screen.queryByText('Success Logging In')).toBeInTheDocument();
		});
	});
	it('should submit form when button is clicked err', async () => {
		// adminLogIn.mockResolvedValueOnce({});
		render(<LoginTemplate />);

		const emailInput = screen.getByTestId('email');
		const passwordInput = screen.getByTestId('password');
		const submitBtn = screen.getByTestId('submitBtn');

		fireEvent.change(emailInput, { target: { value: 'admin@teszt.com' } });
		fireEvent.change(passwordInput, { target: { value: '123456z' } });
		expect(submitBtn).toBeEnabled();
		userEvent.click(submitBtn);
		await waitFor(() => {
			// console.log(
			// 	"screen.queryByText('Error Logging In')",
			// 	screen.getByTestId('error1')
			// );
			expect(
				screen.getByTestId('error1')
			).toHaveTextContain("Email hoặc mật khẩu không đúng!");
			// expect(screen.queryByText('Success Logging In')).toBeInTheDocument();
		});
	});
});
