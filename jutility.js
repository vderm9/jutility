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


function test_function () {

	alert('hi')
	
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




function array_to_dictionary(array){
  new_dict = {}
  array.forEach(function(item,index){
    new_dict[String(item.id)] = item
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






