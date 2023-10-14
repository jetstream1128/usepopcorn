import { useState } from "react";

export default function TextExpander({
	children,
	className = "",
	collapsedNumWords = 10,
	expandButtonText = "Show more",
	collapseButtonText = "Collapse",
	buttonColor = "#1f09cd",
	expanded = false,
}) {
	const [isExpanded, setIsExpanded] = useState(expanded);
	const [isHovered, setIsHovered] = useState(false);

	const buttonStyle = {
		border: "none",
		background: "none",
		backgroundColor: "none",
		marginLeft: "6px",
		color: buttonColor,
		cursor: "pointer",
		textDecoration: isHovered ? "underline" : "none",
	};

	const fullText = children;

	const collapsedText =
		fullText.split(" ").slice(0, collapsedNumWords).join(" ") + "...";

	const displayedText = isExpanded ? fullText : collapsedText;

	function handleClick() {
		setIsExpanded(!isExpanded);
	}

	function handleMouseOver() {
		setIsHovered(!isHovered);
	}

	function handleMouseLeave() {
		setIsHovered(!isHovered);
	}

	return (
		<div className={className}>
			<span>{displayedText}</span>

			<button
				style={buttonStyle}
				onClick={handleClick}
				onMouseOver={handleMouseOver}
				onMouseLeave={handleMouseLeave}
			>
				{isExpanded ? collapseButtonText : expandButtonText}
			</button>
		</div>
	);
}
