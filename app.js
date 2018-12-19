//APIキーの設定とSDKの初期化
var appKey    = "9aa7b3e3d9c2f85aa3093bdf734eef5b98f357e55c2191ac621871fdbf757430";
var clientKey = "c2c0df4210406c0b45155c416e7a8a4ce4df98124ea8dbe3f72342d53785538d";
var ncmb    　= new NCMB(appKey,clientKey);

function sendForm() {
        
    //ユーザーの入力したデータを変数にセットする
    var datetime = $("#form_datetime").val();                //日時
    var text    = $("#form_text").val();               //予定
    var time = $("#form_time").val();                   //時間
    var textarea  = $("#form_textarea").val();          //メモ書き
    var listA   = $("#form_listA").val();           //かてごりーA 
    var moneyA  = $("#form_moneyA").val();              //金額A
    var listB   = $("#form_listB").val();           //かてごりーB
    var moneyB  = $("#form_moneyB").val();              //金額B        
    
    //金額から","を取ってテキストに戻す
    var moneyA = parseInt(moneyA.split(',').join('').trim());
    var moneyB = parseInt(moneyB.split(',').join('').trim());

        
    //入力規則およびデータをフィールドにセットする
    if(datetime == ""){
        alert("日時が入力されていません")
    }else if(text == ""){
        alert("予定が入力されていません");
    }else if(time == ""){
        alert("時間が入力されていません");
    }else{
        //mBaaSに保存先クラスの作成
        var SaveData = ncmb.DataStore("SaveData");
            
        //インスタンスの生成
        var saveData = new SaveData();
            
        //インスタンスにデータをセットする
        saveData.set("datetime", datetime)
                .set("text", text)
                .set("time", time)
                .set("textarea", textarea)
                .set("income", listA)
                .set("moneyA", moneyA)
                .set("spending", listB)
                .set("moneyB", moneyB)
                .save()
                .then(function(results){
                    //保存に成功した場合の処理
                    alert("登録しました");
                    console.log("登録成功");
                    location.reload();
                })
                .catch(function(error){
                    //保存に失敗した場合の処理
                    alert("登録に失敗しました：\n" + error);
                    console.log("登録失敗：\n" + error);
                });
    }
}

function checkForm(){
    $("#formTable").empty();
        
    //インスタンスの生成
    var saveData = ncmb.DataStore("SaveData");
        
    //データを降順で取得する
    saveData.order("createDate", true)
            .fetchAll()
            .then(function(results){
                //全件検索に成功した場合の処理
                console.log("全件検索に成功しました："+results.length+"件");
                //テーブルにデータをセット
                setData(results);
            })
            .catch(function(error){
                //全件検索に失敗した場合の処理
                alert("全件検索に失敗しました：\n" + error);
                console.log("全件検索に失敗しました：\n" + error);
            });
}

function checkDate(divider){
    //データを変数にセット
    var datetime  = $("#search_date").val();
        
    //インスタンスの生成
    var saveData  = ncmb.DataStore("SaveData");
        
                saveData.order("createDate",true)
                        .equalTo("datetime",datetime)
                        .fetchAll()
                        .then(function(results){
                            //日付の検索に成功した場合の処理
                            console.log("日付の検索に成功しました："+results.length+"件");
                            setData(results);
                        })
                        .catch(function(error){
                            //日付の検索に失敗した場合の処理
                            alert("日付の検索に失敗しました：\n" + error);
                            console.log("日付の検索に失敗しました：\n" + error);
                        });
}
var income = [];
var moneyA = [];
var spending = [];
var moneyB = [];
function setData(results) {
    //操作するテーブルへの参照を取得
    var table = document.getElementById("formTable");
        for(i=0; i<results.length; i++) {
            var object   = results[i];
            var year     = object.get("createDate").slice(0,4);      //YYYYを取り出す
            var month    = object.get("createDate").slice(5,7);      //MMを取り出す
            var day      = object.get("createDate").slice(8,10);     //DDを取り出す            
            var hour     = object.get("createDate");                 //hhを取り出す
            var minute   = object.get("createDate").slice(14,16);    //mmを取り出す
                
            //hourが協定時間なので、現地時間（+09:00）となるようにする
            var datehour = new Date(hour);  //hourをDate型に変換
            var jsthour  = datehour.getHours();  //datehourを現地時間にする
            var jstDate  = "入力した時間：" +　year + "/" + month + "/" + day + " " + jsthour +":"+ minute;
                
            //テーブルに行とセルを設定
            var row      = table.insertRow(-1);
            var cell     = row.insertCell(-1);
                
            formTable.rows[i].cells[0].innerHTML = jstDate + "<br>" + "日時：" + object.get("datetime")+"<br>" +"予定："+object.get("text")+ "<br>"+"予定時間：" + object.get("time") + "<br>"+"収入金額：" + object.get("moneyA")+"<br>"+"支出金額：" + object.get("moneyB");
            moneyA[i] = object.get("moneyA")
            income[i] = object.get("income")
            moneyB[i] = object.get("moneyB")
            spending[i] = object.get("spending")
        }
       
    var searchResult = document.getElementById("searchResult");
    searchResult.innerHTML = "検索結果："+results.length+"件";
        
    //セットするデータが無かった場合
    if(results.length == 0){
        var table = document.getElementById("formTable");
        formTable.innerHTML = "<br>" + "<center>" + "データはありません" + "</center>" + "<br>";   
    }
    $.mobile.changePage('#ListUpPage');
}

//日付検索ボタン押下時の処理
function searchDate(){
    $("#formTable").empty();
    var datetime = $("#search_date").val();
        
        
    //Date型に変換
    var date = new Date(datetime);
        
    //フィールドの中から探す
    if(datetime == ""){
        alert("年月日を入力してください");                
    }else
        checkDate(datetime);
}
