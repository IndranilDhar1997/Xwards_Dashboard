let imagesSizes= [
    {
        name: 'wide',
        width: 852,
        height: 210,
        image: null
    },
    {
        name: 'small',
        width: 426,
        height: 210,
        image: null
    },
    {
        name: 'mid',
        width: 426,
        height: 315,
        image: null   
    }
];

const ContentDataService = {

    getImageSizes: () => {
        return imagesSizes;
    },

    getNonNullImages: () => {
        return imagesSizes.filter(function (image) {
            return (image.image != null)
        });
    },

    saveContentData: (contentData) => {
        localStorage.setItem('contentData', JSON.stringify(contentData));
    },

    getContentData: () => {
        var contentData = JSON.parse(localStorage.getItem('contentData'));
        return contentData;
    },

    removeContentData: () => {
        localStorage.removeItem('contentData');
    }

};

export default ContentDataService;