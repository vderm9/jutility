//firebase initialize

function firebase_initialize(){
	var config = {
	apiKey: "AIzaSyApJBfnH0j3TSugzEABiMFkI_tU_XXeGzg",
	authDomain: "shippy-ac235.firebaseapp.com",
	databaseURL: "https://shippy-ac235.firebaseio.com"
	};
	firebase.initializeApp(config);
	return firebase
}


function firebase_auth_user_process(user_process_func){
  firebase.auth().onAuthStateChanged((user) => {
  if (user) {
  	user_process_func(user)
    }
  });
}


//function turn an array (e.g. list of dictionaries) into a list of lists because certain functions such as datatables takes an input of a list of lists
function list_of_lists_from_array(array,keys){
	list_of_lists = [] //this is an empty list that will be filled with sublists
	array.forEach(function(dictionary_object,index){ //we're going to loop through every dictionary in the array
		sublist = []
		keys.forEach(function(key_name,key_index){ //we're also going to loop through every key
			sublist.push(dictionary_object[key_name]) //then we're going to get the key's definition to create the subli
		})
		list_of_lists.push(sublist) //push the sublist to the list_of_lists
	 })
	return list_of_lists
}




//get start_time of timer_istance_dictionary and calculate against now and then update html: current_task_start_time_elapsed
function running_task_timer(timer_instance_dictionary){
    now = moment().valueOf()  //now is the time right now
    start_time_instance = moment(timer_instance_dictionary.start_time).valueOf()
    elapsed = now - start_time_instance;
    time_text_value = moment(elapsed).subtract({hours: 19}); //have to subtract 19 hours for some reason
    time_text = time_text_value.format("HH:mm:ss")
    document.title = time_text//document.title
    $("#input_label_timer").html(time_text)
 }


function end_timer(){
  if (timer_instance_dictionary != null){
    console.log('stopping')
    end_time = moment().format()
    timer_instance_dictionary['end_time'] = end_time
    todoist_task_id = timer_instance_dictionary.id
    start_time = moment(timer_instance_dictionary.start_time).format("h:mma")
    end_time = moment(end_time).format("h:mma")
    var now = moment().valueOf()  //now is the time right now
    start_time_instance = moment(timer_instance_dictionary.start_time).valueOf()
    var elapsed = now - start_time_instance;
    seconds = elapsed/1000
    elapsed_minutes = String(parseInt(seconds/60))  //add a two minute buffer
    new_task_name = $("#current_task_input").val() + " [" + start_time + "-" + end_time + "|"+ elapsed_minutes+"min]"
    timer_instance_dictionary['new_task_name'] = new_task_name

  // $.ajax({
  //  type: "POST",
  //  data:timer_instance_dictionary,
  //  url: "https://hooks.zapier.com/hooks/catch/229795/k1jh44/",
  // })
    historical_times.push(timer_instance_dictionary) 
    todoist_update_task(String(timer_instance_dictionary.id),new_task_name) //ToDo
    //todoist_complete_task(String(todoist_task_id)) ToDo
    timer_instance.set({})
    clearInterval(timer_interval)
  }
}





//get all the current tasks from todoist
function todoist_current_tasks_pull(todoist_api_token){
 return $.ajax({
      type: "GET",
      url: 'https://en.todoist.com/api/v7/sync/',
      dataType: 'json',
      async: false,
      data: {
        'token': todoist_api_token,
        'sync_token':'*',
        'resource_types':'["items","labels","projects"]'
      }
    }).responseJSON
}


function todoist_complete_task(todoist_api_token,task_id){
  $.ajax({
      type: "GET",
      url: 'https://en.todoist.com/api/v7/sync/',
      dataType: 'json',
      async: false,
      data: {
        'token': todoist_api_token,
        'sync_token':'*',
        'resource_types':'["items"]',
        'commands':'[{"type": "item_complete", "uuid": "f8539c77-7fd7-4846-afad-3b201f0be8a5", "args": {"ids": ['+String(task_id)+']}}]'
      }
    })
}



