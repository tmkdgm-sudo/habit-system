// =================================
// ミニマム目標の確認画面
// =================================

// 今日の日付を取得
const minimumGoalToday = new Date();

const minimumGoalDateKey =
    minimumGoalToday.getFullYear() + "-" +
    String(minimumGoalToday.getMonth() + 1).padStart(2, "0") + "-" +
    String(minimumGoalToday.getDate()).padStart(2, "0");

// HTML要素を取得
const checkScreen =
    document.getElementById("check-screen");

const mainScreen =
    document.getElementById("main-screen");

const yesButton =
    document.getElementById("yes-button");

const noButton =
    document.getElementById("no-button");

// 今日すでに達成済みか確認
const completedDate =
    localStorage.getItem("minimumGoalCompletedDate");

if (completedDate === minimumGoalDateKey) {

    // 今日すでに「はい」を押していればメイン画面
    checkScreen.style.display = "none";
    mainScreen.style.display = "block";

} else {

    // まだ達成していなければ確認画面
    checkScreen.style.display = "flex";
    mainScreen.style.display = "none";
}


// 「はい」を押したとき
yesButton.addEventListener("click", function() {

    // 今日達成したことを保存
    localStorage.setItem(
        "minimumGoalCompletedDate",
        minimumGoalDateKey
    );

    // メイン画面へ移動
    checkScreen.style.display = "none";
    mainScreen.style.display = "block";
});


// 「いいえ」を押したとき
noButton.addEventListener("click", function() {

    // 確認画面にとどまる
});

// =================================
// 現在ポイントの管理
// =================================

// HTMLの要素を取得
const pointBalanceElement = document.getElementById("point-balance");
//const pointBalanceElement = document.getElementById("balance");

const pointAddInput = document.getElementById("point-add-input");
const pointMultiplier = document.getElementById("point-multiplier");
const pointAddButton = document.getElementById("point-add-button");

const pointUseInput = document.getElementById("point-use-input");
const pointUseButton = document.getElementById("point-use-button");

// 現在のポイント残高を取得
/*
let pointBalance = Number(
    pointBalanceElement.textContent.replace(/[^\d.-]/g, "")
);
*/

// 保存されているポイント残高を取得
const savedPointBalance = localStorage.getItem("pointBalance");

// 保存データがあればそれを使用し、なければHTMLの初期値を使用
let pointBalance;

if (savedPointBalance !== null) {
    pointBalance = Number(savedPointBalance);
} else {
    pointBalance = Number(
        pointBalanceElement.textContent.replace(/[^\d.-]/g, "")
    );
}

// 残高表示を更新する関数
function updatePointBalance() {
    // 画面の残高表示を更新
    pointBalanceElement.textContent =
        pointBalance.toLocaleString("ja-JP") + " Pt";

    // ブラウザに残高を保存
    localStorage.setItem("pointBalance", pointBalance);
}

// ページ読み込み時に保存された残高を画面に反映
updatePointBalance();

// ポイント追加ボタン
pointAddButton.addEventListener("click", function() {

    const amount = Number(pointAddInput.value);
    const multiplier = Number(pointMultiplier.value);

    // 入力チェック
    if (pointAddInput.value === "" || !Number.isSafeInteger(amount) || amount <= 0) {
        alert("追加するポイントを正しく入力してください。");
        return;
    }

    // 倍率を反映して加算
    pointBalance += amount * multiplier;

    // 画面を更新
    updatePointBalance();

    // 入力欄を空にする
    pointAddInput.value = "";
});


// ポイント消費ボタン
pointUseButton.addEventListener("click", function() {

    const amount = Number(pointUseInput.value);

    // 入力チェック
    if (pointUseInput.value === "" || !Number.isSafeInteger(amount) || amount <= 0) {
        alert("消費するポイントを正しく入力してください。");
        return;
    }

    // 残高チェック
    if (amount > pointBalance) {
        alert("ポイントが不足しています。");
        return;
    }

    // ポイントを減算
    pointBalance -= amount;

    // 画面を更新
    updatePointBalance();

    // 入力欄を空にする
    pointUseInput.value = "";
});

// =================================
// ポイント積み立ての管理
// =================================

// HTMLの要素を取得
const savingsBalanceElement = document.getElementById("savings-balance");
const savingsAddInput = document.getElementById("savings-add-input");
const savingsAddButton = document.getElementById("savings-add-button");
const savingsUseInput = document.getElementById("savings-use-input");
const savingsUseButton = document.getElementById("savings-use-button");

