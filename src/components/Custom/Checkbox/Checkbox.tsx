import React, { ReactElement, useId } from "react";
import styled from "styled-components";
import { useField } from "formik";

interface CheckboxProps {
	name?: string;
	size?: number; // px
	checked?: boolean;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	id?: string;
	label?: string;
	shape?: ReactElement;
	disabled?: boolean;
}

export default function Checkbox({
	name,
	size = 20,
	checked,
	onChange,
	id,
	label,
	disabled,
	shape,
	...props
}: CheckboxProps) {
	const [field, meta, helpers] = useField(name);
	const fallbackId = useId();
	const inputId = id ?? `cc-${fallbackId}`;

	return (
		<div className="flex gap-2 items-center">
			<StyledWrapper>
				<input
					id={inputId}
					type="checkbox"
					{...field}
					{...props}
					checked={field.value}
					// onChange={onChange}
					disabled={disabled}
				/>
				<label
					className="check"
					htmlFor={inputId}
					aria-checked={checked}
				>
					<svg
						viewBox="0 0 18 18"
						style={{ width: size, height: size }}
					>
						<path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z" />
						<polyline points="1 9 7 14 15 4" />
					</svg>
				</label>
			</StyledWrapper>

			<p>{label}</p>
		</div>
	);
}

const StyledWrapper = styled.div`
	position: relative;
	display: inline-flex;
	align-items: center;

	/* Hide the native input but keep it accessible */
	input[type="checkbox"] {
		position: absolute;
		opacity: 0;
		inset: 0;
		margin: 0;
		width: 100%;
		height: 100%;
	}

	.check {
		cursor: pointer;
		position: relative;
		-webkit-tap-highlight-color: transparent;
		display: inline-flex;
	}

	.check:before {
		content: "";
		position: absolute;
		top: -15px;
		left: -15px;
		width: 48px;
		height: 48px;
		border-radius: 50%;
		background: rgb(33 33 33 / 0%);
		opacity: 0;
		transition: opacity 0.2s ease;
	}

	.check svg {
		position: relative;
		z-index: 1;
		fill: none;
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke: #c8ccd4;
		stroke-width: 1.5;
		transition: all 0.2s ease;
	}

	.check svg path {
		stroke-dasharray: 60;
		stroke-dashoffset: 0;
	}
	.check svg polyline {
		stroke-dasharray: 22;
		stroke-dashoffset: 66;
	}

	.check:hover:before {
		opacity: 1;
	}
	.check:hover svg {
		stroke: #4285f4;
	}

	/* ✅ Generic checked selectors (no hardcoded #mute) */
	input[type="checkbox"]:checked + .check svg {
		stroke: #4285f4;
	}

	input[type="checkbox"]:checked + .check svg path {
		stroke-dashoffset: 60;
		transition: all 0.3s linear;
	}

	input[type="checkbox"]:checked + .check svg polyline {
		stroke-dashoffset: 42;
		transition: all 0.2s linear;
		transition-delay: 0.15s;
		stroke: #155dfc;
		animation: mute 0.6s ease;
	}

	@keyframes mute {
		from {
			transform: scale(1, 1);
		}
		30% {
			transform: scale(1.25, 0.75);
		}
		40% {
			transform: scale(0.75, 1.25);
		}
		50% {
			transform: scale(1.15, 0.85);
		}
		65% {
			transform: scale(0.95, 1.05);
		}
		75% {
			transform: scale(1.05, 0.95);
		}
		to {
			transform: scale(1, 1);
		}
	}
`;