function todoist_delete_task(todoist_api_token,task_id){
  $.ajax({
      type: "GET",
      url: 'https://en.todoist.com/api/v7/sync/',
      dataType: 'json',
      async: false,
      data: {
        'token': todoist_api_token,
        'sync_token':'*',
        'resource_types':'["items"]',
        'commands':'[{"type": "item_delete", "uuid": "f8539c77-7fd7-4846-afad-3b201f0be8a5", "args": {"ids": ['+String(task_id)+']}}]'
      }
    })
}

//https://developer.todoist.com/sync/v7/#add-two-new-tasks	
function todoist_create_task(todoist_api_token,project_id,content){
  $.ajax({
      type: "GET",
      url: 'https://en.todoist.com/api/v7/sync/',
      dataType: 'json',
      async: false,
      data: {
        'token': todoist_api_token,
        'sync_token':'*',
        'resource_types':'["projects", "items"]',
        'commands':'[{"type": "item_add", "uuid": "f8539c77-7fd7-4846-afad-3b201f0be8a5", "args": {"project_id": '+String(project_id)+',"content":"'+content+'" }}]'
      }
    })
}
//todoist_create_task("a14f98a6b546b044dbb84bcd8eee47fbe3788671",2178300883,"Test Task")
//          "args": { "project_id": "24a193a7-46f7-4314-b984-27b707bd2331", "content": "Task1" } },


function todoist_update_task(todoist_api_token,task_id,content){
  $.ajax({
      type: "GET",
      url: 'https://en.todoist.com/api/v7/sync/',
      dataType: 'json',
      async: false,
      data: {
        'token': todoist_api_token,
        'sync_token':'*',
        'resource_types':'["items"]',
        'commands':'[{"type": "item_update", "uuid": "f8539c77-7fd7-4846-afad-3b201f0be8a5", "args": {"id": '+String(task_id)+',"content":"'+content+'" }}]'
      }
    })
}


function todoist_complete_task(todoist_api_token,task_id){
  $.ajax({
      type: "GET",
      url: 'https://en.todoist.com/api/v7/sync/',
      dataType: 'json',
      async: false,
      data: {
        'token': todoist_api_token,
        'sync_token':'*',
        'resource_types':'["items"]',
        'commands':'[{"type": "item_complete", "uuid": "f8539c77-7fd7-4846-afad-3b201f0be8a5", "args": {"ids": ['+String(task_id)+']}}]'
      }
    })
}


function todoist_completed_tasks_with_offset(todoist_api_token,offset) {
    results = $.ajax({
      type: "GET",
      url: 'https://en.todoist.com/api/v7/completed/get_all',
      dataType: 'json',
      async: false,
      data: {
        'token': todoist_api_token,
        'since': '2018-02-28T10:00',
        //'since': '2017-12-30T10:00',

        'limit':'50',
        'offset':offset
      }
    });
    return results.responseJSON.items
  }


//Since todoist only lets you pull 50 tasks at a time, we're going to use a loop to get the first 50, then the second 50, then the third 50 tasks, etc. 
//when it's pulling empty lists, it can stop 
//we're going to use a while loop here (read more here: https://www.w3schools.com/js/js_loop_while.asp)
function todoist_completed_tasks_all(todoist_api_token){
  todoist_tasks_pulled = []
  iterator = 0 
  master_list = []
  while (todoist_tasks_pulled.length == 50|| iterator==0) { //if todoist pulls 50 tasks, then it should try again. when it pulls less, we know that it's the last loop we need to do. since the first loop will be less than 50 tasks length, i put in or clause that is iterator is 0 which will only be when it does the first loop
    limit_variable = 50 * iterator //this will go into the todoist completed tasks query
    todoist_tasks_pulled = todoist_completed_tasks_with_offset(todoist_api_token,limit_variable)//this is the list of tasks 
    master_list = master_list.concat(todoist_tasks_pulled)
    iterator += 1; //this will be 1 in the first loop, 2 in the second loop, etc. 
  }
  return master_list
}




function array_to_dictionary(array,key_name){
	key_name = key_name || 'id'
  new_dict = {}
  array.forEach(function(item,index){
    new_dict[String(item[key_name])] = item
  })
  return new_dict
}


