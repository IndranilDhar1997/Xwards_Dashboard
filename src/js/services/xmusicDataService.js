let imagesSizes= [
    {
        name: 'big',
        width: 426,
        height: 420,
        image: null
    },
    {
        name: 'mid',
        width: 426,
        height: 315,
        image: null   
    },
    {
        name: 'thumbnail',
        width: 504,
        height: 282,
        image: null
    }
];

const XmusicDataService = {

    getImageSizes: () => {
        return imagesSizes;
    },

    getNonNullImages: () => {
        return imagesSizes.filter(function (image) {
            return (image.image != null)
        });
    },

    saveXmusicData: (xmusicData) => {
        localStorage.setItem('xmusicData', JSON.stringify(xmusicData));
    },

    getXmusicData: () => {
        var xmusicData = JSON.parse(localStorage.getItem('xmusicData'));
        return xmusicData;
    },

    addImage: (sizename, img) => {
        for (let i in imagesSizes) {
            if (imagesSizes[i].name === sizename) {
                imagesSizes[i].image = img;
            }
        }
    },

    removeXmusicData: () => {
        localStorage.removeItem('xmusicData');
    }

};

export default XmusicDataService;