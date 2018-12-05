g//APIキーの設定とSDKの初期化
var appKey    = ;
var clientKey = ;
var ncmb    　= new NCMB(appKey,clientKey);

// -------[Demo1]データをmBaaSに保存する -------//
function sendForm() {
        
    //ユーザーの入力したデータを変数にセットする
    var datetime = $("#form_datetime");                //日時
    var text    = $("#form_text").val();               //予定
    var time = $("#form_time").val();                   //時間
    var textarea  = $("#form_textarea").val();          //メモ書き
    var listA   = $("#form_listA").val();           //かてごりーA 
    var moneyA  = $("#form_moneyA").val();              //金額A
    var listB   = $("#form_listB").val();           //かてごりーB
    var moneyB  = $("#form_moneyB").val();              //金額B        
    
    //time,moneyA,moneyBを数値に変換
    var time = Number(time);
    var moneyA = Number(moneyA);
    var moneyB = Number(moneyB);

        
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

function checkPrefecture(){
    //データを変数にセット
    var prefecture = $("#form_datetime").val();
        
    //インスタンスの生成
    var saveData = ncmb.DataStore("SaveData");
        
    //データの取得
    saveData.order("createDate",true)
            .equalTo("datetime", datetime)
            .equalTo("text", text)
            .equalTo("time", time)
            .equalTo("textarea", textarea)
            .equalTo("income", listA)
            .equalTo("moneyA", moneyA)
            .equalTo("spending", listB)
            .equalTo("moneyB", moneyB)
            .fetchAll()
            .then(function(results){
                //日時の検索に成功した場合の処理
                console.log("日時の検索に成功しました："+results.length+"件");
                setData(results);
                $.mobile.changePage('#ListUpPage');
            })
            .catch(function(error){
                //日時の検索に失敗した場合の処理
                alert("日時の検索に失敗しました：\n" + error);
                console.log("日時の検索に失敗しました：\n" + error);
            });
}
