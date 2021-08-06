function changeTab() {
  $(".loadsTab").toggle();
  $(".loadsPeo").toggle();
}

function ajaxLoads()
{
  var xhr = $.ajax({
    	url: 'ajax/getLoads.json',
      // async: false,
      type: 'GET',
      dataType: 'json',
      beforeSend : function() {  
        let html = getTableCellItem("loading");
        // $("#flightSheduleTab").html(html);
        $("#loading").html(html);
        $("#loading").fadeIn("slow");
        $("#dateInfo font").html(getDate("date"));
        $("#time font").html(getDate("time"));
      },
    	success: function(data) {
    		// var tab = $("#flightSheduleTab");
    		$("#loading").fadeOut("slow");
    		if (data["loads"].length == 0)
    		{
          let html = getTableCellItem("noLoads");
          $("#flightSheduleTab").html(html);
          $("#flightSheduleTab td").fadeIn("slow");
    		}
    		else
    		{
    			var html = "";
    			
          var i;
          var countLoads = data["loads"].length;

          var textCountLoads;
          switch (true) {
            case countLoads ===1:
              textCountLoads = countLoads + " запись во взлете";
              break;
            case countLoads < 5:
              textCountLoads = countLoads + " записи во взлете";
              break;
            default:
              textCountLoads = countLoads + " записей во взлете";
          }

    			$("#dateInfo div").html("<font>" + getDate("date") + " " + "</font><font>" + textCountLoads + "</font>");
    			for(i = 0; i < countLoads; i++)
    			{
    				var ld = data["loads"][i];
    				if (ld["freePlaces"] < 0) ld["freePlaces"] = 0;
          html += getTableCellItem("info", ld["plane"], ld["number"], ld["timeLeft"], ld["status"], ld["freePlaces"]);
    			}		
    		   	html = html + "</tbody></table>";
             $("#flightSheduleTab").html(html);
    		}       	
    	},
    	error: function() {
        var html = getTableCellItem("error");
        $("#flightSheduleTab").html(html);
      }

  });
  setTimeout(function() {xhr.abort();}, 2000);
  
}

/********************GET LIST PEOPLES IN BOARD**********************/


function ajaxPeople(boardNumber) {
  let today = new Date();
  let formatDate = today.toISOString().split('T')[0];
  let xhr = $.ajax({
      url: 'ajax/getPeople_'+formatDate+'_'+boardNumber,
      type: 'GET',
      // async: false,
      dataType: 'json',
      cache: false,
      beforeSend : function() {  
        let html = getTableCellItem("loading");
        $("#peopleSheduleTab").html('');
        $("#loading").html(html);
        $("#loading").fadeIn("slow");
      },
    	success: function(data) {
        $("#loading").fadeOut("slow");
    		if (data["people"].length == 0)
    		{
          let html = "";
          html += getTableCellItem("noPeoples");
          $("#peopleSheduleTab").html(html);
          xhr = null;  
          changeTab();
          ajaxLoads();
          // let timerId = setTimeout(function() {changeTab(); ajaxLoads(); }, peopleLoadTime);
          // console.log("No people in board, timer 15 sec: " + timerId);
    		}
    		else
    		{
          let htmlLeft = "";
          let htmlRight = "";
          var countPeoples = data["people"].length;

              for(let i = 0; i < countPeoples; i++)
            {
              var ld = data["people"][i];
              if (i < 10) {
                htmlLeft += getTableCellItem("peoples",'','','','','', i + 1, ld["name"], ld["task"]);
              } else {
                htmlRight += getTableCellItem("peoples",'','','','','', i + 1, ld["name"], ld["task"]);
              }
            }	
            htmlRight += "</tbody></table>";
            if (countPeoples < 11) {
              $("#peopleSheduleTab").html(`<div class="d-flex width100 justify-content-center flex-grow-1"><font>Takeoff number ${boardNumber}</font></div><div class="flex-grow-1">${htmlLeft}</div>`);
            } else {
              $("#peopleSheduleTab").html(`<div class="d-flex width100 justify-content-center flex-grow-1"><font>Takeoff number ${boardNumber}</font></div><div class="flex-grow-1">${htmlLeft}</div><div class="flex-grow-1">${htmlRight}</div>`);
            }
        }       	 
    	},
    	error: function() {
        html = getTableCellItem("error");
        xhr = null;  
        changeTab();
        ajaxLoads();
      }
  });
  setTimeout(function() {xhr.abort();}, 2000); 
}

