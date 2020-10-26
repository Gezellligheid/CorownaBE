var golf = [];
var chart;

const init = function(){

    document.querySelector(".c-refresh__holder").addEventListener("click", function(){
        // document.querySelector(".c-refresh__holder").style.transform = "rotate(30deg)"
        document.querySelector(".c-refresh__holder").style.animation = "infinite-spinning 1s"
        chart.data.datasets[0].data = [];
        chart.data.labels = [];
        chart.update();
        
        setTimeout(function () {
            document.querySelector(".c-refresh__holder").style.animation = ""
            getNumbers(showData);
            // document.querySelector(".c-refresh__holder").style.transform = ""
        }, 1000);
        
    })

   
    console.log("😍 Works")
    initCharts();
    getNumbers(showData);
};

const initCharts = function(){  
    const borders = ['rgba(255, 99, 132, 1)','rgba(54, 162, 235, 1)','rgba(255, 206, 86, 1)']
    var canvas = document.querySelector('.c-data__chart-canvas').getContext('2d');
    chart = new Chart(canvas, {
        type: 'line',
        data: {
            labels: null,
            datasets: [{
                label: 'Reading',
                data: null,
                backgroundColor: 'rgba(0,0,0,0)',
                borderColor: "rgba(255, 255, 255, 1)",
                borderWidth: 2
            }]
        },
        options: {
            "horizontalLine": [{
                "y": 4.2,
                "style": "rgba(255, 255, 255, .4)",
                "text": "max"
                }, {
                "y": 4.32,
                "style": "#00ffff",
                "text": "min"
                }],
            legend: {
                display: false,
                labels: {
                    fontFamily: 'Raleway'
                }
            },
            responsive: true,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        fontColor: 'rgba(255,255,255,0.2)',
                    },
                    scaleLabel: {
                        display: false,
                        labelString: "",
                        fontColor: '#ffffff',
                    }
                    ,
                    display: true,
                    gridLines: { color: "rgba(255,255,255,0.2)" ,
                    zeroLineColor: 'rgba(255,255,255,0.2)'}
                }],
                xAxes: [{
                    ticks: {
                        autoSkip: true,
                    },
                    display: false
                }]
            },
            elements: {
                point:{
                    radius: 0
                }
            }
        }
    });

}

const showData = function(json){

    //console.log(json);
    
    data = json[json.length-1]
    data2 = json[json.length-2]
    console.log(data)
    console.log(data2)
    let deaths = data.Deaths;
    let confirmed = data.Confirmed;
    let active = data.Active;
    let newCases = confirmed - data2.Confirmed;
    let recovered = data.Recovered;
    let max = 0;
    golf = [];
    for(x of json){
        let nexData = json[json.indexOf(x)+1];
        
        //console.log(nexData)
        if(nexData != undefined){
            if(nexData.Confirmed  - x.Confirmed > max){
                max = nexData.Confirmed  - x.Confirmed;
            }
            golf.push(nexData.Confirmed  - x.Confirmed);
        }
        
    }
    chart.data.datasets[0].data = golf;
    chart.data.labels = golf;
    
    chart.update();
    let rest = max % 2000;
    let linevars = [];
    let totalLines = (max - rest) / 2000;
    for(let i = 0; i<totalLines; i++){
        linevars.push(2000*i);
    }
    linevars.push((totalLines)*2000);
    linevars.push((totalLines+1)*2000);
    console.log(linevars);
    console.log(chart.data.datasets[0].data)
    document.querySelector(".js-new-cases").innerHTML = newCases;
    document.querySelector(".js-total-cases").innerHTML = confirmed;
    document.querySelector(".js-total-recovered").innerHTML = recovered;
    document.querySelector(".js-total-deaths").innerHTML = deaths;

}


const getNumbers = function(callback){

    fetch("https://api.covid19api.com/total/country/Belgium").then(function (response) {
        return response.json();
    }).then(function (json) {
        //console.log(json);
        callback(json);
    }).catch(function(error) {
        console.error('An error occured, we handled it.', error);
    });


};

document.addEventListener("DOMContentLoaded", init);