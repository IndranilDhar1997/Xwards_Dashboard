import $ from "jquery";
import Routes from './routes';

const requestTimeout = 30000; //30 seconds

const AjaxService = {
    /**
     * Get request made to the URL
     * 
     * @param {string} url - URL to Hit
     * @param {function} successCallBack - Callback function on success
     * @param {function} errorCallBack - Callback function on error
     * @param {function} options - Object of options
     */
    get: function (url, successCallBack, errorCallBack, options) {

        options = options || {};
        errorCallBack = errorCallBack || null;
        successCallBack = successCallBack || null;

        let timeout = ('timeout' in options)? options.timeout : requestTimeout;

        return $.ajax({
            url: url,
            method: 'GET',
            headers: {
                'x-auth': localStorage.getItem('token')
            },
            timeout: timeout,
            beforeSend: function () {
                $('#main-spinner-content-holder').css('display','block');
                if ("loader" in options) {
                    if (!options.loader) $('#main-spinner-content-holder').css('display','none');
                }

                if ("beforeSend" in options) {
                    options.beforeSend();
                }
            },
            complete: function () {
                $('#main-spinner-content-holder').css('display','none');
                if ('onComplete' in options) {
                    options.onComplete();
                }
            },
            error: function (err, type, execption) {
                if (errorCallBack) errorCallBack(err, type, execption);
            },
            success: function (data, status, req) {
                if (successCallBack) successCallBack(data, status, req);
            }
        });
    },
    /**
     * Post Request
     * 
     * @param {string} URL - URL to hit
     * @param {object} data - Data Object
     * @param {function} callback - Callback function on success
     * @param {function} errorback - Callback function on error
     * @param {function} options - Object of options
     */
    post: function (url, data, successCallBack, errorCallBack, options) {
        data = data || {};
        options = options || {};
        errorCallBack = errorCallBack || null;
        successCallBack = successCallBack || null;

        let timeout = ('timeout' in options)? options.timeout : requestTimeout;

        return $.ajax({
            url: url,
            method: 'POST',
            data: data,
            cache: false,
            headers: {
                'x-auth': localStorage.getItem('token')
            },
            timeout: timeout,
            beforeSend: function () {
                $('#main-spinner-content-holder').css('display','block');
                if ("loader" in options) {
                    if (!options.loader) $('#main-spinner-content-holder').css('display','none');
                }

                if ("beforeSend" in options) {
                    options.beforeSend();
                }
            },
            complete: function () {
                $('#main-spinner-content-holder').css('display','none');
                if ('onComplete' in options) {
                    options.onComplete();
                }
            },
            error: function (err, type, execption) {
                if (errorCallBack) errorCallBack(err, type, execption);
            },
            success: function (data, status, req) {
                if (successCallBack) successCallBack(data, status, req);
            }
        });
    },
    /**
     * Update Request
     * 
     * @param {string} URL - URL to hit
     * @param {object} data - Data Object
     * @param {function} callback - Callback function on success
     * @param {function} errorback - Callback function on error
     * @param {function} options - Object of options
     */
    put: function (url, data, successCallBack, errorCallBack, options) {
        
        data = data || {};
        options = options || {};
        errorCallBack = errorCallBack || null;
        successCallBack = successCallBack || null;

        let timeout = ('timeout' in options)? options.timeout : requestTimeout;

        return $.ajax({
            url: url,
            method: 'PUT',
            data: data,
            headers: {
                'x-auth': localStorage.getItem('token')
            },
            timeout: timeout,
            beforeSend: function () {
                $('#main-spinner-content-holder').css('display','block');
                if ("loader" in options) {
                    if (!options.loader) $('#main-spinner-content-holder').css('display','none');
                }

                if ("beforeSend" in options) {
                    options.beforeSend();
                }
            },
            complete: function () {
                $('#main-spinner-content-holder').css('display','none');
                if ('onComplete' in options) {
                    options.onComplete();
                }
            },
            error: function (err, type, execption) {
                if (errorCallBack) errorCallBack(err, type, execption);
            },
            success: function (data, status, req) {
                if (successCallBack) successCallBack(data, status, req);
            }
        });
    },
    /**
     * Delete request made to the URL
     * 
     * @param {string} url - URL to Hit
     * @param {function} successCallBack - Callback function on success
     * @param {function} errorCallBack - Callback function on error
     */
    delete: function (url, successCallBack, errorCallBack, options) {

        options = options || {};
        errorCallBack = errorCallBack || null;
        successCallBack = successCallBack || null;

        let timeout = ('timeout' in options)? options.timeout : requestTimeout;

        return $.ajax({
            url: url,
            method: 'DELETE',
            headers: {
                'x-auth': localStorage.getItem('token')
            },
            timeout: timeout,
            beforeSend: function () {
                $('#main-spinner-content-holder').css('display','block');
                if ("loader" in options) {
                    if (!options.loader) $('#main-spinner-content-holder').css('display','none');
                }

                if ("beforeSend" in options) {
                    options.beforeSend();
                }
            },
            complete: function () {
                $('#main-spinner-content-holder').css('display','none');
                if ('onComplete' in options) {
                    options.onComplete();
                }
            },
            error: function (err, type, execption) {
                if (errorCallBack) errorCallBack(err, type, execption);
            },
            success: function (data, status, req) {
                if (successCallBack) successCallBack(data, status, req);
            }
        });
    },
    postImageData: function (url, data, successCallBack, errorCallBack, options) {
        data = data || {};
        options = options || {};
        errorCallBack = errorCallBack || null;
        successCallBack = successCallBack || null;

        let timeout = ('timeout' in options)? options.timeout : requestTimeout;

        return $.ajax({
            url: url,
            method: 'POST',
            processData: false,
            contentType: false,
            data: data,
            cache: false,
            headers: {
                'x-auth': localStorage.getItem('token')
            },
            timeout: timeout,
            beforeSend: function () {
                $('#main-spinner-content-holder').css('display','block');
                if ("loader" in options) {
                    if (!options.loader) $('#main-spinner-content-holder').css('display','none');
                }

                if ("beforeSend" in options) {
                    options.beforeSend();
                }
            },
            complete: function () {
                $('#main-spinner-content-holder').css('display','none');
                if ('onComplete' in options) {
                    options.onComplete();
                }
            },
            error: function (err, type, execption) {
                if (errorCallBack) errorCallBack(err, type, execption);
            },
            success: function (data, status, req) {
                if (successCallBack) successCallBack(data, status, req);
            }
        });
    },
    putImageData: function (url, data, successCallBack, errorCallBack, options) {
        data = data || {};
        options = options || {};
        errorCallBack = errorCallBack || null;
        successCallBack = successCallBack || null;

        let timeout = ('timeout' in options)? options.timeout : requestTimeout;

        return $.ajax({
            url: url,
            method: 'PUT',
            processData: false,
            contentType: false,
            data: data,
            cache: false,
            headers: {
                'x-auth': localStorage.getItem('token')
            },
            timeout: timeout,
            beforeSend: function () {
                $('#main-spinner-content-holder').css('display','block');
                if ("loader" in options) {
                    if (!options.loader) $('#main-spinner-content-holder').css('display','none');
                }

                if ("beforeSend" in options) {
                    options.beforeSend();
                }
            },
            complete: function () {
                $('#main-spinner-content-holder').css('display','none');
                if ('onComplete' in options) {
                    options.onComplete();
                }
            },
            error: function (err, type, execption) {
                if (errorCallBack) errorCallBack(err, type, execption);
            },
            success: function (data, status, req) {
                if (successCallBack) successCallBack(data, status, req);
            }
        });
    },
};

export {AjaxService, Routes};