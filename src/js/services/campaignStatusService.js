/**
 * Title - What is to be shown regarding the campaign
 * Code - All the campaign will be stored based on the code
 * btn - Array of buttons to be shown
 */
const CampaignStatuses = [
    //Basic Status
    {
        code: 0,
        title: 'In Draft',
        description: "You campaign settings are not yet complete",
        auto: true,
        class: 'x-default',
        startBtn: false,
    },
    { 
        code: 1,
        title: 'In Review', 
        description: 'Your campaign has been posted and is being verified by Xwards Review Team.',
        auto: true,
        class: 'x-default',
        startBtn: false,
    },
    { 
        code: 2,
        title: 'Rejected',
        description: 'You campaign has been rejected as it does not abide our Ads Policies',
        auto: true,
        class: 'danger',
        startBtn: false,
    },
    {
        code: 3,
        title: 'Approved',
        description: "You campaign has been approved, but not started.",
        auto: true,
        class: 'success',
        startBtn: true,
        _defaultStartBtn: false
    },

    //Approved Statuses
    { 
        code: 10, 
        title: 'Running',
        description: 'You campaign is running.',
        auto: false,
        class: 'success',
        startBtn: true,
        _defaultStartBtn: true
    },
    { 
        code: 11, 
        title: 'Paused',
        description: 'Your campaign is paused',
        auto: false,
        class: 'warning',
        startBtn: true,
        _defaultStartBtn: false
    },
    { 
        code: 13, 
        title: 'Completed', 
        description: 'Your campaign was marked completed.',
        auto: false,
        class: 'x-fused-orange',
        startBtn: false,
    },
    { 
        code: 14, 
        title: 'Completed', 
        description: 'Your campaign was successfully completed',
        auto: true,
        class: 'x-dark-default',
        startBtn: false,
    },
    //Error Statuses
    {
        code: 400,
        title: 'Not Running',
        description: 'Your campaign has been halted because of payment problem.',
        auto: true
    },

]
const CampaignStatusService = {
    getStatus: (statusId) => {
        return CampaignStatuses.find(function (status) {
            return status.code === statusId;
        });
    }
}

export default CampaignStatusService;