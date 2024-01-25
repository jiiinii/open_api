import { searchMarkup } from "./searchMarkup.js";
document.getElementById("library").innerHTML = searchMarkup;

const searchFormEl = document.querySelector("form");

const handleSubmit = (e) => {
  e.preventDefault();
  searchPost(1);
};

searchFormEl.addEventListener("submit", handleSubmit);

let pageNum;

const searchPost = (currentPage) => {
  let searchQuery = $(".search-entry").val();

  pageNum = 1;

  if (searchQuery == "") {
    $(".beforeResult").focus();
    return;
  }

  const inputGroup = document.querySelector(".input-group");
  const beforeResult = document.querySelector(".beforeResult");
  const loadingScreen = document.querySelector(".onStandby");
  const pageButton = document.querySelector(".pagingBlock");
  const booksEl = inputGroup.querySelector(".booksList");
  booksEl.innerHTML = "";

  const pageCal = 10;

  beforeResult.style.display = "none"; // 검색 실행 시 첫 화면 사라짐
  loadingScreen.style.display = "block";

  const greeting = () => {
    const rowsPerPage = 40; // 한 페이지당 n개씩 보여줄 것.

    $.ajax({
      method: "GET",
      url: `https://dapi.kakao.com/v3/search/book`,
      data: {
        query: searchQuery,
        page: currentPage, // 결과 페이지 번호, 1~50 사이의 값, 기본 값 1
        size: rowsPerPage, // 한 페이지에 보여질 문서 수, 1~50 사이의 값, 기본 값 10
        target: "",
        status: "",
      },
      headers: { Authorization: "KakaoAK 0c604b6d9932c79e6b756db42c60334b" },
      // 쿼리 파라미터 갯수 요청하기
    }).done((msg) => {
      console.log(msg);

      loadingScreen.style.display = "none";
      pageButton.style.display = "block"; // 페이지 버튼 출력

      if (msg.documents.length !== 0) {
        msg.documents.forEach((element) => {
          const booksLiEl = document.createElement("li");
          booksLiEl.className = "books";

          // 책 제목
          let bookTitleEl = "";
          if (element.title) {
            bookTitleEl =
              element.title.length > 25
                ? element.title.slice(0, 25) + "..."
                : element.title;
          }

          // 책 가격
          let bookPriceEl = "";
          if (element.price) {
            bookPriceEl = element.price;
          }

          booksLiEl.innerHTML = `${
            element.thumbnail === ""
              ? `<img class = "book-poster-none">`
              : `<img class = "book_poster" src="${element.thumbnail}" alt="${element.title}의 책 표지"/>`
          }
          <a class = 'info' bookId = "${element.isbn}"></a>`;

          booksEl.append(booksLiEl);
          inputGroup.append(booksEl);
        });
      } else {
        const noResults = document.createElement("p");
        noResults.className = "no_result";
        noResults.innerText =
          "The book could not be found T.T \n\n Try searching another keyword.";

        inputGroup.append(noResults);
        pageButton.style.display = "none";
      }

      // 페이지네이션 기능
      const rowsCount = msg.meta.total_count; // 총 검색 결과 수 (항목의 총 개수)
      const pageCount = Math.ceil(rowsCount / rowsPerPage); // 총 페이지 개수
      const numbers = document.querySelector("#numbers");

      let first = Math.floor((currentPage - 1) / pageCal) * 10 + 1;
      let last = first + 10 > pageCount ? pageCount + 1 : first + 10;

      numbers.innerHTML = "";

      if (first >= 11) {
        numbers.innerHTML += `<li class = "page_box"><a><</a></li>`;
      }

      for (var i = first; i < last; i++) {
        numbers.innerHTML += `<li class = "page_box"><a id= ${i}> ${i} </a></li>`;
      }

      if (last - first == 10 && last - 1 != pageCount) {
        numbers.innerHTML += `<li class = "page_box"><a>></a></li>`;
      }

      const numbersBtn = numbers.querySelectorAll("li"); // 페이지네이션 클릭
      displayRow(currentPage - 1);

      numbersBtn.forEach((item, idx) => {
        item.addEventListener("click", (e) => {
          e.preventDefault();

          //book list update
          booksEl.innerHTML = "";
          searchPost(idx + pageNum);
        });
      });

      // 페이지 버튼 클릭시 css적용
      function displayRow(idx) {
        let tmp = idx;

        if (idx >= 10) {
          const idxTmp = Math.floor(idx / 10);
          tmp = idx - 10 * idxTmp + 1;
          pageNum = idxTmp * 10;
        }

        if (numbersBtn.length > 0) {
          numbersBtn[tmp].classList.add("clicked");
        }
      }
    });
  };
  setTimeout(greeting, 500);
};