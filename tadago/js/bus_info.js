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

function exchanger() {
    if( dep.value === "" && arr.value === ""){ 
    } else {
        let temp;
        temp = arr.selectedIndex;
        arr.selectedIndex = dep.selectedIndex;
        dep.selectedIndex = temp;
    }
}

function bus_info_finding() {
    document.getElementById("busDepPlace").innerHTML = "";
    document.getElementById("busDepPlandTime").innerHTML = "";
    document.getElementById("busArrPlace").innerHTML = "";
    document.getElementById("busArrPlandTime").innerHTML = "";
    document.getElementById("busCharge").innerHTML = "";
    document.getElementById("busGrade").innerHTML = "";

    for(l=1;l<=8;l++){
        var bus_info = new XMLHttpRequest();
        var url = 'http://apis.data.go.kr/1613000/ExpBusInfoService/getStrtpntAlocFndExpbusInfo'; /*URL*/
        var queryParams = '?' + encodeURIComponent('serviceKey') + '='+'2fscgd7sgRqJqvZjGElF7pbcCg9fuh0lVM%2BsW7RBe6pQ%2FzHcZ7ZyvGnJbLUcqQ2qeR%2FlnpopNutAgVOW33Vf%2Bg%3D%3D'; /*Service Key*/
        queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /*페이지 넘버*/
        queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('40'); /**/
        queryParams += '&' + encodeURIComponent('_type') + '=' + encodeURIComponent('xml'); /**/
        queryParams += '&' + encodeURIComponent('depTerminalId') + '=' + encodeURIComponent(dep.value); /**/
        queryParams += '&' + encodeURIComponent('arrTerminalId') + '=' + encodeURIComponent(arr.value); /**/
        queryParams += '&' + encodeURIComponent('depPlandTime') + '=' + encodeURIComponent(parseInt(depDate.value.replace('-','').replace('-',''))); /**/
        queryParams += '&' + encodeURIComponent('busGradeId') + '=' + encodeURIComponent(l); /**/
        bus_info.open('GET', url + queryParams);
        bus_info.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                bus_info_reading( this );
            }
        };
        bus_info.send('');   
    }
}

function bus_info_reading( xml ) {
    let arrPl, arrPlTm, chrg, depPl, depPlTm, gradeN; 
    //순서대로 도착지, 도착시간, 요금, 출발지, 출발시간, 버스등급
    let arrPltxt, arrPlTmtxt, chrgtxt, depPltxt, depPlTmtxt, gradeNtxt, xmlDoc;
    //순서대로 도착지, 도착시간, 요금, 출발지, 출발시간, 버스등급 입력 받을 텍스트 공간
    arrPltxt = arrPlTmtxt = chrgtxt = depPltxt = depPlTmtxt = gradeNtxt = '';
    //텍스트 공간 비우기
    xmlDoc = xml.responseXML;
    arrPl = xmlDoc.getElementsByTagName("arrPlaceNm");
    arrPlTm = xmlDoc.getElementsByTagName("arrPlandTime");
    chrg = xmlDoc.getElementsByTagName("charge");
    depPl = xmlDoc.getElementsByTagName("depPlaceNm");
    depPlTm = xmlDoc.getElementsByTagName("depPlandTime");
    gradeN = xmlDoc.getElementsByTagName("gradeNm");
    //고속버스api 내 태그들을 불러옴
    if(depPlTm.length > 0){
        //검색결과가 있을 경우
        let max = 0;
        for(j=0; j < depPlTm.length; j++){
            if(parseInt(depPlTm[j].childNodes[0].nodeValue) < parseInt(depDate.value.replace('-','').replace('-','').replace('T','').replace(':',''))){
                if( depPlTm[j].childNodes[0].nodeValue > max ){
                    max = j;
                }
            }        
        }
        //버스시간이 출발하고자 하는 시간보다 이를 경우, 해당 노드의 번호를 최대값에 저장합니다
        for(k=0; k <= max; k++){
            depPlTm[max-k].parentNode.remove();
        }
        //최대값 이하의 노드를 전부 제거합니다
        max = 0;
        //최대값을 초기화합니다
        
        for(i=0; i < arrPl.length; i++){
            crBusDep(i);
            crBusDepPl(i);
            crBusArr(i);
            crBusArrpPl(i);
            crBusCr(i);
            crBusGr(i);
        }
        function crBusDep(i) {
            obj = document.getElementById("busDepPlace");
            newDiv = document.createElement("div");
            newDiv.innerHTML = depPl[i].childNodes[0].nodeValue;
            newDiv.setAttribute("class", "bus_info_list");
            obj.appendChild(newDiv);
        }
        function crBusDepPl(i) {
            obj = document.getElementById("busDepPlandTime");
            newDiv = document.createElement("div");
            newDiv.innerHTML = depPlTm[i].childNodes[0].nodeValue.substr(8,2) + "시" + depPlTm[i].childNodes[0].nodeValue.substr(10,2) + "분";
            newDiv.setAttribute("class", "bus_info_list");
            obj.appendChild(newDiv);

        }
        function crBusArr(i) {
            obj = document.getElementById("busArrPlace");
            newDiv = document.createElement("div");
            newDiv.innerHTML = arrPl[i].childNodes[0].nodeValue;
            newDiv.setAttribute("class", "bus_info_list");
            obj.appendChild(newDiv);
        }
        function crBusArrpPl(i) {
            obj = document.getElementById("busArrPlandTime");
            newDiv = document.createElement("div");
            newDiv.innerHTML = arrPlTm[i].childNodes[0].nodeValue.substr(8,2) + "시" + arrPlTm[i].childNodes[0].nodeValue.substr(10,2) + "분";
            newDiv.setAttribute("class", "bus_info_list");
            obj.appendChild(newDiv);
        }
        function crBusCr(i) {
            obj = document.getElementById("busCharge");
            newDiv = document.createElement("div");
            newDiv.innerHTML = chrg[i].childNodes[0].nodeValue;
            newDiv.setAttribute("class", "bus_info_list");
            obj.appendChild(newDiv);
        }
        function crBusGr(i) {
            obj = document.getElementById("busGrade");
            newDiv = document.createElement("div");
            newDiv.innerHTML = gradeN[i].childNodes[0].nodeValue;
            newDiv.setAttribute("class", "bus_info_list");
            obj.appendChild(newDiv);
        }
        //구성요소들을 html내부에 표현합니다
    } 
}

