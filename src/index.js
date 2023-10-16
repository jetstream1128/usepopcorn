import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
// import StarRating from "./StarRating";
// import "./TextExpander-Style.css";
// import TextExpander from "./TextExpander";

// function Test() {
// 	const [test, setTest] = useState(0);
// 	return (
// 		<div>
// 			<StarRating color="black" onSetRating={setTest} />
// 			<div>this movie has {test}</div>
// 		</div>
// 	);
// }

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<App />
		{/* <StarRating size={48} maxRating={10} color="blue" />
		<StarRating color="green" />
		<StarRating />
		<Test /> */}

		{/* <div>
			<TextExpander>
				Space travel is the ultimate adventure! Imagine soaring past the stars
				and exploring new worlds. It's the stuff of dreams and science fiction,
				but believe it or not, space travel is a real thing. Humans and robots
				are constantly venturing out into the cosmos to uncover its secrets and
				push the boundaries of what's possible.
			</TextExpander>
			<br />

			<TextExpander
				collapsedNumWords={20}
				expandButtonText="Show text"
				collapseButtonText="Collapse text"
				buttonColor="#ff6622"
			>
				Space travel requires some seriously amazing technology and
				collaboration between countries, private companies, and international
				space organizations. And while it's not always easy (or cheap), the
				results are out of this world. Think about the first time humans stepped
				foot on the moon or when rovers were sent to roam around on Mars.
			</TextExpander>
			<br />

			<TextExpander expanded={true} className="box">
				Space missions have given us incredible insights into our universe and
				have inspired future generations to keep reaching for the stars. Space
				travel is a pretty cool thing to think about. Who knows what we'll
				discover next!
			</TextExpander>
			<br />
		</div>*/}
	</React.StrictMode>
);
