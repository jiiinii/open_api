import { searchMarkup } from "./searchMarkup.js";
import uiBase from "./searchUI.js";
import * as searchFunction from "./searchFunction.js";
import { handlePushState } from "../Page/handlePushState.js";
import { urlConnectPage } from "../Page/urlConnectPage.js";

const rowsPerPage = 40; // 한 페이지당 n개씩 보여줄 것.

const render = (keyword, page) => {
  document.getElementById("library").innerHTML = searchMarkup;

  const logoEl = document.querySelector(".logo");
  const searchFormEl = document.querySelector("form");

  const handleSubmit = (e) => {
    e.preventDefault();
    searchPost(1);
  };

  searchFormEl.addEventListener("submit", handleSubmit);

  const firstToScreen = () => {
    const inputGroup = document.querySelector(".inputGroup");
    const beforeResult = document.querySelector(".beforeResult");
    const pageButton = document.querySelector(".pagingBlock");
    const loadingScreen = document.querySelector(".onStandby");
    const noResult = document.querySelector(".noResult");
    const booksEl = inputGroup.querySelector(".booksList");

    booksEl.innerHTML = "";
    pageButton.style.display = "none";
    noResult.style.display = "none";
    beforeResult.style.display = "none"; // 검색 실행 시 첫 화면 사라짐
    loadingScreen.style.display = "block";
  };

  const searchPost = (currentPage) => {
    let searchQuery = keyword ? keyword : $(".search-entry").val(); // 검색어 출력
    console.log("searchQuery >>> ", searchQuery);
    urlConnectPage(searchQuery, `/${searchQuery}/`, currentPage);
  };

  if (keyword) {
    firstToScreen();
    let pageNum;

    const loading = () => {
      $.ajax({
        method: "GET",
        url: `https://dapi.kakao.com/v3/search/book`,
        data: {
          query: keyword,
          page: page, // 결과 페이지 번호, 1~50 사이의 값, 기본 값 1
          size: rowsPerPage, // 한 페이지에 보여질 문서 수, 1~50 사이의 값, 기본 값 10
          target: "",
          status: "",
          async: true,
        },
        headers: { Authorization: "KakaoAK 0c604b6d9932c79e6b756db42c60334b" },
        // 쿼리 파라미터 갯수 요청하기
      }).done((msg) => {
        console.log(msg);
        const numbers = document.querySelector("#numbers");
        numbers.innerHTML = "";

        uiBase(msg, page, rowsPerPage);

        const numbersBtn = numbers.querySelectorAll("li"); // 페이지네이션 클릭
        pageNum = searchFunction.movePageBtn(page - 1); // idx >= 10 일 때 페이지 버튼이 옮겨지도록 작동

        if (numbersBtn.length > 0) {
          numbersBtn[searchFunction.clickedNumBtn(page - 1)].classList.add(
            "clicked"
          );
        }

        numbersBtn.forEach((item, idx) => {
          item.addEventListener("click", (e) => {
            e.preventDefault();
            searchPost(idx + pageNum);
          });
        });
      });
    };
    setTimeout(loading, 500);
  }
  handlePushState(logoEl, "/");
};

export default render;