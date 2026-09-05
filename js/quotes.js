const quotes = [
  { quote: "시작이 반이다.", author: "EunGyo 0" },
  { quote: "오늘의 노력이 내일의 실력이 된다.", author: "EunGyo 1" },
  { quote: "천 리 길도 한 걸음부터.", author: "EunGyo 2" },
  { quote: "배움에는 끝이 없다.", author: "EunGyo 3" },
  { quote: "실패는 성공의 어머니다.", author: "EunGyo 4" },
  { quote: "작은 습관이 큰 변화를 만든다.", author: "EunGyo 5" },
  { quote: "행동이 생각을 현실로 만든다.", author: "EunGyo 6" },
  { quote: "기회는 준비된 자에게 온다.", author: "EunGyo 7" },
  { quote: "포기하지 않는 사람이 결국 해낸다.", author: "EunGyo 8" },
  { quote: "어제보다 나은 오늘을 만들어라.", author: "EunGyo 9" },
];

const quote = document.querySelector("#quote span:first-child");
const author = document.querySelector("#quote span:last-child");
const todaysQuote = quotes[Math.floor(Math.random() * quotes.length)];

quote.innerText = todaysQuote.quote;
author.innerText = todaysQuote.author;
