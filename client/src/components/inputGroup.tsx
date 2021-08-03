import classNames from 'classnames';
import React from 'react';

interface Props {
	error: string | undefined;
	value: any;
	setValue: (str: string) => void;
	type: string;
	name: string;
	inputId: string;
	placeholder: string;
	className: string;
}

export const InputGroup: React.FC<Props> = ({
	error,
	value,
	setValue,
	type,
	name,
	inputId,
	placeholder,
	className,
}) => {
	return (
		<div className={className}>
			<input
				type={type}
				name={name}
				id={inputId}
				placeholder={placeholder}
				className={classNames(
					'w-full p-3 transition duration-200 border border-gray-300 rounded outline-none bg-gray-50 focus:bg-white hover:bg-white',
					{ 'border-red-500': error },
				)}
				value={value}
				onChange={(e) => setValue(e.target.value)}
			/>
			<small className='font-medium text-red-600'>{error}</small>
		</div>
	);
};
