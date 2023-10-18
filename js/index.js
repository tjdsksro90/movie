 // movie api (top movie) 가져오기
 const options = {
    method: 'GET',
    headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ZGRmNTgxNGU2ZTMyMjhhNTlmYjAzNGY0ZGIzYmIxYSIsInN1YiI6IjY1MmZhNTUzYTgwMjM2MDBjMzE2NjNlYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ._cJQ8IYoY6crqMv9gSH3HFxiIQYaippe29c1gtelVSk'
    }
};

fetch('https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1', options)
    .then(response => response.json())
    .then(response => {
        console.log(response.results);
        // https://image.tmdb.org/t/p/w500

        // original_title
        // overview

        //Rating  vote_average
    })
    .catch(err => {
        console.error(err);
        alert('에러가 발생했습니다. 고객센터에 문의바랍니다.');
    });
