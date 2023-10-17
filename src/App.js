import { useEffect, useState } from "react";
import StarRating from "./StarRating";

const average = (arr) =>
	arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "c77df754";

export default function App() {
	const [query, setQuery] = useState("");
	const [movies, setMovies] = useState([]);
	const [watched, setWatched] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [selectedId, setSelectedID] = useState(null);

	// useEffect(function () {
	// 	console.log("After initial render");
	// }, []);

	// useEffect(function () {
	// 	console.log("After every render");
	// });

	// useEffect(
	// 	function () {
	// 		console.log("D");
	// 	},
	// 	[query]
	// );

	// console.log("During render");

	useEffect(
		function () {
			const controller = new AbortController();

			if (!query) return;
			async function fetchMovies() {
				try {
					setIsLoading(true);
					setError("");
					const res = await fetch(
						`https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
						{ signal: controller.signal }
					);

					if (!res.ok)
						throw new Error("Something went wrong with fetching movies");

					const data = await res.json();
					if (data.Response === "False") throw new Error("Movie not Found");

					setMovies(data.Search);
					setError("");
				} catch (err) {
					if (err.name !== "AbortError") {
						setError(err.message);
					}
				} finally {
					setIsLoading(false);
				}
			}

			if (query.length < 3) {
				setMovies([]);
				setError("");
				return;
			}

			fetchMovies();

			return function () {
				controller.abort();
			};
		},
		[query]
	);

	function handleSelectMovie(id) {
		setSelectedID((selectedId) => (id === selectedId ? null : id));
	}

	function handleCloseMovie() {
		setSelectedID(null);
	}

	function handleAddWatched(movie) {
		setWatched((watched) => [...watched, movie]);
	}

	function handleDeleteWatched(id) {
		setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
	}

	return (
		<>
			<NavBar>
				<Logo />
				<Search query={query} setQuery={setQuery} />
				<NumResults movies={movies} />
			</NavBar>

			<Main>
				{/* <Box element={<MoviesList movies={movies} />} />
				<Box
					element={
						<>
							<WatchedSummary watched={watched} />
							<WatchedMoviesList watched={watched} />
						</>
					}
				/> */}
				{/* <Box>{isLoading ? <Loader /> : <MoviesList movies={movies} />}</Box> */}
				<Box>
					{isLoading && <Loader />}
					{!isLoading && !error && (
						<MoviesList movies={movies} onSelectMovie={handleSelectMovie} />
					)}
					{error && <ErrorMessage message={error} />}
				</Box>
				<Box>
					{selectedId ? (
						<MovieDetails
							selectedId={selectedId}
							onCloseMovie={handleCloseMovie}
							key={selectedId}
							onAddWatched={handleAddWatched}
							watched={watched}
						/>
					) : (
						<>
							<WatchedSummary watched={watched} />
							<WatchedMoviesList
								watched={watched}
								onDeleteWatched={handleDeleteWatched}
							/>
						</>
					)}
				</Box>
			</Main>
		</>
	);
}

function NavBar({ children }) {
	return <nav className="nav-bar">{children}</nav>;
}

function Logo() {
	return (
		<div className="logo">
			<span role="img">🍿</span>
			<h1>usePopcorn</h1>
		</div>
	);
}

function NumResults({ movies }) {
	return (
		<p className="num-results">
			Found <strong>{movies.length}</strong> results
		</p>
	);
}

function Search({ query, setQuery }) {
	return (
		<input
			className="search"
			type="text"
			placeholder="Search movies..."
			value={query}
			onChange={(e) => setQuery(e.target.value)}
		/>
	);
}

function Main({ children }) {
	return <main className="main">{children}</main>;
}

function Box({ children }) {
	const [isOpen, setIsOpen] = useState(true);

	return (
		<div className="box">
			<button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
				{isOpen ? "–" : "+"}
			</button>
			{isOpen && children}
		</div>
	);
}

// function WatchedBox() {
// 	const [watched, setWatched] = useState(tempWatchedData);
// 	const [isOpen2, setIsOpen2] = useState(true);

// 	return (
// 		<div className="box">
// 			<button
// 				className="btn-toggle"
// 				onClick={() => setIsOpen2((open) => !open)}
// 			>
// 				{isOpen2 ? "–" : "+"}
// 			</button>
// 			{isOpen2 && (
// 				<>
// 					<WatchedSummary watched={watched} />
// 					<WatchedMoviesList watched={watched} />
// 				</>
// 			)}
// 		</div>
// 	);
// }

function MoviesList({ movies, onSelectMovie }) {
	return (
		<ul className="list list-movies">
			{movies?.map((movie) => (
				<Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />
			))}
		</ul>
	);
}

function Movie({ movie, onSelectMovie }) {
	return (
		<li onClick={() => onSelectMovie(movie.imdbID)}>
			<img
				src={movie.Poster !== "N/A" ? movie.Poster : "/noimg.jpg"}
				alt={`${movie.Title} poster`}
			/>
			<h3>{movie.Title}</h3>
			<div>
				<p>
					<span>🗓</span>
					<span>{movie.Year}</span>
				</p>
			</div>
		</li>
	);
}

function MovieDetails({ selectedId, onCloseMovie, onAddWatched, watched }) {
	const [movie, setMovie] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [userRating, setUserRating] = useState("");

	const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
	const watchedUserRating = watched.find(
		(movie) => movie.imdbID === selectedId
	)?.userRating;

	const {
		Title: title,
		Year: year,
		Poster: poster,
		Runtime: runtime,
		imdbRating,
		Plot: plot,
		Released: released,
		Actors: actors,
		Director: director,
		Genre: genre,
	} = movie;

	useEffect(
		function () {
			async function getMovieDetails() {
				setIsLoading(true);
				const res = await fetch(
					`https://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
				);
				const data = await res.json();
				setMovie(data);
				setIsLoading(false);
			}
			getMovieDetails();
		},
		[selectedId]
	);

	function handleAdd() {
		const newWatchedMovie = {
			imdbID: selectedId,
			title,
			year,
			poster,
			imdbRating: Number(imdbRating),
			runtime: runtime !== "N/A" ? Number(runtime.split(" ").at(0)) : 0,
			userRating,
		};

		onAddWatched(newWatchedMovie);
		onCloseMovie();
	}

	useEffect(
		function () {
			if (!title) return;
			document.title = `Movie | ${title}`;

			return function () {
				document.title = "usePopcorn";
			};
		},
		[title]
	);

	return (
		<div className="details">
			{isLoading ? (
				<Loader />
			) : (
				<>
					<header>
						{console.log()}
						<button className="btn-back" onClick={onCloseMovie}>
							&larr;
						</button>
						{/* {poster !== "N/A" ? poster : console.log("no image")} */}
						<img
							src={poster !== "N/A" ? poster : "/noimg.jpg"}
							alt={`Poster of ${movie} movie`}
						/>
						<div className="details-overview">
							<h2>{title}</h2>
							<p>
								{released !== "N/A" ? released : null}
								{runtime !== "N/A" ? <span>&bull; {runtime}</span> : null}
							</p>
							{genre !== "N/A" ? <p>{genre}</p> : null}
							{imdbRating !== "N/A" ? (
								<p>
									<span>⭐</span>
									{imdbRating} IMDb rating
								</p>
							) : null}
						</div>
					</header>

					<section>
						<div className="rating">
							{!isWatched ? (
								<>
									<StarRating
										maxRating={10}
										size={24}
										onSetRating={setUserRating}
									/>
									{userRating > 0 && (
										<button className="btn-add" onClick={handleAdd}>
											+ Add
										</button>
									)}
								</>
							) : (
								<p>
									<span>You rated this movie </span>

									<span>⭐ {watchedUserRating}</span>
								</p>
							)}
						</div>
						{plot !== "N/A" ? (
							<p>
								<em>{plot}</em>
							</p>
						) : null}
						{actors !== "N/A" ? <p>Starring {actors}</p> : null}
						{director !== "N/A" ? <p>Directed by {director}</p> : null}
					</section>
				</>
			)}
		</div>
	);
}

function WatchedSummary({ watched }) {
	const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
	const avgUserRating = average(watched.map((movie) => movie.userRating));
	const avgRuntime = average(watched.map((movie) => movie.runtime));
	return (
		<div className="summary">
			<h2>Movies you watched</h2>
			<div>
				<p>
					<span>#️⃣</span>
					<span>{watched.length} movies</span>
				</p>
				<p>
					<span>⭐️</span>
					<span>{avgImdbRating ? avgImdbRating.toFixed(2) : 0}</span>
				</p>
				<p>
					<span>🌟</span>
					<span>{avgUserRating.toFixed(2)}</span>
				</p>
				<p>
					<span>⏳</span>
					<span>{avgRuntime.toFixed(0)} min</span>
				</p>
			</div>
		</div>
	);
}

function WatchedMoviesList({ watched, onDeleteWatched }) {
	return (
		<ul className="list">
			{watched.map((movie) => (
				<WatchedMovie
					movie={movie}
					key={movie.imdbID}
					onDeleteWatched={onDeleteWatched}
				/>
			))}
		</ul>
	);
}

function WatchedMovie({ movie, onDeleteWatched }) {
	return (
		<li>
			<img
				src={movie.poster !== "N/A" ? movie.poster : "/noimg.jpg"}
				alt={`${movie.title} poster`}
			/>
			<h3>{movie.title}</h3>
			<div>
				{!movie.imdbRating || (
					<p>
						<span>⭐️</span>
						<span>{movie.imdbRating}</span>
					</p>
				)}
				<p>
					<span>🌟</span>
					<span>{movie.userRating}</span>
				</p>
				{!movie.runtime || (
					<p>
						<span>⏳</span>
						<span>{movie.runtime} min</span>
					</p>
				)}

				<button
					className="btn-delete"
					onClick={() => onDeleteWatched(movie.imdbID)}
				>
					X
				</button>
			</div>
		</li>
	);
}

function Loader() {
	return <p className="loader">Loading...</p>;
}

function ErrorMessage({ message }) {
	return (
		<p className="error">
			<span>⛔</span>
			{message}
		</p>
	);
}
