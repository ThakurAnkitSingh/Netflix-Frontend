import {
    configureStore,
    createAsyncThunk,
    createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";
import { API_KEY, TMBD_BASE_URL } from '../utils/constant'

const initialState = {
    movies: [],
    genresLoaded: false,
    genres: [],
};

export const getGenres = createAsyncThunk("netflix/genres", async () => {
    const {
        data: { genres },
    } = await axios.get(
        `${TMBD_BASE_URL}/genre/movie/list?api_key=${API_KEY}`
    );
    // console.log(genres, "====================")
    return genres;
});

const createArrayFromRawData = (array, moviesArray, genres) => {
    // console.log(array, "array")
    array.forEach((movie) => {
        // console.log(movie, "array")
        // console.log(movie.genre_ids, "genre_ids")
        const movieGenres = [];
        movie.genre_ids.forEach((genre) => {
            const name = genres.find(({ id }) => id === genre);
            if (name) movieGenres.push(name.name);
        });
        if (movie.backdrop_path)
            moviesArray.push({
                id: movie.id,
                name: movie?.original_name ? movie.original_name : movie.original_title,
                image: movie.backdrop_path,
                genres: movieGenres.slice(0, 3),
            });
    });
};

const getRawData = async (api, genres, paging = false) => {
    const moviesArray = [];
    for (let i = 1; moviesArray.length < 60 && i < 10; i++) {
        const {
            data: { results },
        } = await axios.get(`${api}${paging ? `&page=${i}` : ""}`);
        createArrayFromRawData(results, moviesArray, genres);
    }
    // console.log(moviesArray, "=======moviesArray")
    return moviesArray;
};

export const fetchDataByGenre = createAsyncThunk(
    "netflix/genre",
    async ({ genre, type }, thunkAPI) => {
        const {
            netflix: { genres },
        } = thunkAPI.getState();
        // console.log(data, "data")
        // console.log(genre, "genre")
        // console.log(genres, "genres")
        // console.log(type, "type")
        return getRawData(
            `${TMBD_BASE_URL}/discover/${type}?api_key=${API_KEY}&with_genres=${genre}`,
            genres
        );
    }
);



// type is from genres destructure and thunkApi it will give the current state of genres

export const fetchMovies = createAsyncThunk(
    "netflix/trending",
    async ({ type }, thunkAPI) => {
        const {
            netflix: { genres },
        } = thunkAPI.getState();

        // console.log(genres, "====")
        // netflix/ genre,genreLoaded/movies
        // it will give all the states and get the genres out of there.

        return getRawData(
            `${TMBD_BASE_URL}/trending/${type}/week?api_key=${API_KEY}`,
            // we are getting the movies by genres and latest trending movies in the week
            genres,
            true
        );
    }
);



// export const getUsersLikedMovies = createAsyncThunk(
//     "netflix/getLiked",
//     async (email) => {
//         const {
//             data: { movies },
//         } = await axios.get(`http://localhost:5000/api/user/liked/${email}`);
//         return movies;
//     }
// );

// export const removeMovieFromLiked = createAsyncThunk(
//     "netflix/deleteLiked",
//     async ({ movieId, email }) => {
//         const {
//             data: { movies },
//         } = await axios.put("http://localhost:5000/api/user/remove", {
//             email,
//             movieId,
//         });
//         return movies;
//     }
// );

const NetflixSlice = createSlice({
    name: "Netflix",
    initialState,
    extraReducers: (builder) => {
        builder.addCase(getGenres.fulfilled, (state, action) => {
            state.genres = action.payload;
            state.genresLoaded = true;
            // when genres is loaded then on that basis we have to call or fetch the movies(true).
        });
        builder.addCase(fetchMovies.fulfilled, (state, action) => {
            state.movies = action.payload;
            // status = fulfilled
        });
        builder.addCase(fetchDataByGenre.fulfilled, (state, action) => {
            state.movies = action.payload;
        });
        // builder.addCase(getUsersLikedMovies.fulfilled, (state, action) => {
        //     state.movies = action.payload;
        // });
        // builder.addCase(removeMovieFromLiked.fulfilled, (state, action) => {
        //     state.movies = action.payload;
        // });
    },
});

export const store = configureStore({
    reducer: {
        netflix: NetflixSlice.reducer,
    },
});

export const { setGenres, setMovies } = NetflixSlice.actions;