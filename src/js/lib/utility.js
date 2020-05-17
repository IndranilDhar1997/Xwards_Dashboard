import $ from "jquery";

export default  {
    showLoader: function() {
        $('#main-spinner-content-holder').css('display','block');
    },
    hideLoader: function() {
        $('#main-spinner-content-holder').css('display','none');
    },
    getUrlParams: function() {
        const searchParams = new URLSearchParams(window.location.search)
        const params = {}

        for (let key of searchParams.keys()) {
            params[key] = searchParams.get(key)
        }

        return params
    },
    secondsToHms: function(d) {
        d = Number(d);
        var h = Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60);
        var s = Math.floor(d % 3600 % 60);
    
        var hDisplay = h > 0 ? h + (h === 1 ? " H " : " Hrs ") : "";
        var mDisplay = m > 0 ? m + (m === 1 ? " Min " : " Mins ") : "";
        var sDisplay = s > 0 ? s + (s === 1 ? " Sec" : " Secs") : "";
        return hDisplay + mDisplay + sDisplay; 
    },
    toDateFormat: function(epochTime) {
        let date = new Date(epochTime*1000);
        let Months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return (date.getDate() + " " + Months[date.getMonth()] + " " + date.getFullYear());
    },
    toDateFormatForInput: function(epochtime) {
        let date = new Date(epochtime*1000);
        return date.toISOString().substr(0,10);
    },
    getFormData: function (formArr) {
        let data = {};
        formArr = formArr.map(function (ele) {
            return (data[ele.name] = ele.value);
        });
        return data;
    },
    curday: function(){
        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth()+1; //As January is 0.
        let yyyy = today.getFullYear();
        
        if(dd<10) dd='0'+dd;
        if(mm<10) mm='0'+mm;
        return (yyyy+"-"+mm+"-"+dd);
    },
    addDays: function(date, number_of_days) {
        let a = new Date(date);
        return new Date(a.getTime()+(number_of_days*24*60*60*1000));
    },
    b64toBlob: function (b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;
    
        var byteCharacters = atob(b64Data);
        var byteArrays = [];
    
        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);
    
            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
    
            var byteArray = new Uint8Array(byteNumbers);
    
            byteArrays.push(byteArray);
        }
      var blob = new Blob(byteArrays, {type: contentType});
      return blob;
    },
    dateToEpoch: function(dateString) {
        var someDate = new Date(dateString);
        someDate = (someDate.getTime())/1000;
        return someDate;
    }
}