//todoist_dictionary.completed_date
//"MM"
//determines if the date is this month, or today, etc. based on what strf is 
function date_range_filter(date_input,strf){
    if (date_input){
      this_month = moment().format(strf) //01

      completed_date_moment = new moment(date_input)
      completed_month = completed_date_moment.format(strf)


      return completed_month === this_month
    }
}

//filter functions on the array
//determine if todoist dictionary is recurring
function filter_recurring_tasks(dictionary_object){
  date_string = dictionary_object.date_string
  date_string = date_string || ''
  is_recurring = date_string.toLowerCase().indexOf('every') != -1
  return !is_recurring
}

function age_calculate_from_todoist_task(D){
    date_added = D.date_added
    a = new moment()
    b = new moment(date_added)
    age_days = a.diff(b,'days')
    return age_days
}

function deadline_calculate_from_todoist_task(D){
    date_added = D.due_date_utc
    date_added = date_added || new Date()
    a = new moment()
    b = new moment(date_added)
    age_days = b.diff(a,'days')
    return age_days
}

//toodoist custom functions 
function current_task_average_age(array){
  //https://momentjs.com/docs/
  age_sum = 0
  array.forEach(function(D,index){
    date_added = D.date_added
    a = new moment()
    b = new moment(date_added)
    age_days = a.diff(b,'days')

    age_sum = age_sum + age_days
    //ages.push(age_days)
  })
  denom = array.length 
  avg = age_sum/denom 
  return avg 
}

//used to sum up the total amount of minutes or hours current tasks add up to 
function aggregate_sum_array(array,key){
  total = 0
  array.forEach(function(D,index){
    key_value = D[key]
    key_value_float = parseFloat(key_value) || 0 //if it cant convert to a float, return 0
    total = total + key_value_float
  })
  return total 
}


function median(values) {
    values.sort( function(a,b) {return a - b;} );
    var half = Math.floor(values.length/2);
    if(values.length % 2)
        return values[half];
    else
        return (values[half-1] + values[half]) / 2.0;
}

function daysInMonth (month, year) {
    return new Date(year, month, 0).getDate();
}

function days_this_month(){
  r = new Date()
  return daysInMonth(r.getMonth()+1,r.getYear())
}

function metric_run_rate(metric){
  r = new Date()
  metric_per_day = metric/r.getDate()
  run_rate = metric_per_day * days_this_month()
  return run_rate
}

function today_goal_based_on_month_pace(goal_metric){
  metric_per_day = goal_metric/days_this_month()
  r = new Date()
  run_rate = metric_per_day * r.getDate()
  return run_rate
}
function score_calculate_from_todoist_task(item){
  duration =item.duration  + 1
  if (item.type == 'non-recurring'){
      age = item.age
  }
  else {
age = 0
  }
  priority = item.priority
  days_remaining = item.days_remaining + 1
  score = 1/duration + age + priority + 1/days_remaining
  score = parseInt(score)||0
  return score
}
function label_minute_string_to_integer_append(label_dictionary){
  label_string = label_dictionary.name
  label_parsed = label_string.replace("min","")
  potential_integer = parseInt(label_parsed)
  is_word = isNaN(potential_integer)
  if (is_word){
    potential_integer =  0
    return potential_integer
  }
  else {
    return potential_integer
  }
  //label_dictionary['minute'] == potential_integer
}

//gets the duration from the task of how long expected to gtake
function labels_add_from_labels_dictionary(labels_list,labels_dictionary){
  label_list_is_undefined = labels_list == undefined
  if (label_list_is_undefined){
    return 0 
  }
  r = 0 
  labels_list.forEach(function(item,index){
    label_dict = labels_dictionary[item]
    minute_number = label_minute_string_to_integer_append(label_dict)//label_dict.minute 
    r = r + minute_number
  })
  return r 
}

function current_task_median_age(array){
  values_list = []
    array.forEach(function(D,index){
    date_added = D.date_added
    a = new moment()
    b = new moment(date_added)
    age_days = a.diff(b,'days')
    values_list.push(age_days)
})
return median(values_list)


}




