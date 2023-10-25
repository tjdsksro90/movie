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
        response.results.forEach(item => {
            addCard(item);
        });

    })
    .catch(err => {
        console.error(err);
        alert('에러가 발생했습니다. 고객센터에 문의바랍니다.');
    });

// 카드 추가 html
const cardHtml = function (card) {
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
let clickEvent = (id) => {
    alert('영화 ID : ' + id);
    const url = new URL(window.location.href);
    const urlParams = url.searchParams; // url.search = '?id={number}'
    const idParam = urlParams.get('id'); // 파라미터 아이디 가져오기
    window.location.href = url.origin + url.pathname + '?id='+ id; // 페이지 이동
}

// 검색 버튼 클릭 이벤트
function handleSearch(event){
    event.preventDefault(); // 브라우저 기본 동작 제어
    let search = document.getElementById("search-input").value.toLowerCase();
    let cardInner = document.querySelectorAll(".card");
    for (let i = 0; i < cardInner.length; i++) {
        let name = cardInner[i].children[1].innerText;
        if (name.toLowerCase().indexOf(search) != -1) {
            cardInner[i].classList.remove('displayNone_IM');
        } else {
            cardInner[i].classList.add('displayNone_IM');
        }
    }
    document.getElementById("search-input-live").value = document.getElementById("search-input").value;
    noResultFun();
}

// 검색 내용 지우기
function filterClear(){
    const btnClear = document.querySelector('.search-x-icon');
    const btnSearch = document.querySelector('.search-icon');
    const btnInput = document.querySelector('#search-input-live');

    btnInput.value = "";
    btnClear.classList.add('displayNone_IM');
    btnSearch.classList.remove('displayNone_IM');

    filter();
}

// 실시간 검색 search
function filter() {
    const btnClear = document.querySelector('.search-x-icon');
    const btnSearch = document.querySelector('.search-icon');
    const btnInput = document.querySelector('#search-input-live');
    
    if(btnInput.value == "") {
        btnClear.classList.add('displayNone_IM');
        btnSearch.classList.remove('displayNone_IM');
    } else {
        btnClear.classList.remove('displayNone_IM');
        btnSearch.classList.add('displayNone_IM');
        console.log()
    }

    let search = document.querySelector("#search-input-live").value.toLowerCase();
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
    document.getElementById("search-input").value = btnInput.value;
}

// 검색 결과 없을 때의 화면
function noResultFun(){
    let cardInner = document.querySelectorAll(".card");
    let noResult = document.querySelector('.no-result');

    for(var i=0;i<cardInner.length;i++){
        if(cardInner[i].classList.contains('displayNone_IM')){
            noResult.classList.remove('displayNone_IM');
        } else {
            noResult.classList.add('displayNone_IM');
            return;
        }
    }
}


///////////////////////////////////////////////// 리뷰 부분 

const movieId = getMovieIdFromURL(); // URL에서 영화 식별자를 가져오는 함수
// 현재 페이지의 URL에서 영화 식별자를 추출
function getMovieIdFromURL() { // URLSearchParams.toString()
    const url = new URL(window.location.href);
    const urlParams = url.searchParams; // url.search = '?id={number}'
    // ex) URL이 "http://example.com/movies?id=123"인 경우,
    const movieId = urlParams.get('id'); // 파라미터 아이디 가져오기
    return movieId;
}

// 페이지가 로드될 때 기존 댓글 불러오기
window.onload = function () {
    // 경로상 ?id=000 유무 파악으로 댓글 show/hide
    if(!(movieId == null || movieId == undefined)) loadComments();
    else document.getElementById('comment-form').closest('section').classList.add('displayNone_IM');

    // 댓글 작성 폼 제출 시 실행될 함수 // html 먼저 로드 되고 기능 구현
    document.getElementById('comment-form').onsubmit = function (e) {
        e.preventDefault();

        // 입력된 이름과 댓글 내용 가져오기
        let name = document.getElementById('name').value;
        let comment = document.getElementById('comment').value;
        let password = document.getElementById('password').value;

        // 댓글 객체 생성
        let newComment = {
            user: name,
            pass: password,
            review: comment,
        };

        // 기존 댓글 배열 가져오기
        let comments = getCommentsForMovie(movieId);

        // 새로운 댓글 추가
        comments.push(newComment);

        // 변경된 댓글 배열 저장
        setCommentsForMovie(movieId, comments)

        // 댓글 목록 다시 불러오기
        loadComments();

        // 폼 초기화
        document.getElementById('comment-form').reset();
    };
};

// 영화 식별자를 기반으로 해당 영화의 댓글을 가져옴
function getCommentsForMovie(movieId) {
    const commentsJSON = localStorage.getItem(`comments_${movieId}`);
    return commentsJSON ? JSON.parse(commentsJSON) : []; // JSON.parse = JSON 텍스트 문자열 -> JavaScript 객체
}

// 영화 식별자를 기반으로 해당 영화의 댓글을 설정
function setCommentsForMovie(movieId, comments) {
    localStorage.setItem(`comments_${movieId}`, JSON.stringify(comments)); // JSON.stringify = JavaScript 객체 -> JSON 텍스트 문자열
}

// 댓글 수정 폼
function editCommentAlert(idx){
    // json을 객채화
    const commentsJSON = JSON.parse(localStorage.getItem(`comments_${movieId}`));
    // 해당 comment의 비밀번호 확인
    const commentPassword = commentsJSON[idx].pass;
    // prompt 창으로 비밀번호 값 받기
    const editItem = prompt('비밀번호를 입력하세요', '');

    // 비밀번호 확인 후 수정
    if(editItem != commentPassword) {
        alert('비밀번호를 확인하세요.')
    } else {
        // 수정 될 코멘트에 value 값 가져오기
        const editComment = document.querySelector(`.commentEdit-${idx}`);
        editComment.value = document.querySelector(`.comment-edit-after-${idx}`).innerText;

        // 수정하는 화면 show / 수정삭제+기존코멘트 hide
        const editAfter = document.querySelectorAll(`.comment-edit-after-${idx}`);
        const editBefore = document.querySelectorAll(`.comment-edit-before-${idx}`);
        editAfter.forEach(item => item.classList.add('displayNone_IM'));
        editBefore.forEach(item => item.classList.remove('displayNone_IM'));
    }
}

// 댓글 수정 취소
function editCommentCancel(idx){
     // 수정하는 화면 hide / 수정삭제+기존코멘트 show
     const editAfter = document.querySelectorAll(`.comment-edit-after-${idx}`);
     const editBefore = document.querySelectorAll(`.comment-edit-before-${idx}`);
     editAfter.forEach(item => item.classList.remove('displayNone_IM'));
     editBefore.forEach(item => item.classList.add('displayNone_IM'));
}

// 댓글 수정
function editcommentFormoive(idx){
    const editComment = document.querySelector(`.commentEdit-${idx}`);
    // 빈값이면 막기
    if(editComment.value == '') {
        alert('수정될 내용을 기입해주세요.');
        return;
    }
    // json을 객채화
    const commentsJSON = JSON.parse(localStorage.getItem(`comments_${movieId}`));
    // 해당 요소 찾아서 수정
    commentsJSON[idx].review = editComment.value;
    // 해당 키 지우고 새롭게 입히기
    localStorage.removeItem(`comments_${movieId}`);
    localStorage.setItem(`comments_${movieId}`, JSON.stringify(commentsJSON))
    // 댓글 리로드
    loadComments();
}

// 댓글 삭제 알림창
function delCommentAlert(idx){
    // json을 객채화
    const commentsJSON = JSON.parse(localStorage.getItem(`comments_${movieId}`));
    // 해당 comment의 비밀번호 확인
    const commentPassword = commentsJSON[idx].pass;
    // prompt 창으로 비밀번호 값 받기
    const delItem = prompt('비밀번호를 입력하세요', '');

    // 비밀번호 확인 후 삭제
    if(delItem != commentPassword) alert('비밀번호를 확인하세요.')
    else delcommentFormoive(idx);
}

// 댓글 삭제 
function delcommentFormoive(idx) {
    // window.localStorage.removeItem(key) 사용시 배열 전부 삭제 되므로
    // 해당 value 찾아서 제외한 리스트 재할당

    // json을 객채화
    const commentsJSON = JSON.parse(localStorage.getItem(`comments_${movieId}`));
    // 해당 요소 제거
    commentsJSON.splice(idx, 1);
    // 해당 키 지우고 새롭게 입히기
    localStorage.removeItem(`comments_${movieId}`);
    localStorage.setItem(`comments_${movieId}`, JSON.stringify(commentsJSON))
    // 댓글 리로드
    loadComments();
}


// 댓글 목록 불러오기
function loadComments() {
    document.getElementById('comment-form').closest('.section').classList.remove('displayNone_IM');
    let commentList = document.getElementById('comment-list');
    commentList.innerHTML = '';

    let comments = getCommentsForMovie(movieId);

    for (let i = 0; i < comments.length; i++) {
        let comment = comments[i];

        let listItem = document.createElement('li');
        listItem.innerHTML = `
        <div class="comment-box">
            <span>${comment.user} : </span>
            <span class='comment-edit-after comment-edit-after-${i}'>${comment.review}</span>
        </div>
        <div class="comment-edit comment-edit-before comment-edit-before-${i} displayNone_IM">
            <textarea class="commentEdit commentEdit-${i}"></textarea>
            <button type="button" onclick="editCommentCancel(${i})">취소</button>
            <button type="button" onclick="editcommentFormoive(${i})">수정</button>
        </div>
        <div class="comment-more  comment-edit-after comment-edit-after-${i}">
            <button type="button" onclick="editCommentAlert(${i})">수정</button>
            <button type="button" onclick="delCommentAlert(${i})">삭제</button>
        </div>
        `
        commentList.appendChild(listItem);
    }
}

///////////////////////////////////////////////// !리뷰 부분!
