"strict mode";
// import pdf from "html-pdf";
// ¸在远古时代，我们引入js文件一般使用<script src='路径'>来引入其他的js文件，但是随着js的规范化和模块化，在模块与模块之间的引入往往用import
// 如果在index.html不链接js文件 使用module的话 是不可以import 的哟
// 因为 jspdf使用了 export default 所以此时这里可以不加{}
import jsPDF from "jspdf";
// import引入一个依赖包，不需要相对路径。

/*  import 是否带{}的区别：导入的时候没有花括号
本质上，a.js文件的export default输出一个叫做default的变量，然后系统允许你引入的时候为它取任意名字。
也就输说默认的导出 */
import { marked } from "marked";
const testdata =
  "English Story:\n\nOnce upon a time, in a small village, there lived a **recalcitrant** boy named Jack. He was known for his rebellious nature and refusal to obey any rules. Jack's family was **opulent**, owning a big mansion and having luxurious cars.One day, a **malevolent** witch arrived in the village. She cast a curse, causing chaos and misfortune to everyone she encountered. The villagers were desperate and sought help from Jack, hoping his defiance could resist the witch's power.Jack agreed to take on the task. He set out on a journey to find a magical artifact that could **elicit** a positive force to counteract the witch's evil. Along the way, Jack **fumbled** upon a hidden treasure chest in a deep **gully**, which contained a variety of enchanted items. Using his **versatile** mind, Jack devised a plan to confront the witch. He would create a **figment** of his own malevolence, pretending to join forces with her. They met in an abandoned castle, and Jack presented an **invoice** to the witch for his allegiance.As the witch read the invoice, Jack performed a clever spell that imprisoned the witch in her own reflection. The curse was lifted, and the village was saved from the witch's **impeaching** power.Jack returned to the village as a hero, celebrated for his bravery and wit. His **recalcitrant** nature transformed into determination to protect his loved ones. From that day forward, his family's **opulence** was directed towards helping those in need. And Jack's story became a legend, inspiring everyone to embrace their own inner strength.中文翻译：很久很久以前，在一个小村庄里，住着一个叫杰克的**倔强的**男孩。他以叛逆的性格和拒绝遵守规则而闻名。杰克的家庭非常**富裕**，拥有一座大庄园和豪华车。一天，一位**邪恶的**女巫来到了村庄。她施放了一道诅咒，给遇到的每个人带来了混乱和不幸。村民们绝望地寻求杰克的帮助，希望他的反抗能够抵抗女巫的力量。杰克同意接受任务。他踏上了寻找一件能够**引出**正能量以对抗女巫邪恶的魔法物品的旅程。在路上，杰克在一个深深的**水沟**里**摸索**时发现了一个隐藏的宝匣，里面装满了各种有魔力的物品。凭借他**多才多艺**的头脑，杰克设计了一个计划来对抗女巫。他将制造出一个自己**编造的**邪恶形象，假装与女巫联合起来。他们在一座废弃的城堡里相遇，杰克向女巫**递交了**一份效忠的发票。当女巫阅读发票时，杰克施展了一个巧妙的咒语，将女巫困在了她自己的影子里。诅咒被解除，村庄被拯救免受女巫的**弹劾**之力。杰克作为英雄回到了村庄，因其勇敢和智慧而受到了庆祝。他**倔强的**天性转化为保护自己所爱的人的决心。从那天起，他家的**富裕**被用来帮助那些需要帮助的人。而杰克的故事成为了一个传说，激励每个人拥抱自己内心的力量。 词汇表：| English Word | 中文翻译 | 词性 | 例句 | |--------------|---------|-----|------|| recalcitrant | 倔强的  | adj | The recalcitrant child refused to listen to his parents. || opulent      | 富裕的  | adj | The opulent mansion was filled with expensive furniture. | | impeach      | 弹劾    | v   | The politician was impeached for corruption. || malevolent   | 邪恶的  | adj | The malevolent witch cast a spell on the village. || elicit       | 引出    | v   | The detective tried to elicit information from the witness. || fumble       | 摸索    | v   | He fumbled around in the dark, searching for his keys. || gully        | 水沟    | n   | The heavy rain caused the gully to overflow. || versatile    | 多才多艺的 | adj | She is a versatile actress who can perform in both comedy and drama. || figment      | 编造的  | n   | The monster in her nightmare was just a figment of her imagination. || invoice      | 发票    | n   | The shopkeeper gave me an invoice for my purchase. |";

const storyContent = document.querySelector(".storyContent");
const wordContent = document.querySelector(".wordContent");
const wordSearchContent = document.getElementById("wordSearchContent");
const multipleWords = document.getElementById("multipleWord");
const generateButton = document.querySelector(".generateButton");
const exportButton = document.querySelector(".exportButton");
const wordSearchButton = document.querySelector(".wordSearchButton");
const API = "http://localhost:8081/";
const spinnerHTML = '<div class="spinner-border text-primary"></div>';
let gptData = "";

// 导出
exportButton.addEventListener("click", function () {
  if (gptData === "") {
    renderPageInMDForm(storyContent, "暂无导出数据");
  } else {
    const doc = new jsPDF();
    doc.text(gptData, 1, 1);
    doc.save("outport.pdf");
  }
});

//生成故事
generateButton.addEventListener("click", async function () {
  //渲染spinner
  renderSpinner(storyContent);

  //得到 text中的数据
  const words = multipleWords.value;
  // 请求接口 得到String类型的数据
  // const storyGenerateByGPT = await getJSON(
  //   `${API}generateStoryByWords?words=${words}`
  // );
  // 清除spinner
  clearSpinner(storyContent);

  //判断是否成功
  // const renderdata = getRenderResult(storyGenerateByGPT);
  // const testdata = getRenderResult(storyGenerateByGPT);
  //全局赋值
  gptData = testdata;
  //渲染数据
  renderPageInMDForm(storyContent, testdata);
});

//搜索功能
wordSearchButton.addEventListener("click", async function () {
  //渲染spinner
  renderSpinner(wordContent);
  //得到单词搜索输入框 的内容
  const searchContent = wordSearchContent.value;
  //fetch请求
  const explainByDiction = await getJSON(
    `${API}generateWordExplanation/?word=${searchContent}`
  );
  //清除spinner
  clearSpinner(wordContent);
  const renderdata = getRenderResult(explainByDiction);
  //渲染数据
  renderPageInMDForm(wordContent, renderdata);
});

// 以md格式渲染界面
const renderPageInMDForm = function (domItem, renderdata) {
  // 先清空东西
  clearSpinner(domItem);
  //然后渲染
  domItem.innerHTML = marked.parse(renderdata);
};

// 渲染加载框
const renderSpinner = function (domItem) {
  //先清空
  clearSpinner(domItem);
  domItem.insertAdjacentHTML("afterbegin", spinnerHTML);
};

// 清除加载框
const clearSpinner = function (domItem) {
  domItem.innerHTML = "";
};

// TODO 后端的错误边界没有去区分 需要自行实现 当前没有去分正确和错误的情况
// 判断数据是否成功
const getRenderResult = function (parsingData) {
  if (parsingData.result.code === 200) {
    return parsingData.result.result;
  }
  return parsingData.result.result;
};

//fetch 数据
const getJSON = async function (url) {
  try {
    const res = await fetch(url);

    const data = await res.json();

    if (!res.ok) alert(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};