function task_detail_append_dictionary(item,labels_dictionary,projects_dictionary){
  if (filter_recurring_tasks(item)){
    item['type'] = 'non-recurring'
  item['age'] = age_calculate_from_todoist_task(item)

  }
  else {
    item['type'] = 'recurring'
    item['age'] = 0//age_calculate_from_todoist_task(item)

  }
  item['duration'] = labels_add_from_labels_dictionary(item.labels,labels_dictionary)
  //item['age'] = age_calculate_from_todoist_task(item)
  item['days_remaining'] = deadline_calculate_from_todoist_task(item)
  item['score'] = score_calculate_from_todoist_task(item)
  return item 
}


//add custom values to the current tasks
function task_detail_append_array(array,labels_dictionary,projects_dictionary){
  l = []
  array.forEach(function(item,index){
      item = task_detail_append_dictionary(item,labels_dictionary,projects_dictionary)
      l.push(item)
    })
  return l 
}




function html_link_from_todoist_task_dictionary(todoist_object_dictionary){
  task_title = todoist_object_dictionary.content // this is the title of the task 
  task_id = todoist_object_dictionary.id
  url = 'https://en.todoist.com/app?lang=en#task%2F'+String(task_id)
  html_task = "<a target='_blank' href='" + url + "'>" + task_title + "</a>"
  $("#task_link").html(html_task)
  return html_task 
}


function todoist_current_tasks_array_merged(todoist_api_token){
	current_tasks_base = todoist_current_tasks_pull(todoist_api_token) 
	current_tasks = current_tasks_base.items 
	labels_dictionary = current_tasks_base.labels
	labels_dictionary = array_to_dictionary(labels_dictionary) 
	projects_dictionary = current_tasks_base.projects 
	current_tasks = task_detail_append_array(current_tasks,labels_dictionary,projects_dictionary)
	return current_tasks
}

function datatables_generate_implement(table_id){
    table = $(table_id).DataTable({
                pageLength: 100,
                responsive: true,
                dom: '<"html5buttons"B>lTfgitp',
                buttons: [
                    { extend: 'copy'},
                    {extend: 'csv'},
                    {extend: 'excel', title: 'ExampleFile'},
                    {extend: 'pdf', title: 'ExampleFile'},

                    {extend: 'print',
                     customize: function (win){
                            $(win.document.body).addClass('white-bg');
                            $(win.document.body).css('font-size', '10px');
                            $(win.document.body).find('table')
                                    .addClass('compact')
                                    .css('font-size', 'inherit');
                    }
                    }
                ]

            });

  $('a.toggle-vis').on( 'click', function (e) {
        e.preventDefault();
 
        // Get the column API object
        var column = table.column( $(this).attr('data-column') );
 
        // Toggle the visibility
        column.visible( ! column.visible() );
    } );

}


function datatables_generate(array,row_replicate_func,table_id,tbody_id){
  table_html=""
  function create_table_row(item,index){
  		row_replicate_func(item)
      	table_html = table_html + $(tbody_id).html()
    }

    
    array.forEach(create_table_row)   
    $(tbody_id).html(table_html)



  }



//https://stackoverflow.com/questions/49394588/how-to-create-todoist-task-using-todoist-api-v7
todoist_add_tasks_ajax = function(todoist_api_token,tasks,sync_token) {
	var sync_token = sync_token||"*"

	tasks_is_list_array = Array.isArray(tasks)
	if (!tasks_is_list_array){
		tasks = [tasks]
	}
	var commands = todoist_tasks_to_commands(tasks);
	
	var data = {
		"token" : todoist_api_token,
		'sync_token' : sync_token,
		'resource_types' : '["projects", "items"]',
		'commands' : commands
	};
	
	return jQuery.ajax({
		url: "https://todoist.com/api/v7/sync",
		data: data,
		type: "POST",
		dataType: "json",
		success: function(response) {
			console.log(response);
			sync_token = response.sync_token;
		},
		error: function(response) { 
			console.log(response);
		},
	});
	
}

todoist_tasks_to_commands = function(tasks) {
	
	var commands = [];
	
	tasks.forEach(function(args) {
		
		var temp_commands = {
			"type": "item_add",
			"temp_id": create_guid(),
			"uuid": create_guid(),
			"args": args
		};

		commands.push(temp_commands)

	});
	
	commands = JSON.stringify(commands);
	
	return commands;
	
}

function create_guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}
