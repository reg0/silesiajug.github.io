function ParsedEvents(rawEvents) {
    var groupByYears = function() {    
        var withDates = rawEvents.map(function(rawEvent) {
            var date = new Date(rawEvent.time);
            return {date: date, name: rawEvent.name, link: rawEvent.link}
        });
        
        return withDates.reduce(function(result, cur){
            var year = cur.date.getFullYear();
            if (result.hasOwnProperty(year)) {
                result[year].push(cur);
            } else {
                result[year] = [cur];
            }
            return result;
        }, {});
    };
    
    return {groupByYears: groupByYears};
}

var loadMeetups = function(target, eventToListItemFn) {
    new MeetupApi().getEvents(function(responseJson) {
        var groupedByYears = new ParsedEvents(responseJson.data).groupByYears();
        var resultHtml = '';
        for (var year of Object.keys(groupedByYears).sort().reverse()) {
            resultHtml += '<li><h4>' + year + '</h4><ul>';
            groupedByYears[year].forEach(function(it) { resultHtml += '<li>' + eventToListItemFn(it) + '</li>'; });
            resultHtml += '</ul></li>';
        }
        $(target).prepend(resultHtml);
    });
};