// 保存されている積立残高を取得
const savedSavingsBalance = localStorage.getItem("savingsBalance");

// 保存データがあればそれを使用し、なければHTMLの初期値を使用
let savingsBalance;

if (savedSavingsBalance !== null) {
    savingsBalance = Number(savedSavingsBalance);
} else {
    savingsBalance = Number(
        savingsBalanceElement.textContent.replace(/[^\d.-]/g, "")
    );
}

// 積立残高の表示を更新する関数
function updateSavingsBalance() {
    savingsBalanceElement.textContent =
        "現在の積立残高：" +
        savingsBalance.toLocaleString("ja-JP") + " Pt";

    localStorage.setItem("savingsBalance", savingsBalance);
}

// ページ読み込み時に残高を表示
updateSavingsBalance();

// 積立ポイントを追加するボタン
savingsAddButton.addEventListener("click", function() {

    const amount = Number(savingsAddInput.value);

    // 入力チェック
    if (savingsAddInput.value === "" ||
        !Number.isSafeInteger(amount) || amount <= 0) {
        alert("追加するポイントを正しく入力してください。");
        return;
    }

    // 通常ポイントの残高チェック
    if (amount > pointBalance) {
        alert("現在ポイントが不足しています。");
        return;
    }

    // 通常ポイントから積立ポイントへ移動
    pointBalance -= amount;
    savingsBalance += amount;

    // 両方の残高を更新・保存
    updatePointBalance();
    updateSavingsBalance();

    // 入力欄を空にする
    savingsAddInput.value = "";
});

// 積立ポイントを消費するボタン
savingsUseButton.addEventListener("click", function() {

    const amount = Number(savingsUseInput.value);

    // 入力チェック
    if (savingsUseInput.value === "" ||
        !Number.isSafeInteger(amount) || amount <= 0) {
        alert("消費するポイントを正しく入力してください。");
        return;
    }

    // 積立ポイントの残高チェック
    if (amount > savingsBalance) {
        alert("積立ポイントが不足しています。");
        return;
    }

    // 積立ポイントから通常ポイントへ移動
    savingsBalance -= amount;
    pointBalance += amount;

    // 両方の残高を更新・保存
    updatePointBalance();
    updateSavingsBalance();

    // 入力欄を空にする
    savingsUseInput.value = "";
});

// =================================
// 今月のお金の管理
// =================================

// 5つの予算項目を登録
const moneyItems = [
    {
        key: "moneyEating",
        balanceId: "money-eating-balance",
        inputId: "money-eating-input",
        buttonId: "money-eating-button"
    },
    {
        key: "moneyGas",
        balanceId: "money-gas-balance",
        inputId: "money-gas-input",
        buttonId: "money-gas-button"
    },
    {
        key: "moneyEntertainment",
        balanceId: "money-entertainment-balance",
        inputId: "money-entertainment-input",
        buttonId: "money-entertainment-button"
    },
    {
        key: "moneyTravel",
        balanceId: "money-travel-balance",
        inputId: "money-travel-input",
        buttonId: "money-travel-button"
    },
    {
        key: "moneyHomecoming",
        balanceId: "money-homecoming-balance",
        inputId: "money-homecoming-input",
        buttonId: "money-homecoming-button"
    }
];

// 各項目の管理
moneyItems.forEach(function(item) {

    // HTMLの要素を取得
    const balanceElement = document.getElementById(item.balanceId);
    const inputElement = document.getElementById(item.inputId);
    const buttonElement = document.getElementById(item.buttonId);

    // 保存されている残高を取得
    const savedBalance = localStorage.getItem(item.key);

    let balance;

    if (savedBalance !== null) {
        balance = Number(savedBalance);
    } else {
        balance = Number(
            balanceElement.textContent.replace(/[^\d.-]/g, "")
        );
    }

    // 残高表示と保存を行う関数
    function updateBalance() {

        balanceElement.textContent =
            balance.toLocaleString("ja-JP") + "円";

        localStorage.setItem(item.key, balance);
    }

    // ページ読み込み時に残高を反映
    updateBalance();

    // 「使う」ボタンの操作
    buttonElement.addEventListener("click", function() {

        const amount = Number(inputElement.value);

        // 入力チェック
        if (
            inputElement.value === "" ||
            !Number.isSafeInteger(amount) ||
            amount <= 0
        ) {
            alert("使用額を正しく入力してください。");
            return;
        }

        // 残高チェック
        if (amount > balance) {
            alert("予算の残高が不足しています。");
            return;
        }

        // 残高を減らす
        balance -= amount;

        // 画面と保存データを更新
        updateBalance();

        // 入力欄を空にする
        inputElement.value = "";
    });
});

