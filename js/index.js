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
        // console.log(response.results);
        response.results.forEach((item, index) => {
            // console.log(item, index);
            addCard(item);
        });

    })
    .catch(err => {
        console.error(err);
        alert('에러가 발생했습니다. 고객센터에 문의바랍니다.');
    });

// 카드 추가 html
const cardHtml = function (card) {
    // console.log(card);
    let html = '';

    html = `
    <div class="card" id="${card.id}" onclick="clickEvent(${card.id})">
        <p class="card-img"><img src="https://image.tmdb.org/t/p/w500${card.poster_path}" alt="${card.original_title}"/></p>
        <p class="card-title">${card.original_title}</p>
        <p class="card-desc">${card.overview}</p>
        <p class="card-rating">Rating: <span class="rating">${card.vote_average}</span></p>
    </div>
    `;

    return html;
};

// 카드 추가 function
function addCard(card) {
    let html = '';
    html = cardHtml(card);
    document.getElementById('card-list').insertAdjacentHTML("beforeend", html); // afterbegin - 역순으로 배치할떄 이거
}

// 영화 id (화살표 함수)
let clickEvent = (id) => alert('영화 ID : ' + id);

// 검색 내용 지우기
function filterClear(){
    const btnClear = document.querySelector('.search-x-icon');
    const btnSearch = document.querySelector('.search-icon');
    const btnInput = document.querySelector('.search-input');

    btnInput.value = "";
    btnClear.classList.add('displayNone_IM');
    btnSearch.classList.remove('displayNone_IM');

    filter();
}

// 실시간 검색 search
function filter() {
    const btnClear = document.querySelector('.search-x-icon');
    const btnSearch = document.querySelector('.search-icon');
    const btnInput = document.querySelector('.search-input');
    
    if(btnInput.value == "") {
        btnClear.classList.add('displayNone_IM');
        btnSearch.classList.remove('displayNone_IM');
    } else {
        btnClear.classList.remove('displayNone_IM');
        btnSearch.classList.add('displayNone_IM');
    }

    let search = document.querySelector(".search-input").value.toLowerCase();
    let cardInner = document.querySelectorAll(".card");
    for (let i = 0; i < cardInner.length; i++) {
        let name = cardInner[i].children[1].innerText;
        if (name.toLowerCase().indexOf(search) != -1) {
            cardInner[i].classList.remove('displayNone_IM');
        } else {
            cardInner[i].classList.add('displayNone_IM');
        }
    }
    noResultFun();
}

// 검색 결과 없을 때의 화면
function noResultFun(){
    let cardInner = document.querySelectorAll(".card");
    let noResult = document.querySelector('.noResult');

    for(var i=0;i<cardInner.length;i++){
        if(cardInner[i].classList.contains('displayNone_IM')){
            noResult.classList.remove('displayNone_IM');
        } else {
            noResult.classList.add('displayNone_IM');
            return;
        }
    }
}