function getWeather()
{
  $.ajax({
    	url: 'http://192.168.1.4/weather.php',
      type: 'POST',
      dataType: 'json',
    	success: function(data) {
        console.log(`weather: ${data.temp}`);
      }
  });
}

function getTableCellItem(topic, ...other) {
  var html;

  var [plane, number, timeLeft, status, freePlaces, n, pName] = other;

  switch (topic)
  {
    case "info":
      html = `
      <div class="boardItem shadow d-flex justify-content-space-between padding-0_2em padding-0_1em" data-boardnumber="${number}">
        <div class="d-flex flex-direction-column flex0_1_auto11">
          <div class="bold">
            № ${number}
          </div>
          <div class="color-grey">
            ${plane}
          </div>
        </div>
        <div class="d-flex flex-direction-column flex-end flex0_1_em11">
          <div class="color-grey">
            ${timeLeft} min
          </div>
          <div class="d-flex flex-align-items-center color-grey">
            <img src="images/skydiving-man-icon.png">19 / ${19 - freePlaces}
          </div>
        </div>
      </div>`;
      break;
    case "peoples":
      html = `
      <div class="boardItem shadow d-flex padding-0_2em">
        <div class="d-flex width100">
          <div class="flex0_1_em bold"><font>${n}</font></div>
          <div class="flex0_1_auto"><font>${pName}</font></div>
        </div>
      </div>
      `;
      break;
    case "error":
      html = `
      <div class="d-flex justify-content-center padding-0_2em bgColor-red flex0_1_auto">
        <div>Server connection error</div>
      </div>
      <div class="d-flex justify-content-center flex1_1_auto flex-align-items-center flex-direction-column">
        <div><font class="font-size-5em">503</font></div>
        <div>Service Unavailable</div>
      </div>
      `;
      break;
    case "noLoads":
        html = `
        <div class="d-flex justify-content-space-between padding-0_2em justify-content-center flex1_1_auto flex-align-items-center">
          <div>No flights</div>
        </div>
        `;
        break;
    case "loading":
      html = `
      <div>
          <div class="dot-pulse"></div>
      </div>
      `;
      break;
    default:
      html = `
      <div class="d-flex justify-content-space-between padding-0_2em flex-grow-1">
        <div class="width100">Flights is empty</div>
      </div>
      `;
      break;
  }
  
return html;
}

function getDate(dt) {
  var answer;
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth();
  var YYYY = today.getFullYear();
  var hh = today.getHours();
  var min = today.getMinutes();
  var MM = (min < 10) ? "0" + min : min;

  var  monthNames = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн",
        "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"
      ];
  var  monthNamesAng = ["Jan", "Feb", "Mar", "Apr", "May", "June",
        "July", "Aug", "Sept", "Oct", "Nov", "Dec"
    ];
  var formatDate = dd + " " + monthNamesAng[mm] + " " + YYYY;
  var formatTime = hh + ":" +  MM;
  switch(dt) {
    case "date":
      answer = formatDate;
      break;
    case "time":
      answer = formatTime;
      break;
    default:
      answer = formatDate;
  }
  return answer;
}


/*/////////////////CLICK ON THE TABLO////////////////// */
$('#flightSheduleTab').on('click','.boardItem', function() {
  var id = $(this).get(0);
  var boardNumber = id.dataset.boardnumber;
  ajaxPeople(boardNumber);
  changeTab();
});

$('#peopleSheduleTab').on('click','', function() {
  changeTab();
});