// =================================
// お金の予算リセット管理
// =================================
const now_money = new Date();
const currentYear = now_money.getFullYear();
const currentMonth =
    currentYear + "-" + String(now_money.getMonth() + 1).padStart(2, "0");

const savedResetMonth =
    localStorage.getItem("moneyLastResetMonth");
const savedResetYear =
    localStorage.getItem("moneyLastResetYear");

// 月が変わった場合
if (
    savedResetMonth !== null &&
    savedResetMonth !== currentMonth
) {
    const monthlyItems = [
        { key: "moneyEating", id: "money-eating-balance", amount: 55000 },
        { key: "moneyGas", id: "money-gas-balance", amount: 5000 },
        { key: "moneyEntertainment", id: "money-entertainment-balance", amount: 20000 },
        { key: "moneyTravel", id: "money-travel-balance", amount: 20000 }
    ];

    monthlyItems.forEach(function(item) {
        const currentBalance = Number(localStorage.getItem(item.key));
        const newBalance = currentBalance + item.amount;

        localStorage.setItem(item.key, newBalance);
        document.getElementById(item.id).textContent =
            newBalance.toLocaleString("ja-JP") + "円";
    });
}

// 年が変わった場合
if (
    savedResetYear !== null &&
    savedResetYear !== String(currentYear)
) {
    const key = "moneyHomecoming";
    const currentBalance = Number(localStorage.getItem(key));
    const newBalance = currentBalance + 300000;

    localStorage.setItem(key, newBalance);
    document.getElementById("money-homecoming-balance").textContent =
        newBalance.toLocaleString("ja-JP") + "円";
}

// リセット年月を保存
localStorage.setItem("moneyLastResetMonth", currentMonth);
localStorage.setItem("moneyLastResetYear", currentYear);

// =================================
// 今週の時間管理
// =================================

// 現在の日付を取得
const now_time = new Date();

// 今週の日曜日の日付を取得
const sunday = new Date(now_time);

sunday.setDate(now_time.getDate() - now_time.getDay());

// 週の識別番号を作成（例：2026-11-01）
const currentWeekKey =
    sunday.getFullYear() + "-" +
    String(sunday.getMonth() + 1).padStart(2, "0") + "-" +
    String(sunday.getDate()).padStart(2, "0");

// 前回のリセット週を取得
const lastResetWeek =
    localStorage.getItem("timeLastResetWeek");

// 初回起動の場合
if (lastResetWeek === null) {

    // 現在の週を記録するだけ
    localStorage.setItem(
        "timeLastResetWeek",
        currentWeekKey
    );

} else if (lastResetWeek !== currentWeekKey) {

    // 週が変わっていたら初期時間を加算
    const youtubeBalance =
        Number(localStorage.getItem("youtubeBalance") ?? 270);

    const primeBalance =
        Number(localStorage.getItem("primeBalance") ?? 60);

    localStorage.setItem(
        "youtubeBalance",
        youtubeBalance + 270
    );

    localStorage.setItem(
        "primeBalance",
        primeBalance + 60
    );

    // 今週のリセット日を記録
    localStorage.setItem(
        "timeLastResetWeek",
        currentWeekKey
    );
}


// 時間管理項目
const timeItems = [
    {
        key: "youtubeBalance",
        balanceId: "youtube-balance",
        inputId: "youtube-input",
        buttonId: "youtube-button"
    },
    {
        key: "primeBalance",
        balanceId: "prime-balance",
        inputId: "prime-input",
        buttonId: "prime-button"
    }
];

