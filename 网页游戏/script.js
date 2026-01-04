// 1. 定义游戏数据：剧情节点、选项、线索（核心配置，可根据自己的剧情修改）
const gameData = {
    // 每个节点对应一个剧情场景，key为节点ID，value为场景详情
    nodes: {
        // 初始节点（必选）
        start: {
            title: "大学生登山失踪案",
            content: "你是一名私家侦探，接到委托：5名大学生结伴登山，其中一名叫林晓的女生离奇失踪。你抵达了登山营地，眼前是搭好的3顶帐篷，远处是悬崖和密林。现在，你要开始调查。",
            options: [
                {
                    text: "前往1号帐篷（林晓的帐篷）调查",
                    nextNode: "tent1", // 点击后跳转的下一个剧情节点
                    clue: null // 该选项不收集线索
                },
                {
                    text: "询问同行的男生（张伟）",
                    nextNode: "askZhang",
                    clue: null
                },
                {
                    text: "先查看营地附近的悬崖边",
                    nextNode: "cliff",
                    clue: null
                }
            ]
        },
        // 1号帐篷节点
        tent1: {
            title: "林晓的帐篷",
            content: "你走进林晓的帐篷，里面收拾得比较整齐，铺着粉色睡袋，旁边放着一个背包。你打开背包，发现里面有手机（已关机）、一瓶未喝完的矿泉水，还有一本笔记本。",
            options: [
                {
                    text: "查看笔记本（可能有线索）",
                    nextNode: "notebook",
                    clue: "林晓的日记：10月5日，大家好像在隐瞒什么，我发现了那个山洞的秘密..." // 收集这条线索
                },
                {
                    text: "尝试开机手机",
                    nextNode: "phone",
                    clue: null
                },
                {
                    text: "返回营地，选择其他调查方向",
                    nextNode: "start",
                    clue: null
                }
            ]
        },
        // 询问张伟节点
        askZhang: {
            title: "询问张伟",
            content: "张伟看起来有些紧张，他告诉你：“昨天晚上林晓说去方便，之后就再也没回来。我们找了一晚上，都没找到她。” 你观察到他的手指在微微颤抖。",
            options: [
                {
                    text: "追问他：“你是不是隐瞒了什么？”",
                    nextNode: "zhangAskMore",
                    clue: null
                },
                {
                    text: "不再追问，返回营地",
                    nextNode: "start",
                    clue: null
                }
            ]
        },
        // 悬崖边节点
        cliff: {
            title: "悬崖边",
            content: "你来到悬崖边，这里云雾缭绕，下方是深谷。你注意到悬崖边有一枚银色的发卡，看起来是女生的物品。",
            options: [
                {
                    text: "拾取银色发卡",
                    nextNode: "start",
                    clue: "悬崖边的银色发卡：款式老旧，刻着一个“林”字"
                },
                {
                    text: "小心靠近悬崖边缘查看",
                    nextNode: "cliffDanger",
                    clue: null
                },
                {
                    text: "返回营地",
                    nextNode: "start",
                    clue: null
                }
            ]
        },
        // 查看笔记本节点
        notebook: {
            title: "查看笔记本",
            content: "你翻开笔记本，里面记录着林晓的登山日常，最后一页的字迹潦草，只写了“山洞、他们、不要相信”几个字，后面的内容被撕掉了。",
            options: [
                {
                    text: "将笔记本收好，返回营地",
                    nextNode: "start",
                    clue: null // 线索已在点击选项时收集
                }
            ]
        },
        // 尝试开机手机节点
        phone: {
            title: "手机开机失败",
            content: "你尝试给手机充电（你随身携带了移动电源），但手机屏幕毫无反应，看起来是主板损坏了，无法获取任何信息。",
            options: [
                {
                    text: "放弃手机，返回营地",
                    nextNode: "start",
                    clue: null
                }
            ]
        },
        // 追问张伟节点
        zhangAskMore: {
            title: "张伟的反应",
            content: "面对你的追问，张伟情绪激动起来：“我没有隐瞒！你要是不信，就自己去调查！” 说完，他转身跑回了帐篷，不再理你。",
            options: [
                {
                    text: "不再理会他，返回营地",
                    nextNode: "start",
                    clue: null
                }
            ]
        },
        // 悬崖危险节点
        cliffDanger: {
            title: "危险！",
            content: "你过于靠近悬崖边缘，脚下的泥土松动，你险些摔下悬崖，幸好及时抓住了旁边的岩石。你不敢再冒险，赶紧退了回来。",
            options: [
                {
                    text: "心有余悸，返回营地",
                    nextNode: "start",
                    clue: null
                }
            ]
        }
    }
};

// 2. 全局变量：当前剧情节点、已收集的线索列表
let currentNodeId = "start"; // 初始节点为start
let collectedClues = [];

// 3. 获取页面元素
const sceneTitleEl = document.getElementById("scene-title");
const storyContentEl = document.getElementById("story-content");
const optionAreaEl = document.getElementById("option-area");
const clueListEl = document.getElementById("clue-list");

// 4. 初始化游戏：加载初始剧情
initGame();

// 5. 初始化函数
function initGame() {
    renderNode(currentNodeId); // 渲染当前剧情节点
    updateClueList(); // 更新线索栏
}

// 6. 核心函数：渲染指定剧情节点（标题、内容、选项）
function renderNode(nodeId) {
    // 获取当前节点数据
    const node = gameData.nodes[nodeId];
    if (!node) {
        alert("剧情节点不存在！");
        return;
    }

    // 更新标题和剧情内容
    sceneTitleEl.innerText = node.title;
    storyContentEl.innerText = node.content;

    // 清空之前的选项
    optionAreaEl.innerHTML = "";

    // 动态生成选项按钮
    node.options.forEach(option => {
        const btn = document.createElement("button");
        btn.className = "option-btn";
        btn.innerText = option.text;

        // 给按钮绑定点击事件
        btn.addEventListener("click", () => {
            // 若该选项有关联线索，且未收集过，则添加到线索列表
            if (option.clue && !collectedClues.includes(option.clue)) {
                collectedClues.push(option.clue);
                updateClueList(); // 更新线索栏
            }

            // 跳转到下一个剧情节点
            currentNodeId = option.nextNode;
            renderNode(currentNodeId);
        });

        // 将按钮添加到选项区
        optionAreaEl.appendChild(btn);
    });
}

// 7. 更新线索栏显示
function updateClueList() {
    if (collectedClues.length === 0) {
        clueListEl.innerText = "暂无线索";
        clueListEl.className = "clue-empty";
    } else {
        // 遍历线索列表，生成带编号的线索文本
        let clueHtml = "";
        collectedClues.forEach((clue, index) => {
            clueHtml += `${index + 1}. ${clue}<br>`;
        });
        clueListEl.innerHTML = clueHtml;
        clueListEl.className = "";
    }
}