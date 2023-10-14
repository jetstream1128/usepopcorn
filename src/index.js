import React, { useState } from "react";
import ReactDOM from "react-dom/client";
// import "./index.css";
// import App from "./App";
import StarRating from "./StarRating";

function Test() {
	const [movieRating, setMovieRating] = useState(0);

	return (
		<div>
			<StarRating color="magenta" size={50} onSetRating={setMovieRating} />
			<p>This movie was rated {movieRating} stars</p>
		</div>
	);
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		{/* <App /> */}
		<StarRating maxRating={3} />
		<StarRating
			maxRating={5}
			size={48}
			color="blue"
			messages={["Terrible", "Bad", "Okay", "Good", "Amazing"]}
		/>
		<StarRating
			maxRating={10}
			color="green"
			className="star-rating"
			defaultRating={3}
		/>
		<br />
		<Test />
	</React.StrictMode>
);