timeItems.forEach(function(item) {

    const balanceElement =
        document.getElementById(item.balanceId);

    const inputElement =
        document.getElementById(item.inputId);

    const buttonElement =
        document.getElementById(item.buttonId);

    // 保存されている残り時間を取得
    const savedBalance = localStorage.getItem(item.key);

    let balance;

    if (savedBalance !== null) {
        balance = Number(savedBalance);
    } else {
        balance = Number(
            balanceElement.textContent.replace(/[^\d.-]/g, "")
        );
    }

    // 残り時間の表示・保存
    function updateBalance() {

        balanceElement.textContent = balance + "分";

        localStorage.setItem(item.key, balance);
    }

    // 初期表示
    updateBalance();

    // 使用ボタン
    buttonElement.addEventListener("click", function() {

        const amount = Number(inputElement.value);

        // 入力チェック
        if (
            inputElement.value === "" ||
            !Number.isSafeInteger(amount) ||
            amount <= 0
        ) {
            alert("使用する時間を正しく入力してください。");
            return;
        }

        // 残り時間チェック
        if (amount > balance) {
            alert("残り時間が不足しています。");
            return;
        }

        // 時間を減らす
        balance -= amount;

        updateBalance();

        // 入力欄を空にする
        inputElement.value = "";
    });

});

// =================================
// 日付・今日の状態・完全休養日管理
// =================================

// 現在の日付
const today = new Date();

// 日付を YYYY-MM-DD 形式にする
const todayKey =
    today.getFullYear() + "-" +
    String(today.getMonth() + 1).padStart(2, "0") + "-" +
    String(today.getDate()).padStart(2, "0");

// 現在の年月を YYYY-MM 形式にする
const currentMonthKey =
    today.getFullYear() + "-" +
    String(today.getMonth() + 1).padStart(2, "0");


// ---------------------------------
// 1. 日付の表示
// ---------------------------------

const dateElement =
    document.getElementById("today-date");

dateElement.textContent =
    today.getFullYear() + "年" +
    (today.getMonth() + 1) + "月" +
    today.getDate() + "日";


// ---------------------------------
// 2. 完全休養日の管理
// ---------------------------------

const restDaysElement =
    document.getElementById("rest-days");

// 保存されている残り日数を取得
let restDays = localStorage.getItem("restDays");

if (restDays === null) {

    // 初回起動時はHTMLに設定されている日数を使用
    restDays = Number(
        restDaysElement.textContent.replace(/[^\d.-]/g, "")
    );

} else {

    restDays = Number(restDays);
}


// 月初の付与処理
const lastRestResetMonth =
    localStorage.getItem("restLastResetMonth");

if (lastRestResetMonth === null) {

    // 初回起動時は記録だけ行う
    localStorage.setItem(
        "restLastResetMonth",
        currentMonthKey
    );

} else if (lastRestResetMonth !== currentMonthKey) {

    // 月が変わっていたら3日分を加算
    restDays += 3;

    localStorage.setItem(
        "restLastResetMonth",
        currentMonthKey
    );
}


// 残り日数を表示・保存
function updateRestDays() {

    restDaysElement.textContent = restDays + "日";

    localStorage.setItem("restDays", restDays);
}

updateRestDays();


// ---------------------------------
// 3. 今日の状態の管理
// ---------------------------------

const dayTypeElement =
    document.getElementById("day-type");

// 前回利用した日付
const lastActiveDate =
    localStorage.getItem("lastActiveDate");

if (lastActiveDate !== todayKey) {

    // 日付が変わったら未選択にする
    dayTypeElement.value = "";

    localStorage.setItem("dayType", "");

    localStorage.setItem("lastActiveDate", todayKey);

} else {

    // 同じ日なら保存された状態を復元
    const savedDayType =
        localStorage.getItem("dayType");

    dayTypeElement.value = savedDayType || "";
}

// ---------------------------------
// 4. 休養日の消費処理
// ---------------------------------

dayTypeElement.addEventListener("change", function() {

    const selectedType = dayTypeElement.value;

    // 今日の状態を保存
    localStorage.setItem("dayType", selectedType);

    // 「休養」を選択した場合
    if (selectedType === "休養") {

        const lastRestUsedDate =
            localStorage.getItem("restLastUsedDate");

        // 今日まだ休養日を消費していない場合
        if (lastRestUsedDate !== todayKey) {

            if (restDays <= 0) {

                alert("完全休養日の残り日数がありません。");

                // 状態を問題なしに戻す
                dayTypeElement.value = "問題なし";

                localStorage.setItem(
                    "dayType",
                    "問題なし"
                );

                return;
            }

            // 休養日を1日消費
            restDays--;

            updateRestDays();

            // 今日消費したことを記録
            localStorage.setItem(
                "restLastUsedDate",
                todayKey
            );
        }
    }
});