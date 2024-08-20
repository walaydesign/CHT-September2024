// 倒數秒數
var count = 3;
var limitSecond = 10;
// 獲得月餅數
var getNum = parseInt($(".getNum").text());
var runGame;

// 開始 -> 倒數
$(".btn-start").click(function(){
    $(".gameBox_bg").fadeOut(300);
    $(this).fadeOut(300);
    $(".start-count").fadeIn(300);
    startCount();
    scrollGame();
})

// 畫面回到正中間
function scrollGame() {
    var gameBoxTop = $(".gameBox").offset().top;
    var gameBoxHeightHalf = $(".gameBox").width() * 1.3 / 2;
    var windowHeightHalf = $(window).height() / 2;
    console.log("gameBoxTop=" + gameBoxTop + ",gameBoxHeightHalf=" + gameBoxHeightHalf + ",windowHeightHalf=" + windowHeightHalf);
    var scrollTop = gameBoxTop + gameBoxHeightHalf - windowHeightHalf;
    $("html,body").animate({ scrollTop: scrollTop }, parseInt(300));
}

// 隨機
function random(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

// 掉落物位置
function getPosition(){
    var length;
    var lengthNum = random(1, 5);
    if(lengthNum == 1) {
        length = 5;
    }else if(lengthNum == 2) {
        length = 25;
    }else if(lengthNum == 3) {
        length = 45;
    }else if(lengthNum == 4) {
        length = 65;
    }else if(lengthNum == 5) {
        length = 85;
    }

    return length;
}

// 倒數321
var countNum;
function startCount() {
    var countSecond;
    countSecond = count;
    var countActive = document.getElementById("count");
    var mainInit = document.getElementById("main-init");
    // var mainPlay = document.getElementById("main-play");
    countActive.innerHTML = countSecond;
    countActive.style.display = "block";
    mainInit.style.display = "block";
    // mainPlay.style.display = "none";

    countNum = window.setInterval(function () {
        countSecond -= 1;
        countActive.innerHTML = countSecond;
        if (countSecond === 0) {
            clearInterval(countNum);
            countActive.style.display = "none";
            mainInit.style.display = "none";
            // mainPlay.style.display = "block";

            limitTime();

            var record = new Array();
            runGame = setInterval(function(){
                for (i = 0; i < 3; i++) {
                    var position = getPosition();
                    record[i] = position;

                    if(i>0) {
                        while(record[i] == record[i-1]){
                            position = getPosition();
                            record[i] = position;
                        }
                    }   
                    if(i==2) {
                        while(record[i] == record[0]){
                            position = getPosition();
                            record[i] = position;
                            while(record[i] == record[1]){
                                position = getPosition();
                                record[i] = position;
                            }
                        }
                    }            
                    dropBox(position);
                }
            }, 1000);
        }
    }, 1000)
}

// 倒數10秒
var limitTimeNum;
var limitTimeSecond;
function limitTime() {

    clearInterval(limitTimeNum);
    limitTimeSecond = limitSecond;
    var limitTimeActive = document.getElementById("limitTime");
    limitTimeActive.innerHTML = limitTimeSecond;
    getNum = 0;
    $(".getNum").text("0");
    $(".woman").css("left","37.5%").removeClass("back");
    $(".sucess").hide();

    limitTimeNum = window.setInterval(function () {
        limitTimeSecond -= 1;
        limitTimeActive.innerHTML = limitTimeSecond;
        if (limitTimeSecond === 0) {
            clearInterval(limitTimeNum);
            clearInterval(runGame);
            if (getNum < 5) {
                fail();
            }
        }
    }, 1000);
}


// 左右移動
var btnLeft = document.getElementById("btn-left");
var btnRight = document.getElementById("btn-right");

var runFrom = 3;
var runTo = 72;
var offset;
var boxWidth = $(".drop-area").width();
var blanketRunLeft;
var blanketRunRight;

function blanketLeft(){
    clearInterval(blanketRunRight);
    blanketRunLeft = window.setInterval(function () {
        var old_left = parseInt($(".woman").css("left")) / boxWidth * 100;
        
        if (old_left <= runFrom) {
            offset = 0;
        } else {
            offset = 1;
        }

        old_left = old_left - offset;
        $(".woman").css("left",old_left + "%");

        // console.log("old_left=" + old_left);

        btnLeft.addEventListener('mouseup',function(){
            clearInterval(blanketRunLeft);
        });
        btnLeft.addEventListener('touchend',function(){
            clearInterval(blanketRunLeft);
        });
        btnLeft.addEventListener('click',function(){
            clearInterval(blanketRunLeft);
        });
    }, 20)
}

function blanketRight(){
    clearInterval(blanketRunLeft);
    blanketRunRight = window.setInterval(function () {
        var old_left = parseInt($(".woman").css("left")) / boxWidth * 100;
        // var new_left;

        if (old_left >= runTo) {
            offset = 0;
        }else {
            offset = 1;
        }

        console.log("old_left=" + old_left);
        
        old_left = old_left + offset;
        $(".woman").css("left", old_left + "%");
        btnRight.addEventListener('mouseup',function(){
            clearInterval(blanketRunRight);
        });
        btnRight.addEventListener('touchend',function(){
            clearInterval(blanketRunRight);
        });
        btnRight.addEventListener('click',function(){
            clearInterval(blanketRunRight);
        });
    }, 20)
}

btnLeft.addEventListener('mousedown',function(){
    blanketLeft();
    console.log("向左走");
});
btnLeft.addEventListener('touchstart',function(){
    blanketLeft();
    console.log("向左走");
});

btnRight.addEventListener('mousedown',function(){
    blanketRight();
    console.log("向右走");
});
btnRight.addEventListener('touchstart',function(){
    blanketRight();
    console.log("向右走");
});


// 東西掉落
function dropBox(position) {

    var thisBox;
    var thisBox = $("<div/>", {
        class: "fall",
        style: "left:" + position + "%;"
    });

    // 物品
    var boxNum = random(1, 10);
    if(boxNum >= 1 && boxNum <= 7) {
        thisBox.addClass("cookie");
        thisBox.append("<img src='./img/cookie.png'>")
    }else if(boxNum == 8) {
        thisBox.addClass("trash");
        thisBox.append("<img src='./img/trash.png'>")
    }else if(boxNum >= 9 ) {
        thisBox.addClass("lamp");
        thisBox.append("<img src='./img/lamp.png'>")
    }

    thisBox.css("left", position + "%");
    $("#main-play").append(thisBox);

    setTimeout(function () {
        thisBox.addClass("move");

        setTimeout(function () {
            var boxWidth = $(".drop-area").width();
            var thisWidth = thisBox.width() / boxWidth * 100 / 2;
            var womanWidth = $(".woman").width()/ boxWidth * 100;
            var blanketLeft = parseInt($(".woman").css("left")) / boxWidth * 100 - thisWidth;
            var blanketRight = blanketLeft + womanWidth;
            var fallLeft = parseInt(thisBox.css("left")) / boxWidth * 100;
            if(fallLeft >= blanketLeft && fallLeft <= blanketRight) {
                if(thisBox.hasClass("cookie")) {
                    getNum++;
                    $(".getNum").text(getNum);
                    thisBox.addClass("catch");
                    setTimeout(function () {
                        thisBox.removeClass("catch").hide();
                    },2000);
                    if(getNum >= 5) {
                        if(parseInt($(".limitTime").text()) > 0) {
                            $(".sucess").fadeIn(300);
                            clearInterval(limitTimeNum);
                            clearInterval(runGame);
                            $(".fall").each(function(){
                                $(this).remove();
                            });
                        }
                    }
                }else {
                    if(getNum < 5) {
                        fail();
                    }
                    setTimeout(function () {
                        thisBox.hide();
                    },200);
                }
            }else {
                thisBox.addClass("keepmove").removeClass("move");
                setTimeout(function () {
                    thisBox.hide();
                },200);
            }
        }, 2000);
    }, 1000);
}

function fail() {
    $(".fail").show();
    clearInterval(countNum);
    clearInterval(limitTimeNum);
    clearInterval(runGame);
    $(".gameBox").addClass("failgame");
    $(".fall").each(function(){
        $(this).remove();
    })
}

$(".container").click(function() {
    if($(".gameBox").hasClass("failgame")) {
        $(".gameBox").removeClass("failgame");
        $(".fail").hide();
        startCount();
    }
})

