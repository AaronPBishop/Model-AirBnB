import { csrfFetch } from "./csrf";

const initialState = {};

export const createReview = (review) => {
    return {
        type: 'CREATE_REVIEW',
        payload: review
    };
};

export const toggleEditMode = (boolean, reviewId) => {
    return {
        type: 'EDIT_REVIEW',
        payload1: boolean,
        payload2: reviewId
    };
};

export const addTempReviewImg = (url, preview) => {
    return {
        type: 'ADD_TEMP_REVIEW_IMG',
        payload1: url,
        payload2: preview
    };
};

export const addReviewImages = (url, preview, reviewId) => {
    return {
        type: 'ADD_REVIEW_IMAGES',
        payload1: url,
        payload2: preview,
        payload3: reviewId
    };
};

export const deleteReview = (reviewId) => {
    return {
        type: 'DELETE_REVIEW',
        payload: reviewId
    };
};

export const submittedReview = (boolean) => {
    return {
        type: 'SUBMITTED_REVIEW',
        payload: boolean
    };
};

export const fetchSpotReviews = (spotId) => async (dispatch) => {
    const fetchReq = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: 'GET'
    });

    const fetchJSON = await fetchReq.json();
    const data = [fetchJSON];
    
    data.forEach(review => review.Reviews.forEach((obj => dispatch(createReview(obj)))));    
};

export const fetchUserReviews = () => async (dispatch) => {
    const fetchReq = await csrfFetch(`/api/reviews/current`, {
        method: 'GET'
    });

    const fetchJSON = await fetchReq.json();
    const data = [fetchJSON];
    
    data.forEach(review => review.Reviews.forEach((obj => dispatch(createReview(obj)))));    
};

export const createSpotReview = (review, spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(review)
    });
    
    dispatch(createReview(review));

    const newReview = response.json();
    return newReview;
};

export const editSpotReview = (review, reviewId) => async (dispatch) => {
    await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(review)
    });
    
    dispatch(createReview(review));
};

export const createReviewImage = (url, preview, reviewId) => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/${reviewId}/images`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({url, preview})
    });

    const newReview = await response.json();

    dispatch(createReview(newReview));
};

export const deleteReviewData = (reviewId) => async (dispatch) => {
    await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE'
    });
    
    dispatch(deleteReview(reviewId));
};

const reviewsReducer = (state = initialState, action) => {
    const currentState = { ...state };

    switch (action.type) {
        case 'CREATE_REVIEW': {
            currentState[action.payload.id] = action.payload;
            
            return currentState;
        };

        case 'EDIT_REVIEW': {
            currentState['editMode'] = {boolean: action.payload1, reviewId: action.payload2};

            return currentState;
        };

        case 'ADD_TEMP_REVIEW_IMG': {
            const ReviewImages = {url: action.payload1, preview: action.payload2};

            currentState['CurrentReviewImgs'] = ReviewImages;

            return currentState;
        };

        case 'ADD_REVIEW_IMAGES': {
            currentState[action.payload3] = {url: action.payload1, preview: action.payload2};

            return currentState;
        };

        case 'DELETE_REVIEW': {
            delete currentState[action.payload];

            return currentState;
        };

        case 'SUBMITTED_REVIEW': {
            if (currentState['editMode']) delete currentState['editMode'];
            if (currentState['CurrentReviewImgs']) delete currentState['CurrentReviewImgs'];
            if (currentState['undefined']) delete currentState['undefined'];
            
            currentState['submitted'] = action.payload;

            return currentState;
        };

        default: return currentState;
    };
};

export default reviewsReducer;