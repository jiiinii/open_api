//검색창에 엔터 치면 결과가 나오도록 함
// searchPost()실행
window.enterkeySearch = () => {
    if (window.event.keyCode == 13) {
        searchPost();
    }
};

window.searchPost = () => {
    console.log(`searchPost`);
    $('#input-group').empty();
    let searchQuery = $('.search-entry').val();
    console.log(`searchQuery :  ` + searchQuery);

    const inputGroup = document.querySelector(".input-group");
    inputGroup.innerHTML = "";

    const booksEl = document.createElement('ul');
    booksEl.className = 'booksList';

    for (let test = 1; test < 3; test++) {
        $.ajax({
            method: "GET",
            url: `https://dapi.kakao.com/v3/search/book`,
            data: {
                query: searchQuery,
                page: test, // 결과 페이지 번호, 1~50 사이의 값, 기본 값 1
                size: 50, // 한 페이지에 보여질 문서 수, 1~50 사이의 값, 기본 값 10
                target: "",
                status: ""
            },
            headers: { Authorization: "KakaoAK 0c604b6d9932c79e6b756db42c60334b" },
            // 쿼리 파라미터 갯수 요청하기

        })
            .done((msg) => {
                console.log(msg);
                for (var i = 0; i < msg.documents.length; i++) {
                    tmp = `${msg.documents.length && msg.documents[i].thumbnail === ""
                        ? `<li class = "books"><img class = "book-poster-none"></img></li>`
                        : `<li class = "books"><img class = "book_poster" src="${msg.documents[i].thumbnail}"/></li>`
                        }`
                    inputGroup.innerHTML += tmp;
                } // 2                 
            });
    }
    inputGroup.append(booksEl);
}