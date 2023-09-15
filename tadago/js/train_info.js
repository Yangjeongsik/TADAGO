const dep = document.getElementById("dep");
const arr = document.getElementById("arr");
const depDate = document.getElementById("depDate");
const arrDate = document.getElementById("arrDate");


depDate.onfocus = function (event) {
    this.type = 'datetime-local';
    this.focus();
}
arrDate.onfocus = function (event) {
    this.type = 'datetime-local';
    this.focus();
}
depDate.addEventListener('blur',() => {
    if( depDate.value.length < 1 ){
        depDate.type = 'text';
        depDate.placeholder = '가는날';
    }
})
arrDate.addEventListener('blur',() => {
    if( arrDate.value.length < 1 ){
        arrDate.type = 'text';
        arrDate.placeholder = '오는날';
    }
})

function train_info_finding() {
    document.getElementById("trnDepPlace").innerHTML = "";
    document.getElementById("trnDepPlandTime").innerHTML = "";
    document.getElementById("trnArrPlace").innerHTML = "";
    document.getElementById("trnArrPlandTime").innerHTML = "";
    document.getElementById("trnCharge").innerHTML = "";
    document.getElementById("trnGrade").innerHTML = "";

    for(l = 0; l <= 18; l++) {

        var train_info = new XMLHttpRequest();
        var url = 'http://apis.data.go.kr/1613000/TrainInfoService/getStrtpntAlocFndTrainInfo'; /*URL*/
        var queryParams = '?' + encodeURIComponent('serviceKey') + '='+'pchfJ%2FDYOYMI%2ByArZsx5QF%2Bod4LQbfdYMRJdfwqFejZMhXWqPdJxJr3MkiGEgKal0R%2Ftj68F9MXyZrTbErlUHQ%3D%3D'; /*Service Key*/
        queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /**/
        queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10'); /**/
        queryParams += '&' + encodeURIComponent('_type') + '=' + encodeURIComponent('xml'); /**/
        queryParams += '&' + encodeURIComponent('depPlaceId') + '=' + encodeURIComponent(dep.value); /**/
        queryParams += '&' + encodeURIComponent('arrPlaceId') + '=' + encodeURIComponent(arr.value); /**/
        queryParams += '&' + encodeURIComponent('depPlandTime') + '=' + encodeURIComponent(parseInt(depDate.value.replace('-','').replace('-',''))); /**/
        if ( l < 10 ) {
            queryParams += '&' + encodeURIComponent('trainGradeCode') + '=' + encodeURIComponent('0' + l);
        } else {
            queryParams += '&' + encodeURIComponent('trainGradeCode') + '=' + encodeURIComponent(l);
        }

        // queryParams += '&' + encodeURIComponent('trainGradeCode') + '=' + encodeURIComponent('0' + l); /**/
        train_info.open('GET', url + queryParams);
        train_info.onreadystatechange = function () {
            if (this.readyState == 4) {
                // alert('Status: '+this.status+'nHeaders: '+JSON.stringify(this.getAllResponseHeaders())+'nBody: '+this.responseText);
                train_info_reading(this);
            };
        };
        train_info.send('');
    }
};


function train_info_reading( xml ) {
    let arrPl, arrPlTm, chrg, depPl, depPlTm, gradeN; 
    //순서대로 도착지, 도착시간, 요금, 출발지, 출발시간, 버스등급
    let arrPltxt, arrPlTmtxt, chrgtxt, depPltxt, depPlTmtxt, gradeNtxt, xmlDoc;
    //순서대로 도착지, 도착시간, 요금, 출발지, 출발시간, 버스등급 입력 받을 텍스트 공간
    arrPltxt = arrPlTmtxt = chrgtxt = depPltxt = depPlTmtxt = gradeNtxt = '';
    //텍스트 공간 비우기
    xmlDoc = xml.responseXML;
    arrPl = xmlDoc.getElementsByTagName("arrplacename");
    arrPlTm = xmlDoc.getElementsByTagName("arrplandtime");
    chrg = xmlDoc.getElementsByTagName("adultcharge");
    depPl = xmlDoc.getElementsByTagName("depplacename");
    depPlTm = xmlDoc.getElementsByTagName("depplandtime");
    gradeN = xmlDoc.getElementsByTagName("traingradename");
    console.log("hi")
    //고속버스api 내 태그들을 불러옴
    if(depPlTm.length > 0){
        // //검색결과가 있을 경우
        // let max = 0;
        // for(j=0; j < depPlTm.length; j++){
        //     if(parseInt(depPlTm[j].childNodes[0].nodeValue) < parseInt(depDate.value.replace('-','').replace('-','').replace('T','').replace(':',''))){
        //         if( depPlTm[j].childNodes[0].nodeValue > max ){
        //             max = j;
        //         }
        //     }        
        // }
        // //버스시간이 출발하고자 하는 시간보다 이를 경우, 해당 노드의 번호를 최대값에 저장합니다
        // for(k=0; k <= max; k++){
        //     depPlTm[max-k].parentNode.remove();
        // }
        // //최대값 이하의 노드를 전부 제거합니다
        // max = 0;
        // //최대값을 초기화합니다
        
        for(i=0; i < arrPl.length; i++){
            crtrnDep(i);
            crtrnDepPl(i);
            crtrnArr(i);
            crtrnArrpPl(i);
            crtrnCr(i);
            crtrnGr(i);
        }
        function crtrnDep(i) {
            obj = document.getElementById("trnDepPlace");
            newDiv = document.createElement("div");
            newDiv.innerHTML = depPl[i].childNodes[0].nodeValue;
            newDiv.setAttribute("class", "trn_info_list");
            obj.appendChild(newDiv);
        }
        function crtrnDepPl(i) {
            obj = document.getElementById("trnDepPlandTime");
            newDiv = document.createElement("div");
            newDiv.innerHTML = depPlTm[i].childNodes[0].nodeValue.substr(8,2) + "시" + depPlTm[i].childNodes[0].nodeValue.substr(10,2) + "분";
            newDiv.setAttribute("class", "train_info_list");
            obj.appendChild(newDiv);

        }
        function crtrnArr(i) {
            obj = document.getElementById("trnArrPlace");
            newDiv = document.createElement("div");
            newDiv.innerHTML = arrPl[i].childNodes[0].nodeValue;
            newDiv.setAttribute("class", "train_info_list");
            obj.appendChild(newDiv);
        }
        function crtrnArrpPl(i) {
            obj = document.getElementById("trnArrPlandTime");
            newDiv = document.createElement("div");
            newDiv.innerHTML = arrPlTm[i].childNodes[0].nodeValue.substr(8,2) + "시" + arrPlTm[i].childNodes[0].nodeValue.substr(10,2) + "분";
            newDiv.setAttribute("class", "train_info_list");
            obj.appendChild(newDiv);
        }
        function crtrnCr(i) {
            obj = document.getElementById("trnCharge");
            newDiv = document.createElement("div");
            newDiv.innerHTML = chrg[i].childNodes[0].nodeValue;
            newDiv.setAttribute("class", "train_info_list");
            obj.appendChild(newDiv);
        }
        function crtrnGr(i) {
            obj = document.getElementById("trnGrade");
            newDiv = document.createElement("div");
            newDiv.innerHTML = gradeN[i].childNodes[0].nodeValue;
            newDiv.setAttribute("class", "train_info_list");
            obj.appendChild(newDiv);
        }
        //구성요소들을 html내부에 표현합니다
    } 
}